import Header from '@/components/Header';
import Quiz from '@/components/Quiz';
import { getTopics, getQuestionsByTopic, parseLang } from '@/lib/questions';

export const metadata = { title: 'Practice Test — Rijbewijs Vrij' };

export default async function PracticePage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { lang: langParam } = await searchParams;
  const lang = parseLang(langParam);

  const topics = getTopics();
  const allQuestions = topics.flatMap((t) => getQuestionsByTopic(t.id));

  return (
    <div className="min-h-screen bg-gray-950 text-on-surface flex flex-col">
      <Header lang={lang} />
      <Quiz allQuestions={allQuestions} lang={lang} />
    </div>
  );
}
