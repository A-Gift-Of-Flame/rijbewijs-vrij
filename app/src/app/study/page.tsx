import Link from 'next/link';
import Header from '@/components/Header';
import { getTopics, parseLang } from '@/lib/questions';
import { TOPIC_DISPLAY } from '@/lib/topicMeta';

export const metadata = { title: 'Study — Rijbewijs Vrij' };

export default async function StudyPage({
  searchParams,
}: {
  searchParams: Promise<{ [key: string]: string | string[] | undefined }>;
}) {
  const { lang: langParam } = await searchParams;
  const lang = parseLang(langParam);
  const topics = getTopics();

  return (
    <div className="min-h-screen bg-gray-950 text-white flex flex-col">
      <Header lang={lang} />
      <main className="flex-1 max-w-4xl mx-auto w-full px-4 py-10">
        <h1 className="text-2xl font-bold mb-2">
          {lang === 'nl' && 'Kies een onderwerp'}
          {lang === 'en' && 'Choose a topic'}
          {lang === 'fr' && 'Choisissez un sujet'}
          {lang === 'de' && 'Wählen Sie ein Thema'}
        </h1>
        <p className="text-gray-400 text-sm mb-8">
          {lang === 'nl' && `${topics.reduce((a, t) => a + t.count, 0)} vragen over ${topics.length} onderwerpen`}
          {lang === 'en' && `${topics.reduce((a, t) => a + t.count, 0)} questions across ${topics.length} topics`}
          {lang === 'fr' && `${topics.reduce((a, t) => a + t.count, 0)} questions sur ${topics.length} sujets`}
          {lang === 'de' && `${topics.reduce((a, t) => a + t.count, 0)} Fragen zu ${topics.length} Themen`}
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {topics.map((topic) => {
            const display = TOPIC_DISPLAY[topic.id];
            if (!display) return null;
            return (
              <Link
                key={topic.id}
                href={`/study/${topic.id}?lang=${lang}`}
                className="flex items-center gap-4 p-4 bg-gray-900 border border-gray-800 rounded-xl hover:border-blue-600 hover:bg-gray-800 transition-colors group"
              >
                <span className="text-2xl">{display.emoji}</span>
                <div className="flex-1 min-w-0">
                  <p className="font-medium text-white group-hover:text-blue-300 transition-colors">
                    {display.label[lang]}
                  </p>
                  <p className="text-gray-500 text-sm">
                    {topic.count}{' '}
                    {lang === 'nl' && 'vragen'}
                    {lang === 'en' && 'questions'}
                    {lang === 'fr' && 'questions'}
                    {lang === 'de' && 'Fragen'}
                  </p>
                </div>
                <span className="text-gray-600 group-hover:text-blue-400 transition-colors">→</span>
              </Link>
            );
          })}
        </div>
      </main>
    </div>
  );
}
