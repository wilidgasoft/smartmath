import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type {
  AstronautRank,
  LocalLevelProgress,
  Operation,
  PendingSync,
} from '@/lib/types';
import { RANK_THRESHOLDS } from '@/lib/constants';

type ProgressKey = string; // "operation-level"

interface ProgressStore {
  profileId: string | null;
  levels: Record<ProgressKey, LocalLevelProgress>;
  badges: string[];
  totalStars: number;
  astronautRank: AstronautRank;
  longestStreak: number;
  pendingSyncs: PendingSync[];

  // Actions
  setProfileId: (id: string) => void;
  updateLevelProgress: (operation: Operation, level: number, data: LocalLevelProgress) => void;
  earnBadge: (badgeKey: string) => void;
  addPendingSync: (sync: Omit<PendingSync, 'id' | 'createdAt'>) => void;
  removePendingSync: (id: string) => void;
  recalculateRank: () => void;
  clearProgress: () => void;
}

function calculateRank(totalStars: number): AstronautRank {
  if (totalStars >= RANK_THRESHOLDS.captain) return 'captain';
  if (totalStars >= RANK_THRESHOLDS.commander) return 'commander';
  if (totalStars >= RANK_THRESHOLDS.senior_astronaut) return 'senior_astronaut';
  if (totalStars >= RANK_THRESHOLDS.astronaut) return 'astronaut';
  if (totalStars >= RANK_THRESHOLDS.junior_astronaut) return 'junior_astronaut';
  return 'cadet';
}

export const useProgressStore = create<ProgressStore>()(
  persist(
    (set, get) => ({
      profileId: null,
      levels: {},
      badges: [],
      totalStars: 0,
      astronautRank: 'cadet',
      longestStreak: 0,
      pendingSyncs: [],

      setProfileId: (id) => set({ profileId: id }),

      updateLevelProgress: (operation, level, data) => {
        const key = `${operation}-${level}`;
        const existing = get().levels[key];
        const prevStars = existing?.stars ?? 0;
        const newStars = Math.max(data.stars, prevStars);
        const starDelta = newStars - prevStars;

        set((state) => {
          const newTotal = state.totalStars + starDelta;
          return {
            levels: {
              ...state.levels,
              [key]: {
                ...data,
                stars: newStars,
                bestAccuracy: Math.max(data.bestAccuracy, existing?.bestAccuracy ?? 0),
                bestTimeMs:
                  data.bestTimeMs != null && existing?.bestTimeMs != null
                    ? Math.min(data.bestTimeMs, existing.bestTimeMs)
                    : data.bestTimeMs ?? existing?.bestTimeMs ?? null,
                attempts: (existing?.attempts ?? 0) + 1,
              },
            },
            totalStars: newTotal,
            astronautRank: calculateRank(newTotal),
            longestStreak: Math.max(state.longestStreak, data.bestTimeMs ?? 0),
          };
        });
      },

      earnBadge: (badgeKey) => {
        set((state) => {
          if (state.badges.includes(badgeKey)) return state;
          return { badges: [...state.badges, badgeKey] };
        });
      },

      addPendingSync: (sync) => {
        set((state) => ({
          pendingSyncs: [
            ...state.pendingSyncs,
            {
              ...sync,
              id: `sync-${Date.now()}-${Math.random()}`,
              createdAt: new Date().toISOString(),
            },
          ],
        }));
      },

      removePendingSync: (id) => {
        set((state) => ({
          pendingSyncs: state.pendingSyncs.filter((s) => s.id !== id),
        }));
      },

      recalculateRank: () => {
        const { totalStars } = get();
        set({ astronautRank: calculateRank(totalStars) });
      },

      clearProgress: () => {
        set({
          profileId: null,
          levels: {},
          badges: [],
          totalStars: 0,
          astronautRank: 'cadet',
          longestStreak: 0,
          pendingSyncs: [],
        });
      },
    }),
    {
      name: 'smartmath-progress',
      version: 1,
    }
  )
);
