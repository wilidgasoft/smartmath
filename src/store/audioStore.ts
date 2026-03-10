import { create } from 'zustand';

type SoundEffect =
  | 'correct'
  | 'wrong'
  | 'launch'
  | 'landing'
  | 'click'
  | 'streak-3'
  | 'streak-5'
  | 'streak-10'
  | 'badge'
  | 'countdown'
  | 'star';

type MusicTrack = 'galaxy-1' | 'galaxy-2' | 'galaxy-3' | 'galaxy-4';

interface AudioStore {
  currentTrack: MusicTrack | null;
  volume: number;
  isMuted: boolean;

  playEffect: (effect: SoundEffect) => void;
  playMusic: (track: MusicTrack) => void;
  stopMusic: () => void;
  setVolume: (volume: number) => void;
  toggleMute: () => void;
}

export const useAudioStore = create<AudioStore>((set) => ({
  currentTrack: null,
  volume: 0.7,
  isMuted: false,

  playEffect: (_effect: SoundEffect) => {
    // Actual implementation is in useSound hook (Howler.js)
    // This store just tracks state
  },

  playMusic: (track: MusicTrack) => {
    set({ currentTrack: track });
  },

  stopMusic: () => {
    set({ currentTrack: null });
  },

  setVolume: (volume: number) => {
    set({ volume: Math.min(1, Math.max(0, volume)) });
  },

  toggleMute: () => {
    set((state) => ({ isMuted: !state.isMuted }));
  },
}));

export type { SoundEffect, MusicTrack };
