#!/usr/bin/env python3
"""
Fetches the Belgian Wegcode (Royal Decree 1975-12-01) from ejustice.just.fgov.be
for NL, FR, and DE. Outputs one JSON file per language to app/wegcode/.

Usage: python3 scripts/fetch-wegcode.py
"""
import json
import re
import urllib.request
from datetime import date
from pathlib import Path

# German translation not available on ejustice (returns FR); omitted.
LANGS = {'nl': 'n', 'fr': 'f'}
CN = '1975120131'
BASE_URL = 'https://www.ejustice.just.fgov.be/cgi_loi/article.pl'
OUT_DIR = Path(__file__).parent.parent / 'app' / 'wegcode'

REGIONAL_SUFFIXES = (
    '_VLAAMS_GEWEST',
    '_WAALS_GEWEST',
    '_BRUSSELS_HOOFDSTEDELIJK_GEWEST',
    '_BRUSSELS',
    '_WAALS',
    '_VLAAMS',
    '_REGION_FLAMANDE',
    '_REGION_WALLONNE',
    '_REGION_DE_BRUXELLES',
)


def fetch(lang: str, la: str) -> str:
    url = f'{BASE_URL}?language={lang}&lg_txt={la}&type=&sort=&numac_search=&cn_search={CN}&caller=SUM&&view_numac={CN}n'
    req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
    with urllib.request.urlopen(req, timeout=30) as resp:
        return resp.read().decode('iso-8859-1')


def clean_text(raw: str) -> str:
    """Strip HTML, decode entities, remove KB amendment markers."""
    # BR → newline
    text = re.sub(r'<BR\s*/?>', '\n', raw, flags=re.IGNORECASE)
    # Strip all HTML tags
    text = re.sub(r'<[^>]+>', '', text)
    # HTML entities
    text = (text
            .replace('&nbsp;', ' ')
            .replace('&lt;', '<')
            .replace('&gt;', '>')
            .replace('&amp;', '&')
            .replace('&quot;', '"')
            .replace('&#39;', "'"))
    text = re.sub(r'&#(\d+);', lambda m: chr(int(m.group(1))), text)
    # Remove KB amendment refs and legal insertion/modification notes in angle brackets
    text = re.sub(r'<KB\s[^>]*>', '', text)
    text = re.sub(r'<(?:Ingevoegd|Opgeheven|Gewijzigd|Inséré|Abrogé|Modifié|Eingefügt|Aufgehoben)[^>]*>', '', text)
    # Remove footnote ref markers like ['>1 and ]'>1
    text = re.sub(r"\['>(\d+)", '[', text)
    text = re.sub(r"\]'>(\d+)", ']', text)
    # Remove (NOTA: ...) notes
    text = re.sub(r'\(NOTA:[^)]*\)', '', text, flags=re.DOTALL)
    # Strip amendment footnote block at article end (----------\n(1) KB ref...) — not useful for study
    text = re.sub(r'\n[ \t]*-{4,}[\s\S]*$', '', text)
    # Clean whitespace
    text = re.sub(r'[ \t]+', ' ', text)
    text = re.sub(r'\n +', '\n', text)
    text = re.sub(r'\n{3,}', '\n\n', text)
    return text.strip()


def parse_structure_from_toc(html: str) -> list[dict]:
    """
    Parse the TOC section (LNKR anchors) into a flat list of structure nodes.
    Returns list of {lnkId, type, number, title}.
    """
    nodes = []
    # Find all LNKR anchor positions
    lnkr_re = re.compile(r"<A NAME='(LNKR\d+)'")
    matches = list(lnkr_re.finditer(html))

    for i, m in enumerate(matches):
        lnkr_id = m.group(1)
        start = m.start()
        # Extract up to the next LNKR anchor or 500 chars, whichever is first
        end = matches[i + 1].start() if i + 1 < len(matches) else min(start + 500, len(html))
        block = html[start:end]

        # Extract the heading text from inside the anchor tag: <A ...>TITEL I.</A>
        heading_m = re.search(r'<A[^>]+>([^<]+)</A>', block)
        heading = heading_m.group(1).strip().rstrip('.') if heading_m else ''

        # Extract title: text after the </A> up to the first <BR
        after_anchor = block[heading_m.end():] if heading_m else block
        # Strip leading " - "
        after_anchor = re.sub(r'^\s*-\s*', '', after_anchor.strip())
        # Take up to first <BR (title may contain inline HTML like <b>)
        title_raw = re.split(r'<BR', after_anchor, maxsplit=1)[0]
        # Strip HTML tags
        title_raw = re.sub(r'<[^>]+>', '', title_raw)
        # Decode entities
        title_raw = (title_raw
                     .replace('&lt;', '<').replace('&gt;', '>').replace('&amp;', '&').replace('&nbsp;', ' '))
        # Strip any remaining <...> content (KB/AR amendment refs that survive entity decoding)
        title_raw = re.sub(r'<[^>]*>', '', title_raw)
        title_raw = re.sub(r'[ \t]+', ' ', title_raw).strip().rstrip('.')

        # Determine type and number from heading
        node_type = 'section'
        number = ''
        m2 = re.match(
            r'(TITEL|TITRE|TITLE|HOOFDSTUK|CHAPITRE|CHAPTER|KAPITEL|AFDELING|SECTION)\s+([IVXLC]+)\.?',
            heading, re.IGNORECASE,
        )
        if m2:
            kind = m2.group(1).upper()
            number = m2.group(2)
            node_type = 'titel' if kind in ('TITEL', 'TITRE', 'TITLE') else 'hoofdstuk'

        lnk_id = 'LNK' + lnkr_id[4:]
        nodes.append({
            'lnkrId': lnkr_id,
            'lnkId': lnk_id,
            'type': node_type,
            'number': number,
            'heading': heading,
            'title': title_raw,
        })
    return nodes


def parse_articles(html: str) -> dict[str, dict]:
    """
    Parse article blocks from the body section.
    Returns dict keyed by article ID (e.g. '1', '7bis', '59/1').
    Skips regional variants.
    """
    articles = {}

    # Find body start: first LNK body anchor
    body_start = re.search(r"<A NAME='LNK\d+'\s+HREF=", html)
    if not body_start:
        body_start = re.search(r"<A NAME='LNK\d+'", html)
    if not body_start:
        print("  WARNING: could not find body start")
        return articles

    body = html[body_start.start():]

    # Find all named anchors (both LNK structure and Art. article anchors)
    anchor_re = re.compile(r"<A NAME='([^']+)'")
    anchors = list(anchor_re.finditer(body))

    for i, match in enumerate(anchors):
        anchor_id = match.group(1)

        # Only process Art. anchors
        if not anchor_id.startswith('Art.'):
            continue

        raw_id = anchor_id[4:]  # strip 'Art.'

        # Skip regional variants
        if any(raw_id.endswith(suffix) for suffix in REGIONAL_SUFFIXES):
            continue
        if any(suffix.lstrip('_') in raw_id for suffix in REGIONAL_SUFFIXES):
            continue

        # Extract text: from this anchor to the next anchor
        start = match.start()
        end = anchors[i + 1].start() if i + 1 < len(anchors) else len(body)
        block_html = body[start:end]

        text = clean_text(block_html)

        # Try to extract article title (ALL CAPS phrase after article number)
        title = None
        title_match = re.search(
            r'(?:^|\n)\s*(?:Art(?:ikel|\.)\s+' + re.escape(raw_id) + r'\s*[.:]?\s*)([A-ZÀÂÄÉÈÊËÎÏÔÙÛÜ\s\-/]{5,}?)\.?\s*\n',
            text,
        )
        if title_match:
            title = title_match.group(1).strip()

        articles[raw_id] = {
            'id': raw_id,
            'title': title,
            'text': text,
        }

    return articles


def build_structure(nodes: list[dict], articles: dict, html: str) -> list[dict]:
    """
    Build nested structure: titels contain hoofdstukken.
    Associate article IDs to each node based on their position in the HTML.
    """
    # Determine article order from HTML body
    body_start = re.search(r"<A NAME='LNK\d+'", html)
    body = html[body_start.start():]

    # Build ordered list of (lnkId | artId, position)
    events = []
    for m in re.finditer(r"<A NAME='(LNK\d+|Art\.[^']+)'", body):
        events.append((m.group(1), m.start()))
    events.sort(key=lambda x: x[1])

    # Map lnkId → node index
    lnk_to_node = {n['lnkId']: i for i, n in enumerate(nodes)}

    # Assign articles to nodes
    current_node_idx = None
    for evt_id, _ in events:
        if evt_id.startswith('LNK'):
            current_node_idx = lnk_to_node.get(evt_id)
        elif evt_id.startswith('Art.'):
            raw_id = evt_id[4:]
            if raw_id in articles and current_node_idx is not None:
                articles[raw_id]['sectionIdx'] = current_node_idx

    # Build nested strukture: titels with chapters inside
    structure = []
    current_titel = None
    for node in nodes:
        node_out = {
            'lnkId': node['lnkId'],
            'type': node['type'],
            'number': node['number'],
            'title': node['title'],
        }
        if node['type'] == 'titel':
            node_out['children'] = []
            structure.append(node_out)
            current_titel = node_out
        else:
            # hoofdstuk or unknown: attach to current titel
            if current_titel is not None:
                current_titel['children'].append(node_out)
            else:
                structure.append(node_out)

    return structure


def process_lang(lang: str, la: str) -> dict:
    print(f'Fetching {lang.upper()}...')
    html = fetch(lang, la)

    print(f'  Parsing structure...')
    toc_nodes = parse_structure_from_toc(html)
    print(f'  Found {len(toc_nodes)} structure nodes')

    print(f'  Parsing articles...')
    articles = parse_articles(html)
    print(f'  Found {len(articles)} articles')

    structure = build_structure(toc_nodes, articles, html)

    return {
        'lang': lang,
        'fetchedAt': date.today().isoformat(),
        'source': f'{BASE_URL}?language={lang}&lg_txt={la}&type=&sort=&numac_search=&cn_search={CN}&caller=SUM&&view_numac={CN}n',
        'structure': structure,
        'articles': articles,
    }


def main():
    OUT_DIR.mkdir(parents=True, exist_ok=True)
    for lang, la in LANGS.items():
        data = process_lang(lang, la)
        out_path = OUT_DIR / f'{lang}.json'
        with open(out_path, 'w', encoding='utf-8') as f:
            json.dump(data, f, ensure_ascii=False, indent=2)
        print(f'  Written to {out_path}')


if __name__ == '__main__':
    main()
