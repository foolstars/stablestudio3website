import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getThemePage } from '@/core/theme';
import { getSeoCopyMetadata } from '@/shared/lib/seo-copy-metadata';
import { getConfigs } from '@/shared/models/config';
import { applyHomeSeoCopy } from '@/shared/services/seo-copy';
import { DynamicPage } from '@/shared/types/blocks/landing';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const generateMetadata = getSeoCopyMetadata({
  titleKey: 'seo_home_title',
  descriptionKey: 'seo_home_description',
  fallbackTitle: {
    en: 'AI Music Generator',
    zh: 'AI 音乐生成器',
  },
  fallbackDescription: {
    en: 'Turn genre, mood, tempo, and instruments into playable music demos, background tracks, and audio ideas.',
    zh: '输入风格、情绪、节奏和乐器，快速生成可播放的音乐 Demo、短视频配乐和声音灵感。',
  },
  canonicalUrl: '/',
});

export default async function LandingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  const t = await getTranslations('pages.index');

  // get page data
  const page: DynamicPage = t.raw('page');
  const configs = await getConfigs();
  applyHomeSeoCopy(page, configs, locale);

  // load page component
  const Page = await getThemePage('dynamic-page');

  return <Page locale={locale} page={page} />;
}
