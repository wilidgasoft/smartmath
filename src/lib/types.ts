// ── Core Game Types ──

export type Operation = 'addition' | 'subtraction' | 'multiplication' | 'division';
export type AgeGroup = 'young' | 'medium' | 'advanced';
export type InputMode = 'multiple_choice' | 'numeric' | 'auto';
export type Locale = 'en' | 'es';

export type AstronautRank =
  | 'cadet'
  | 'junior_astronaut'
  | 'astronaut'
  | 'senior_astronaut'
  | 'commander'
  | 'captain';

// ── Profile & User ──

export interface Profile {
  id: string;
  userId: string;
  displayName: string;
  avatarUrl: string | null;
  ageGroup: AgeGroup;
  locale: Locale;
  inputMode: InputMode;
  soundEnabled: boolean;
  musicEnabled: boolean;
  totalStars: number;
  astronautRank: AstronautRank;
  currentGalaxy: number;
  longestStreak: number;
  totalProblemsSolved: number;
  totalPlayTimeMs: number;
  createdAt: string;
  updatedAt: string;
}

// ── Level Progress ──

export interface LevelProgress {
  id: string;
  profileId: string;
  operation: Operation;
  levelNumber: number;
  stars: number;
  bestAccuracy: number;
  bestTimeMs: number | null;
  attempts: number;
  completedAt: string | null;
  lastPlayedAt: string;
}

export type ProgressMap = Map<string, LevelProgress>;

// ── Math Problems ──

export interface MathProblem {
  id: string;
  operand1: number;
  operand2: number;
  operation: Operation;
  correctAnswer: number;
  displayText: string;
  choices?: number[];
}

// ── Hint Types ──

export type HintType = 'blocks' | 'groups' | 'number_line' | 'splitting';

export interface HintVisual {
  group1?: number;
  group2?: number;
  total?: number;
  removed?: number;
  remaining?: number;
  groups?: number;
  itemsPerGroup?: number;
  perGroup?: number;
}

export interface HintContent {
  type: HintType;
  description: { en: string; es: string };
  visual: HintVisual;
}

// ── Game Session ──

export interface UserAnswer {
  problemId: string;
  userAnswer: number | null;
  isCorrect: boolean;
  timeMs: number;
  hintUsed: boolean;
  attemptNumber: number;
}

export interface GameSession {
  operation: Operation;
  levelNumber: number;
  problems: MathProblem[];
  currentIndex: number;
  answers: UserAnswer[];
  streak: number;
  maxStreak: number;
  hintsRemaining: number;
  startedAt: number;
}

export type GameState = 'countdown' | 'playing' | 'feedback' | 'complete' | 'paused';

// ── Score & Results ──

export interface ScoreResult {
  totalCorrect: number;
  totalWrong: number;
  accuracy: number;
  stars: number;
  passed: boolean;
  timeBonus: boolean;
  totalTimeMs: number;
}

export interface LevelResult extends ScoreResult {
  operation: Operation;
  levelNumber: number;
  maxStreak: number;
  newBadges: string[];
}

// ── Galaxy & Destinations ──

export interface DestinationInfo {
  levelNumber: number;
  name: { en: string; es: string };
  type: 'planet' | 'moon' | 'star' | 'nebula' | 'galaxy' | 'station' | 'object' | 'cluster';
  imageKey: string;
  color: string;
  funFact: { en: string; es: string };
}

export interface GalaxyInfo {
  id: number;
  operation: Operation;
  name: { en: string; es: string };
  description: { en: string; es: string };
  theme: {
    primary: string;
    secondary: string;
    accent: string;
    bg: string;
  };
  destinations: DestinationInfo[];
}

// ── Ship ──

export interface ShipConfig {
  shipColor: string;
  shipShape: string;
  trailEffect: string;
  companion: string | null;
}

// ── Local Storage (offline) ──

export interface PendingSync {
  id: string;
  type: 'session_complete' | 'achievement_earned';
  data: unknown;
  createdAt: string;
}

export interface LocalLevelProgress {
  stars: number;
  bestAccuracy: number;
  bestTimeMs: number | null;
  attempts: number;
  completedAt: string | null;
}
