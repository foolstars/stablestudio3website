import { getTranslations, setRequestLocale } from 'next-intl/server';

import { getThemePage } from '@/core/theme';
import { getSeoCopyMetadata } from '@/shared/lib/seo-copy-metadata';
import { getConfigs } from '@/shared/models/config';
import { getCurrentSubscription } from '@/shared/models/subscription';
import { getUserInfo } from '@/shared/models/user';
import { applyPricingSeoCopy } from '@/shared/services/seo-copy';
import { DynamicPage } from '@/shared/types/blocks/landing';

export const dynamic = 'force-dynamic';
export const revalidate = 0;

export const generateMetadata = getSeoCopyMetadata({
  titleKey: 'seo_pricing_title',
  descriptionKey: 'seo_pricing_description',
  fallbackTitle: {
    en: 'Music Credits',
    zh: '音乐积分方案',
  },
  fallbackDescription: {
    en: 'Choose site credits to test and generate AI music.',
    zh: '选择站内积分包，开始测试和生成 AI 音乐。',
  },
  canonicalUrl: '/pricing',
});

export default async function PricingPage({
  params,
}: {
  params: Promise<{ locale: string }>;
}) {
  const { locale } = await params;
  setRequestLocale(locale);

  // get current subscription
  let currentSubscription;
  try {
    const user = await getUserInfo();
    if (user) {
      currentSubscription = await getCurrentSubscription(user.id);
    }
  } catch (error) {
    console.log('getting current subscription failed:', error);
  }

  // get pricing data
  const t = await getTranslations('pages.pricing');

  // build page sections
  const page: DynamicPage = {
    title: t.raw('page.title'),
    sections: {
      pricing: {
        ...t.raw('page.sections.pricing'),
        data: {
          currentSubscription,
        },
      },
    },
  };
  const configs = await getConfigs();
  applyPricingSeoCopy(page, configs, locale);

  // load page component
  const Page = await getThemePage('dynamic-page');

  return <Page locale={locale} page={page} />;
}
