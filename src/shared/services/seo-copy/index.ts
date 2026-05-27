import { Configs } from '@/shared/models/config';
import { DynamicPage } from '@/shared/types/blocks/landing';

export const seoCopyKeys = [
  'seo_home_title',
  'seo_home_description',
  'seo_home_hero_title',
  'seo_home_hero_highlight',
  'seo_home_hero_description',
  'seo_music_title',
  'seo_music_description',
  'seo_music_page_title',
  'seo_music_page_description',
  'seo_pricing_title',
  'seo_pricing_description',
  'seo_pricing_page_title',
  'seo_pricing_page_description',
] as const;

export type SeoCopyKey = (typeof seoCopyKeys)[number];

export type SeoCopy = Record<SeoCopyKey, string>;
export type SeoCopyLocale = 'en' | 'zh';

export const seoCopyDefaultsByLocale: Record<SeoCopyLocale, SeoCopy> = {
  en: {
    seo_home_title: 'Stable Audio 3 Generator: AI Music Maker',
    seo_home_description:
      'Create AI music with Stable Audio 3. Turn prompts into songs, loops, background music, and text to audio drafts for videos, games, podcasts, and creators.',
    seo_home_hero_title: 'Stable Audio 3 Generator for AI Music Creation',
    seo_home_hero_highlight: 'Stable Audio 3',
    seo_home_hero_description:
      'Create songs, loops, background music, and sound ideas with Stable Audio 3. Write a prompt, test the flow, then generate text to audio drafts for video, games, podcasts, ads, and creators.',
    seo_music_title: 'Stable Audio 3 Music Generator',
    seo_music_description:
      'Generate AI music with Stable Audio 3. Write prompts for songs, loops, background music, and text to audio drafts you can preview and download.',
    seo_music_page_title: 'Stable Audio 3 Music Generator',
    seo_music_page_description:
      'Use Stable Audio 3 to turn genre, mood, BPM, instruments, and lyrics into playable AI music drafts.',
    seo_pricing_title: 'Music Credits',
    seo_pricing_description:
      'Choose site credits to test and generate AI music.',
    seo_pricing_page_title: 'Music Credits',
    seo_pricing_page_description:
      'Site credits control website generation access. Real Stable Audio 3.0 calls still require Stability platform API credits.',
  },
  zh: {
    seo_home_title: 'AI 音乐生成器',
    seo_home_description:
      '输入风格、情绪、节奏和乐器，快速生成可播放的音乐 Demo、短视频配乐和声音灵感。',
    seo_home_hero_title: 'AI 音乐生成器',
    seo_home_hero_highlight: '音乐生成',
    seo_home_hero_description:
      '输入风格、情绪、节奏和乐器，快速生成可播放的音乐 Demo、短视频配乐和声音灵感。',
    seo_music_title: 'AI 音乐生成器',
    seo_music_description:
      '输入音乐方向、情绪、速度和乐器，快速生成可播放的 AI 音频。',
    seo_music_page_title: 'AI 音乐生成器',
    seo_music_page_description:
      '输入音乐方向、情绪、速度和乐器，快速生成可播放的 AI 音频。',
    seo_pricing_title: '音乐积分方案',
    seo_pricing_description: '选择站内积分包，开始测试和生成 AI 音乐。',
    seo_pricing_page_title: '音乐积分方案',
    seo_pricing_page_description:
      '站内积分用于控制网站生成次数；正式调用 Stable Audio 3.0 时，还需要 Stability 官方 API credits。',
  },
};

export const seoCopyDefaults: SeoCopy = seoCopyDefaultsByLocale.zh;

export function normalizeSeoCopyLocale(locale?: string): SeoCopyLocale {
  return locale === 'zh' || locale === 'zh-CN' ? 'zh' : 'en';
}

export function getLocalizedSeoCopyKey(key: SeoCopyKey, locale?: string) {
  return `${key}_${normalizeSeoCopyLocale(locale)}`;
}

export function getLocalizedSeoCopyValue(
  configs: Configs,
  key: SeoCopyKey,
  locale?: string,
  fallback?: string
) {
  const normalizedLocale = normalizeSeoCopyLocale(locale);
  const localizedKey = getLocalizedSeoCopyKey(key, normalizedLocale);
  const localizedValue = configs[localizedKey]?.trim();
  if (localizedValue) {
    return localizedValue;
  }

  if (normalizedLocale === 'zh') {
    const legacyValue = configs[key]?.trim();
    if (legacyValue) {
      return legacyValue;
    }
  }

  return fallback || seoCopyDefaultsByLocale[normalizedLocale][key];
}

export function applyHomeSeoCopy(
  page: DynamicPage,
  configs: Configs,
  locale?: string
) {
  const hero = page.sections?.hero as any;
  if (!hero) {
    return page;
  }

  hero.title = getLocalizedSeoCopyValue(
    configs,
    'seo_home_hero_title',
    locale,
    hero.title
  );
  hero.highlight_text = getLocalizedSeoCopyValue(
    configs,
    'seo_home_hero_highlight',
    locale,
    hero.highlight_text
  );
  hero.description = getLocalizedSeoCopyValue(
    configs,
    'seo_home_hero_description',
    locale,
    hero.description
  );

  return page;
}

export function applyPricingSeoCopy(
  page: DynamicPage,
  configs: Configs,
  locale?: string
) {
  page.title = getLocalizedSeoCopyValue(
    configs,
    'seo_pricing_page_title',
    locale,
    page.title
  );

  const pricing = page.sections?.pricing as any;
  if (pricing) {
    pricing.title = getLocalizedSeoCopyValue(
      configs,
      'seo_pricing_page_title',
      locale,
      pricing.title
    );
    pricing.description = getLocalizedSeoCopyValue(
      configs,
      'seo_pricing_page_description',
      locale,
      pricing.description
    );
  }

  return page;
}
