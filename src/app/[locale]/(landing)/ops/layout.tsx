import { ReactNode } from 'react';

import { ConsoleLayout } from '@/shared/blocks/console/layout';

export default function OpsLayout({ children }: { children: ReactNode }) {
  return (
    <ConsoleLayout
      title="运营配置"
      nav={{
        items: [
          {
            title: '文案配置',
            url: '/ops/copy',
            icon: 'FileText',
          },
        ],
      }}
      topNav={{
        items: [
          {
            title: '首页',
            url: '/',
            icon: 'Home',
          },
          {
            title: '文案配置',
            url: '/ops/copy',
            icon: 'FileText',
          },
          {
            title: '生成记录',
            url: '/activity/ai-tasks',
            icon: 'Activity',
          },
          {
            title: '设置',
            url: '/settings/profile',
            icon: 'Settings',
          },
        ],
      }}
      className="py-16 md:py-20"
    >
      {children}
    </ConsoleLayout>
  );
}
