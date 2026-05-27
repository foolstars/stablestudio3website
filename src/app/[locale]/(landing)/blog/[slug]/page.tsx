import { notFound } from 'next/navigation';
import { setRequestLocale } from 'next-intl/server';

import { getThemeBlock } from '@/core/theme';
import { envConfigs } from '@/config';
import { getPost } from '@/shared/models/post';

export const revalidate = 3600;

export async function generateMetadata({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getPost({ slug, locale });
  if (!post) {
    return {};
  }

  const canonicalPath = `${locale === 'en' ? '/en' : ''}/blog/${slug}`;
  const canonicalUrl = `${envConfigs.app_url}${canonicalPath}`;

  return {
    title: post.title,
    description: post.description,
    alternates: {
      canonical: canonicalUrl,
    },
    openGraph: {
      type: 'article',
      locale,
      url: canonicalUrl,
      title: post.title,
      description: post.description,
      siteName: envConfigs.app_name,
    },
  };
}

export default async function BlogDetailPage({
  params,
}: {
  params: Promise<{ locale: string; slug: string }>;
}) {
  const { locale, slug } = await params;
  setRequestLocale(locale);

  const post = await getPost({ slug, locale });
  if (!post) {
    notFound();
  }

  const BlogDetail = await getThemeBlock('blog-detail');

  return <BlogDetail post={post} />;
}
