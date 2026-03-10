'use client';

import { motion } from 'framer-motion';
import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import { SpaceScene } from '@/components/game/SpaceScene';
import { Spaceship } from '@/components/game/Spaceship';
import { LanguageSwitcher } from '@/components/layout/LanguageSwitcher';
import { Button } from '@/components/ui';

export default function HomePage() {
  const t = useTranslations('app');
  const locale = useLocale();
  const router = useRouter();
  const { data: session } = useSession();

  return (
    <main className="relative min-h-screen flex flex-col items-center justify-center overflow-hidden">
      {/* Space background */}
      <div className="absolute inset-0">
        <SpaceScene />
      </div>

      {/* Animated ship flying across */}
      <div className="absolute top-1/4 w-full h-16 pointer-events-none overflow-hidden">
        <motion.div
          initial={{ x: '-10%' }}
          animate={{ x: '110%' }}
          transition={{ duration: 8, repeat: Infinity, repeatDelay: 4, ease: 'linear' }}
          className="absolute top-0"
          style={{ width: 56, height: 56 }}
        >
          <Spaceship progress={0} streak={3} className="relative" />
        </motion.div>
      </div>

      {/* Content */}
      <div className="relative z-10 text-center px-6 max-w-md mx-auto">
        <motion.div
          initial={{ y: -40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ type: 'spring', stiffness: 200, damping: 20 }}
        >
          <div className="text-6xl mb-4">🚀</div>
          <h1
            className="font-heading font-bold text-white mb-2"
            style={{
              fontSize: 'clamp(2rem,8vw,3.5rem)',
              textShadow: '0 0 40px rgba(59,130,246,0.6), 0 0 80px rgba(59,130,246,0.3)',
            }}
          >
            SmartMath
          </h1>
          <p
            className="font-heading text-blue-300 mb-8"
            style={{ fontSize: 'clamp(1rem,4vw,1.5rem)' }}
          >
            Space Voyage
          </p>
          <p className="text-white/60 font-body mb-8 text-sm">{t('subtitle')}</p>
        </motion.div>

        <motion.div
          initial={{ y: 40, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, type: 'spring', stiffness: 200, damping: 20 }}
          className="space-y-3"
        >
          <Button
            variant="primary"
            size="lg"
            className="w-full"
            onClick={() => router.push(`/${locale}/galaxy`)}
          >
            🎮 {t('startAdventure')}
          </Button>

          {!session ? (
            <Button
              variant="secondary"
              size="lg"
              className="w-full"
              onClick={() => router.push(`/${locale}/login`)}
            >
              👤 {t('login')}
            </Button>
          ) : (
            <Button
              variant="ghost"
              size="md"
              className="w-full"
              onClick={() => router.push(`/${locale}/profile`)}
            >
              👨‍🚀 My Profile
            </Button>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-8 flex justify-center"
        >
          <LanguageSwitcher />
        </motion.div>
      </div>
    </main>
  );
}
