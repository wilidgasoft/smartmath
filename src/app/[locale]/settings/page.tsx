'use client';

import { useTranslations, useLocale } from 'next-intl';
import { useRouter } from 'next/navigation';
import { NavHeader } from '@/components/layout/NavHeader';
import { Card } from '@/components/ui';
import { useSettingsStore } from '@/store/settingsStore';
import type { AgeGroup, InputMode, Locale } from '@/lib/types';

export default function SettingsPage() {
  const t = useTranslations('settings');
  const locale = useLocale() as Locale;
  const router = useRouter();
  const settings = useSettingsStore();

  return (
    <div className="min-h-screen flex flex-col bg-space">
      <NavHeader title={t('title')} backHref={`/${locale}/profile`} />

      <div className="flex-1 overflow-y-auto px-4 py-6 max-w-lg mx-auto w-full space-y-4">
        {/* Language */}
        <Card>
          <h3 className="font-heading font-bold text-white mb-3">🌐 {t('language')}</h3>
          <div className="flex gap-2">
            {(['en', 'es'] as Locale[]).map((l) => (
              <button
                key={l}
                onClick={() => {
                  settings.setLocale(l);
                  router.push(`/${l}/settings`);
                }}
                className={`flex-1 py-2 rounded-xl font-heading font-semibold text-sm border transition-colors ${
                  locale === l
                    ? 'bg-primary border-primary text-white'
                    : 'border-white/20 text-white/60 hover:text-white'
                }`}
              >
                {l === 'en' ? '🇺🇸 English' : '🇪🇸 Español'}
              </button>
            ))}
          </div>
        </Card>

        {/* Sound */}
        <Card>
          <h3 className="font-heading font-bold text-white mb-3">🔊 Audio</h3>
          <ToggleSetting
            label={t('sound')}
            value={settings.soundEnabled}
            onToggle={settings.toggleSound}
            on={t('on')}
            off={t('off')}
          />
          <ToggleSetting
            label={t('music')}
            value={settings.musicEnabled}
            onToggle={settings.toggleMusic}
            on={t('on')}
            off={t('off')}
          />
        </Card>

        {/* Input Mode */}
        <Card>
          <h3 className="font-heading font-bold text-white mb-3">🎮 {t('inputMode')}</h3>
          <div className="space-y-2">
            {(['auto', 'multiple_choice', 'numeric'] as InputMode[]).map((mode) => (
              <button
                key={mode}
                onClick={() => settings.setInputMode(mode)}
                className={`w-full text-left py-2 px-4 rounded-xl text-sm font-body border transition-colors ${
                  settings.inputMode === mode
                    ? 'bg-primary/20 border-primary text-white'
                    : 'border-white/10 text-white/60 hover:text-white'
                }`}
              >
                {mode === 'auto' ? `🤖 ${t('auto')}` : mode === 'multiple_choice' ? `🔵 ${t('multipleChoice')}` : `⌨️ ${t('numeric')}`}
              </button>
            ))}
          </div>
        </Card>

        {/* Age Group */}
        <Card>
          <h3 className="font-heading font-bold text-white mb-3">🎂 {t('ageGroup')}</h3>
          <div className="space-y-2">
            {(['young', 'medium', 'advanced'] as AgeGroup[]).map((group) => (
              <button
                key={group}
                onClick={() => settings.setAgeGroup(group)}
                className={`w-full text-left py-2 px-4 rounded-xl text-sm font-body border transition-colors ${
                  settings.ageGroup === group
                    ? 'bg-primary/20 border-primary text-white'
                    : 'border-white/10 text-white/60 hover:text-white'
                }`}
              >
                {group === 'young' ? `🌱 ${t('young')}` : group === 'medium' ? `🚀 ${t('medium')}` : `⚡ ${t('advanced')}`}
              </button>
            ))}
          </div>
        </Card>

        {/* About */}
        <Card>
          <h3 className="font-heading font-bold text-white mb-2">ℹ️ {t('about')}</h3>
          <p className="text-white/50 text-sm">SmartMath: Space Voyage v0.1.0</p>
          <p className="text-white/30 text-xs mt-1">Built with ❤️ for curious kids</p>
        </Card>
      </div>
    </div>
  );
}

function ToggleSetting({
  label,
  value,
  onToggle,
  on,
  off,
}: {
  label: string;
  value: boolean;
  onToggle: () => void;
  on: string;
  off: string;
}) {
  return (
    <div className="flex items-center justify-between py-2">
      <span className="text-white/70 font-body text-sm">{label}</span>
      <button
        onClick={onToggle}
        className={`px-4 py-1 rounded-full text-xs font-semibold transition-colors ${
          value ? 'bg-success text-white' : 'bg-white/10 text-white/50'
        }`}
      >
        {value ? on : off}
      </button>
    </div>
  );
}
