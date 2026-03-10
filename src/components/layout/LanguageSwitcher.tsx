'use client';

import { useLocale } from 'next-intl';
import { useRouter, usePathname } from 'next/navigation';
import { motion } from 'framer-motion';

export function LanguageSwitcher() {
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();

  const switchLocale = (newLocale: string) => {
    // Replace the locale segment in the pathname
    const segments = pathname.split('/');
    segments[1] = newLocale;
    router.push(segments.join('/'));
  };

  return (
    <div className="flex items-center gap-1 bg-white/5 rounded-full p-1">
      {['en', 'es'].map((l) => (
        <motion.button
          key={l}
          onClick={() => switchLocale(l)}
          whileTap={{ scale: 0.95 }}
          className={`px-3 py-1 rounded-full text-sm font-body font-medium transition-colors ${
            locale === l
              ? 'bg-primary text-white'
              : 'text-white/60 hover:text-white'
          }`}
          aria-label={l === 'en' ? 'Switch to English' : 'Cambiar a Español'}
          aria-pressed={locale === l}
        >
          {l === 'en' ? '🇺🇸 EN' : '🇪🇸 ES'}
        </motion.button>
      ))}
    </div>
  );
}
