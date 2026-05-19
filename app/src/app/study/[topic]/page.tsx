import { notFound } from 'next/navigation';
import Link from 'next/link';
import Header from '@/components/Header';
import QuestionCard from '@/components/QuestionCard';
import { getTopics, getQuestionsByTopic, parseLang } from '@/lib/questions';
import { TOPIC_DISPLAY } from '@/lib/topicMeta';

export async function generateStaticParams() {
  const topics = getTopics();
  return topics.map((t) => ({ topic: t.id }));
}

export default async function TopicPage(props: PageProps<'/study/[topic]'>) {
  const { topic } = await props.params;
  const { lang: langParam } = await props.searchParams;
  const lang = parseLang(langParam);

  const topics = getTopics();
  const topicMeta = topics.find((t) => t.id === topic);
  if (!topicMeta) notFound();

  const display = TOPIC_DISPLAY[topic];
  if (!display) notFound();

  const questions = getQuestionsByTopic(topic);

  return (
    <div className="min-h-screen bg-gray-950 text-on-surface flex flex-col">
      <Header lang={lang} />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-10">
        <div className="mb-8">
          <Link
            href={`/study?lang=${lang}`}
            className="text-sm text-gray-500 hover:text-gray-300 transition-colors mb-4 inline-block"
          >
            ← {lang === 'nl' ? 'Onderwerpen' : lang === 'en' ? 'Topics' : lang === 'fr' ? 'Sujets' : 'Themen'}
          </Link>
          <h1 className="text-2xl font-bold flex items-center gap-2">
            <span>{display.emoji}</span>
            <span>{display.label[lang]}</span>
          </h1>
          <p className="text-gray-400 text-sm mt-1">
            {questions.length}{' '}
            {lang === 'nl' && 'vragen — klik op een antwoord of "Toon antwoord" om de uitleg te zien'}
            {lang === 'en' && 'questions — click an answer or "Show answer" to reveal the explanation'}
            {lang === 'fr' && 'questions — cliquez sur une réponse ou "Show answer" pour voir l\'explication'}
            {lang === 'de' && 'Fragen — klicken Sie auf eine Antwort oder "Show answer" um die Erklärung zu sehen'}
          </p>
        </div>

        <div className="space-y-4">
          {questions.map((q, i) => (
            <QuestionCard key={q.id} question={q} lang={lang} index={i} />
          ))}
        </div>
      </main>
    </div>
  );
}
