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

export const seoCopyDefaults: SeoCopy = {
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
};

export function getSeoCopyValue(
  configs: Configs,
  key: SeoCopyKey,
  fallback?: string
) {
  return configs[key]?.trim() || fallback || seoCopyDefaults[key];
}

export function applyHomeSeoCopy(page: DynamicPage, configs: Configs) {
  const hero = page.sections?.hero as any;
  if (!hero) {
    return page;
  }

  hero.title = getSeoCopyValue(configs, 'seo_home_hero_title', hero.title);
  hero.highlight_text = getSeoCopyValue(
    configs,
    'seo_home_hero_highlight',
    hero.highlight_text
  );
  hero.description = getSeoCopyValue(
    configs,
    'seo_home_hero_description',
    hero.description
  );

  return page;
}

export function applyPricingSeoCopy(page: DynamicPage, configs: Configs) {
  page.title = getSeoCopyValue(configs, 'seo_pricing_page_title', page.title);

  const pricing = page.sections?.pricing as any;
  if (pricing) {
    pricing.title = getSeoCopyValue(
      configs,
      'seo_pricing_page_title',
      pricing.title
    );
    pricing.description = getSeoCopyValue(
      configs,
      'seo_pricing_page_description',
      pricing.description
    );
  }

  return page;
}
