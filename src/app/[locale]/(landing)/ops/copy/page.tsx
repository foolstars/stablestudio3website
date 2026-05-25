import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';

import { Button } from '@/shared/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/shared/components/ui/card';
import { Input } from '@/shared/components/ui/input';
import { Label } from '@/shared/components/ui/label';
import { Textarea } from '@/shared/components/ui/textarea';
import { locales } from '@/config/locale';
import { getConfigs, saveConfigs } from '@/shared/models/config';
import { getUserInfo } from '@/shared/models/user';
import {
  seoCopyDefaults,
  seoCopyKeys,
} from '@/shared/services/seo-copy';
import type { SeoCopyKey } from '@/shared/services/seo-copy';

const copyFields: {
  key: SeoCopyKey;
  label: string;
  description: string;
  type?: 'input' | 'textarea';
}[] = [
  {
    key: 'seo_home_title',
    label: '首页 SEO 标题',
    description: '浏览器标题和搜索结果标题。',
  },
  {
    key: 'seo_home_description',
    label: '首页 SEO 描述',
    description: '搜索结果和分享卡片描述。',
    type: 'textarea',
  },
  {
    key: 'seo_home_hero_title',
    label: '首页首屏标题',
    description: '首页首屏主标题。',
  },
  {
    key: 'seo_home_hero_highlight',
    label: '首页首屏高亮词',
    description: '首页标题中的重点词。',
  },
  {
    key: 'seo_home_hero_description',
    label: '首页首屏描述',
    description: '首页首屏标题下方描述。',
    type: 'textarea',
  },
  {
    key: 'seo_music_title',
    label: '音乐生成器 SEO 标题',
    description: '开始生成页面的浏览器标题和搜索标题。',
  },
  {
    key: 'seo_music_description',
    label: '音乐生成器 SEO 描述',
    description: '开始生成页面的搜索结果和分享描述。',
    type: 'textarea',
  },
  {
    key: 'seo_music_page_title',
    label: '音乐生成器页面标题',
    description: '开始生成页面正文顶部标题。',
  },
  {
    key: 'seo_music_page_description',
    label: '音乐生成器页面描述',
    description: '开始生成页面正文顶部描述。',
    type: 'textarea',
  },
  {
    key: 'seo_pricing_title',
    label: '价格页 SEO 标题',
    description: '价格页浏览器标题和搜索标题。',
  },
  {
    key: 'seo_pricing_description',
    label: '价格页 SEO 描述',
    description: '价格页搜索结果和分享描述。',
    type: 'textarea',
  },
  {
    key: 'seo_pricing_page_title',
    label: '价格页页面标题',
    description: '价格页正文标题。',
  },
  {
    key: 'seo_pricing_page_description',
    label: '价格页页面描述',
    description: '价格页正文描述。',
    type: 'textarea',
  },
];

async function saveCopy(formData: FormData) {
  'use server';

  const user = await getUserInfo();
  if (!user) {
    throw new Error('no auth');
  }

  const values = Object.fromEntries(
    seoCopyKeys.map((key) => [key, String(formData.get(key) || '').trim()])
  );

  await saveConfigs(values);
  revalidatePath('/');
  revalidatePath('/ai-music-generator');
  revalidatePath('/pricing');
  revalidatePath('/ops/copy');
  locales.forEach((locale) => {
    revalidatePath(`/${locale}`);
    revalidatePath(`/${locale}/ai-music-generator`);
    revalidatePath(`/${locale}/pricing`);
    revalidatePath(`/${locale}/ops/copy`);
  });

  redirect('/ops/copy?saved=1');
}

export default async function OpsCopyPage({
  searchParams,
}: {
  searchParams: Promise<{ saved?: string }>;
}) {
  const user = await getUserInfo();
  if (!user) {
    redirect('/sign-in?callbackUrl=/ops/copy');
  }

  const { saved } = await searchParams;
  const configs = await getConfigs();

  return (
    <div className="max-w-4xl space-y-6">
      <div className="space-y-2">
        <h2 className="text-2xl font-semibold tracking-tight">文案配置</h2>
        <p className="text-muted-foreground text-sm">
          修改首页和价格页测试文案，保存后刷新对应页面即可查看效果。
        </p>
      </div>

      {saved === '1' && (
        <div className="border-primary/20 bg-primary/5 text-primary rounded-md border px-4 py-3 text-sm">
          已保存文案配置。
        </div>
      )}

      <Card className="rounded-lg">
        <CardHeader>
          <CardTitle>运营测试文案</CardTitle>
          <CardDescription>
            留空会使用代码里的默认文案；这里只影响已接入的首页、音乐生成器页和价格页。
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form action={saveCopy} className="space-y-6">
            {copyFields.map((field) => {
              const value = configs[field.key] || seoCopyDefaults[field.key];

              return (
                <div key={field.key} className="grid gap-2">
                  <Label htmlFor={field.key}>{field.label}</Label>
                  {field.type === 'textarea' ? (
                    <Textarea
                      id={field.key}
                      name={field.key}
                      defaultValue={value}
                      rows={4}
                    />
                  ) : (
                    <Input id={field.key} name={field.key} defaultValue={value} />
                  )}
                  <p className="text-muted-foreground text-xs">
                    {field.description}
                  </p>
                </div>
              );
            })}

            <div className="flex flex-wrap items-center gap-3 pt-2">
              <Button type="submit">保存文案</Button>
              <Button asChild type="button" variant="outline">
                <a href="/" target="_blank">
                  查看首页
                </a>
              </Button>
              <Button asChild type="button" variant="outline">
                <a href="/ai-music-generator" target="_blank">
                  查看生成器
                </a>
              </Button>
              <Button asChild type="button" variant="outline">
                <a href="/pricing" target="_blank">
                  查看价格页
                </a>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
