import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { AgeGroup, InputMode, Locale } from '@/lib/types';

interface SettingsStore {
  locale: Locale;
  inputMode: InputMode;
  soundEnabled: boolean;
  musicEnabled: boolean;
  ageGroup: AgeGroup;

  setLocale: (locale: Locale) => void;
  setInputMode: (mode: InputMode) => void;
  toggleSound: () => void;
  toggleMusic: () => void;
  setAgeGroup: (group: AgeGroup) => void;
}

export const useSettingsStore = create<SettingsStore>()(
  persist(
    (set) => ({
      locale: 'en',
      inputMode: 'auto',
      soundEnabled: true,
      musicEnabled: true,
      ageGroup: 'medium',

      setLocale: (locale) => set({ locale }),
      setInputMode: (inputMode) => set({ inputMode }),
      toggleSound: () => set((s) => ({ soundEnabled: !s.soundEnabled })),
      toggleMusic: () => set((s) => ({ musicEnabled: !s.musicEnabled })),
      setAgeGroup: (ageGroup) => set({ ageGroup }),
    }),
    {
      name: 'smartmath-settings',
      version: 1,
    }
  )
);
