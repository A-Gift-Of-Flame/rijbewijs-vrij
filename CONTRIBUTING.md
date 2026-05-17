# Contributing to rijbewijs-vrij

Thanks for helping build a free Belgian driving theory question bank.

## What we need

- New questions (any topic, any language)
- Corrections to existing questions
- Verified questions (`"verified": false` → `true` after peer review)
- Translations (NL is primary; EN/FR/DE welcome)

## Question format

Questions live in `questions/topics/<topic>.json`. Each entry:

```jsonc
{
  "id": "ROW-021",           // topic prefix + 3-digit sequential number
  "topic": "right_of_way",   // must match the filename
  "verified": false,         // set true only after independent review
  "question": {
    "nl": "...",
    "en": "...",
    "fr": "...",   // AI translation acceptable — add caveat in PR description
    "de": "..."    // same
  },
  "options": {
    "nl": ["optie A", "optie B", "optie C"],
    "en": ["option A", "option B", "option C"],
    "fr": ["..."],
    "de": ["..."]
  },
  "correct": 1,              // 0-based index of the correct option
  "explanation": {
    "nl": "...",
    "en": "...",
    "fr": "...",
    "de": "..."
  },
  "legal_ref": "Wegcode art. 12"  // Belgian Wegcode article, KB, or regulation
}
```

## ID prefixes per topic

| Topic file | Prefix |
|---|---|
| right_of_way | ROW |
| speed_limits | SPD |
| traffic_signs | TRF |
| road_markings | RMK |
| safe_distances | DST |
| alcohol_drugs | ALC |
| motorway | MOT |
| vulnerable_road_users | VRU |
| vehicle_safety | VEH |
| first_aid | AID |
| environmental | ENV |

Pick the next unused sequential number for the prefix (check the existing file).

## Rules

1. **Source from law, not memory.** Base every question on the Belgian Wegcode, a KB (Koninklijk Besluit), or an official regulation. Cite the article in `legal_ref`.
2. **One correct answer only.** All distractors must be clearly wrong. No trick questions.
3. **No proprietary content.** Do not copy questions from GOCA, commercial prep sites, or copyrighted materials.
4. **NL required.** Other languages can be AI-translated — mark this in your PR description. AI translations are shown with a caveat in the UI.
5. **`verified: false` by default.** A question becomes `verified: true` only when a second contributor independently confirms it is legally correct.
6. **No duplicate questions.** Check the topic file before adding.

## How to submit

1. Fork the repo
2. Add or edit questions in `questions/topics/<topic>.json`
3. Update the `count` in `questions/index.json`
4. Open a PR with a brief description:
   - What you added/changed
   - Which Wegcode article(s) you based it on
   - Whether FR/DE translations are AI-generated

PRs with legal citations merge faster.

## Reporting errors

Open an issue with:
- The question ID (e.g. `DST-006`)
- What is wrong
- The correct answer and its legal basis

## License

Questions in `questions/` are released under **CC0 1.0 Universal** — effectively public domain. By submitting a PR you agree to release your contribution under CC0.
