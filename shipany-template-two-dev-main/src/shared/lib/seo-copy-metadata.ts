import { Metadata } from 'next';
import { setRequestLocale } from 'next-intl/server';

import { envConfigs } from '@/config';
import { defaultLocale } from '@/config/locale';
import { getConfigs } from '@/shared/models/config';
import {
  getSeoCopyValue,
  SeoCopyKey,
} from '@/shared/services/seo-copy';

export function getSeoCopyMetadata({
  titleKey,
  descriptionKey,
  fallbackTitle,
  fallbackDescription,
  canonicalUrl,
}: {
  titleKey: SeoCopyKey;
  descriptionKey: SeoCopyKey;
  fallbackTitle: string;
  fallbackDescription: string;
  canonicalUrl: string;
}) {
  return async function generateMetadata({
    params,
  }: {
    params: Promise<{ locale: string }>;
  }): Promise<Metadata> {
    const { locale } = await params;
    setRequestLocale(locale);

    const configs = await getConfigs();
    const title = getSeoCopyValue(configs, titleKey, fallbackTitle);
    const description = getSeoCopyValue(
      configs,
      descriptionKey,
      fallbackDescription
    );
    const canonical = getCanonicalUrl(canonicalUrl, locale);
    const imageUrl = envConfigs.app_preview_image.startsWith('http')
      ? envConfigs.app_preview_image
      : `${envConfigs.app_url}${envConfigs.app_preview_image}`;

    return {
      title,
      description,
      alternates: {
        canonical,
      },
      openGraph: {
        type: 'website',
        locale,
        url: canonical,
        title,
        description,
        siteName: envConfigs.app_name,
        images: [imageUrl],
      },
      twitter: {
        card: 'summary_large_image',
        title,
        description,
        images: [imageUrl],
        site: envConfigs.app_url,
      },
    };
  };
}

function getCanonicalUrl(canonicalUrl: string, locale: string) {
  const path = canonicalUrl.startsWith('/') ? canonicalUrl : `/${canonicalUrl}`;

  const localizedPath =
    !locale || locale === defaultLocale ? path : `/${locale}${path}`;

  return `${envConfigs.app_url}${localizedPath === '/' ? '' : localizedPath}`;
}
