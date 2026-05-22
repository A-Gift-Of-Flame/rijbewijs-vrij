import type { WegcodeArticle } from '@/lib/wegcode';

export default function WegcodeArticleView({ article }: { article: WegcodeArticle }) {
  // bg-gray-900/border-gray-800: inverted scale in globals.css → light=white card, dark=dark card
  return (
    <div
      id={`Art.${article.id}`}
      className="mb-3 p-4 rounded-lg border border-gray-800 bg-gray-900 scroll-mt-20 wegcode-article overflow-x-hidden"
    >
      <p className="text-xs font-mono text-gray-500 mb-2">Art. {article.id}</p>
      <p className="text-sm text-foreground whitespace-pre-wrap font-sans leading-relaxed break-words">
        {article.text}
      </p>
    </div>
  );
}
