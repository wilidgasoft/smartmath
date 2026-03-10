'use client';

import { useRouter } from 'next/navigation';
import { useTranslations } from 'next-intl';
import { Button } from '@/components/ui';

interface NavHeaderProps {
  title?: string;
  backHref?: string;
  rightContent?: React.ReactNode;
}

export function NavHeader({ title, backHref, rightContent }: NavHeaderProps) {
  const router = useRouter();
  const t = useTranslations('nav');

  return (
    <header className="flex items-center gap-3 px-4 py-3 bg-space-card/80 backdrop-blur-sm border-b border-white/10">
      {backHref && (
        <Button
          variant="ghost"
          size="sm"
          onClick={() => router.push(backHref)}
          aria-label={t('back')}
          className="!min-h-[40px] !px-3"
        >
          ← {t('back')}
        </Button>
      )}
      {title && (
        <h1 className="flex-1 font-heading font-bold text-white text-lg truncate">{title}</h1>
      )}
      {rightContent && <div className="ml-auto">{rightContent}</div>}
    </header>
  );
}
