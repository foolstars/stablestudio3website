import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { getThemePage } from '@/core/theme';
import { envConfigs } from '@/config';
import { getLocalPage } from '@/shared/models/post';

const pageSlugs = ['privacy-policy', 'terms-of-service'] as const;

export const revalidate = 3600;

export function generateStaticParams() {
  return pageSlugs.map((slug) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  if (!pageSlugs.includes(slug as (typeof pageSlugs)[number])) {
    return {};
  }

  const page = await getLocalPage({ slug, locale });
  if (!page) {
    return {};
  }

  const canonicalPath = `${locale === 'en' ? '/en' : ''}/${slug}`;
  const canonicalUrl = `${envConfigs.app_url}${canonicalPath}`;

  return {
    title: page.title,
    description: page.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'website',
      locale,
      url: canonicalUrl,
      title: page.title,
      description: page.description,
      siteName: envConfigs.app_name,
    },
  };
}

export default async function StaticContentPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  if (!pageSlugs.includes(slug as (typeof pageSlugs)[number])) {
    notFound();
  }

  const post = await getLocalPage({ slug, locale });
  if (!post) {
    notFound();
  }

  const StaticPage = await getThemePage('static-page');

  return <StaticPage post={post} />;
}
