import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getThemePage } from '@/core/theme';
import { MusicGenerator } from '@/shared/blocks/generator';
import { getSeoCopyMetadata } from '@/shared/lib/seo-copy-metadata';
import { getConfigs } from '@/shared/models/config';
import { getLocalizedSeoCopyValue } from '@/shared/services/seo-copy';
import { DynamicPage } from '@/shared/types/blocks/landing';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const generateMetadata = getSeoCopyMetadata({
  titleKey: 'seo_music_title',
  descriptionKey: 'seo_music_description',
  fallbackTitle: {
    en: 'AI Music Generator',
    zh: 'AI 音乐生成器',
  },
  fallbackDescription: {
    en: 'Turn musical direction, mood, tempo, and instruments into playable AI audio.',
    zh: '输入音乐方向、情绪、速度和乐器，快速生成可播放的 AI 音频。',
  },
  canonicalUrl: '/ai-music-generator',
});

export default async function AiMusicGeneratorPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // get ai music data
  const t = await getTranslations('ai.music');
  const configs = await getConfigs();

  // build page sections
  const page: DynamicPage = {
    sections: {
      hero: {
        title: getLocalizedSeoCopyValue(
          configs,
          'seo_music_page_title',
          locale,
          t.raw('page.title')
        ),
        description: getLocalizedSeoCopyValue(
          configs,
          'seo_music_page_description',
          locale,
          t.raw('page.description')
        ),
      },
      generator: {
        component: <MusicGenerator srOnlyTitle={t.raw('generator.title')} />,
      },
    },
  };

  // load page component
  const Page = await getThemePage('dynamic-page');

  return <Page locale={locale} page={page} />;
}
