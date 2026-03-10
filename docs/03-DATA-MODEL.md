# 03 - Data Model

## 1. Entity Relationship Diagram

```
┌──────────────┐     ┌──────────────────┐     ┌──────────────────┐
│   profiles   │     │  level_progress  │     │   achievements   │
│──────────────│     │──────────────────│     │──────────────────│
│ id (PK)      │◄───┤│ id (PK)          │     │ id (PK)          │
│ username     │     │ profile_id (FK)  │  ┌──│ profile_id (FK)  │
│ display_name │     │ operation        │  │  │ badge_key        │
│ avatar_url   │     │ level_number     │  │  │ earned_at        │
│ age_group    │     │ stars            │  │  └──────────────────┘
│ parent_email │     │ best_accuracy    │  │
│ locale       │     │ best_time_ms     │  │  ┌──────────────────┐
│ input_mode   │     │ attempts         │  │  │  ship_config     │
│ ship_config  │     │ completed_at     │  │  │──────────────────│
│ created_at   │     │ last_played_at   │  ├──│ id (PK)          │
│ updated_at   │     └──────────────────┘  │  │ profile_id (FK)  │
└──────────────┘                           │  │ ship_color       │
       │                                   │  │ ship_shape       │
       │         ┌──────────────────┐      │  │ trail_effect     │
       └────────►│  session_logs    │      │  │ companion        │
                 │──────────────────│      │  └──────────────────┘
                 │ id (PK)          │      │
                 │ profile_id (FK)  │──────┘  ┌──────────────────┐
                 │ operation        │         │  problem_logs    │
                 │ level_number     │         │──────────────────│
                 │ started_at       │◄───────┤│ id (PK)          │
                 │ ended_at         │         │ session_id (FK)  │
                 │ total_correct    │         │ problem_text     │
                 │ total_wrong      │         │ correct_answer   │
                 │ total_time_ms    │         │ user_answer      │
                 │ stars_earned     │         │ is_correct       │
                 │ streak_max       │         │ time_ms          │
                 └──────────────────┘         │ hint_used        │
                                              │ attempt_number   │
                                              └──────────────────┘
```

## 2. Table Definitions

### 2.1 profiles

Extends Supabase auth.users with game-specific data.

```sql
CREATE TABLE profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
  username TEXT UNIQUE,
  display_name TEXT NOT NULL DEFAULT 'Astronaut',
  avatar_url TEXT,
  age_group TEXT NOT NULL DEFAULT 'medium'
    CHECK (age_group IN ('young', 'medium', 'advanced')),
  -- young: 5-7, medium: 8-10, advanced: 11-12
  parent_email TEXT,
  locale TEXT NOT NULL DEFAULT 'en'
    CHECK (locale IN ('en', 'es')),
  input_mode TEXT NOT NULL DEFAULT 'auto'
    CHECK (input_mode IN ('multiple_choice', 'numeric', 'auto')),
  sound_enabled BOOLEAN NOT NULL DEFAULT true,
  music_enabled BOOLEAN NOT NULL DEFAULT true,
  total_stars INTEGER NOT NULL DEFAULT 0,
  astronaut_rank TEXT NOT NULL DEFAULT 'cadet',
  current_galaxy INTEGER NOT NULL DEFAULT 1,
  longest_streak INTEGER NOT NULL DEFAULT 0,
  total_problems_solved INTEGER NOT NULL DEFAULT 0,
  total_play_time_ms BIGINT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Auto-create profile on signup
CREATE OR REPLACE FUNCTION handle_new_user()
RETURNS TRIGGER AS $$
BEGIN
  INSERT INTO profiles (id, display_name)
  VALUES (NEW.id, COALESCE(NEW.raw_user_meta_data->>'display_name', 'Astronaut'));
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION handle_new_user();
```

### 2.2 level_progress

Tracks the best result for each level per player.

```sql
CREATE TABLE level_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  operation TEXT NOT NULL
    CHECK (operation IN ('addition', 'subtraction', 'multiplication', 'division')),
  level_number INTEGER NOT NULL CHECK (level_number BETWEEN 1 AND 20),
  stars INTEGER NOT NULL DEFAULT 0 CHECK (stars BETWEEN 0 AND 4),
  best_accuracy DECIMAL(5,2) NOT NULL DEFAULT 0,
  best_time_ms INTEGER,
  attempts INTEGER NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ,
  last_played_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(profile_id, operation, level_number)
);

CREATE INDEX idx_level_progress_profile ON level_progress(profile_id);
CREATE INDEX idx_level_progress_lookup ON level_progress(profile_id, operation, level_number);
```

### 2.3 session_logs

Records each play session (one per level attempt).

```sql
CREATE TABLE session_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  operation TEXT NOT NULL
    CHECK (operation IN ('addition', 'subtraction', 'multiplication', 'division')),
  level_number INTEGER NOT NULL CHECK (level_number BETWEEN 1 AND 20),
  started_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  ended_at TIMESTAMPTZ,
  total_correct INTEGER NOT NULL DEFAULT 0,
  total_wrong INTEGER NOT NULL DEFAULT 0,
  total_time_ms INTEGER,
  stars_earned INTEGER NOT NULL DEFAULT 0 CHECK (stars_earned BETWEEN 0 AND 4),
  streak_max INTEGER NOT NULL DEFAULT 0,
  completed BOOLEAN NOT NULL DEFAULT false
);

CREATE INDEX idx_session_logs_profile ON session_logs(profile_id);
CREATE INDEX idx_session_logs_recent ON session_logs(profile_id, started_at DESC);
```

### 2.4 problem_logs

Detailed per-problem results for analytics and review mode.

```sql
CREATE TABLE problem_logs (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  session_id UUID NOT NULL REFERENCES session_logs(id) ON DELETE CASCADE,
  problem_text TEXT NOT NULL,        -- e.g., "7 + 3"
  correct_answer INTEGER NOT NULL,
  user_answer INTEGER,
  is_correct BOOLEAN NOT NULL,
  time_ms INTEGER,                   -- time to answer in ms
  hint_used BOOLEAN NOT NULL DEFAULT false,
  attempt_number INTEGER NOT NULL DEFAULT 1,  -- 1 = first try, 2+ = retry within level
  position_in_level INTEGER NOT NULL  -- 1-20 (or more if retries added)
);

CREATE INDEX idx_problem_logs_session ON problem_logs(session_id);
```

### 2.5 achievements

Tracks earned badges/achievements.

```sql
CREATE TABLE achievements (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  badge_key TEXT NOT NULL,           -- e.g., 'first_flight', 'addition_master'
  earned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE(profile_id, badge_key)
);

CREATE INDEX idx_achievements_profile ON achievements(profile_id);
```

### 2.6 ship_config

Ship customization state.

```sql
CREATE TABLE ship_config (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  profile_id UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE UNIQUE,
  ship_color TEXT NOT NULL DEFAULT 'blue',
  ship_shape TEXT NOT NULL DEFAULT 'basic',
  trail_effect TEXT NOT NULL DEFAULT 'standard',
  companion TEXT DEFAULT NULL
);
```

## 3. Row Level Security (RLS)

All tables use RLS to ensure users can only access their own data.

```sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE level_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE session_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE problem_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE achievements ENABLE ROW LEVEL SECURITY;
ALTER TABLE ship_config ENABLE ROW LEVEL SECURITY;

-- Profiles: users can read/update their own profile
CREATE POLICY "Users can view own profile"
  ON profiles FOR SELECT USING (auth.uid() = id);
CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE USING (auth.uid() = id);

-- Level progress: users can CRUD their own progress
CREATE POLICY "Users can manage own progress"
  ON level_progress FOR ALL USING (auth.uid() = profile_id);

-- Session logs: users can insert and read their own
CREATE POLICY "Users can manage own sessions"
  ON session_logs FOR ALL USING (auth.uid() = profile_id);

-- Problem logs: accessible via session ownership
CREATE POLICY "Users can manage own problem logs"
  ON problem_logs FOR ALL
  USING (
    session_id IN (
      SELECT id FROM session_logs WHERE profile_id = auth.uid()
    )
  );

-- Achievements: users can read their own, system inserts
CREATE POLICY "Users can view own achievements"
  ON achievements FOR SELECT USING (auth.uid() = profile_id);
CREATE POLICY "Users can earn achievements"
  ON achievements FOR INSERT WITH CHECK (auth.uid() = profile_id);

-- Ship config: users can manage their own
CREATE POLICY "Users can manage own ship"
  ON ship_config FOR ALL USING (auth.uid() = profile_id);
```

## 4. TypeScript Types

```typescript
// src/lib/types.ts

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

export interface Profile {
  id: string;
  username: string | null;
  displayName: string;
  avatarUrl: string | null;
  ageGroup: AgeGroup;
  parentEmail: string | null;
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

export interface MathProblem {
  id: string;
  operand1: number;
  operand2: number;
  operation: Operation;
  correctAnswer: number;
  displayText: string;          // "7 + 3"
  choices?: number[];           // [10, 9, 11, 8] for MC mode
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

export interface UserAnswer {
  problemId: string;
  userAnswer: number | null;
  isCorrect: boolean;
  timeMs: number;
  hintUsed: boolean;
  attemptNumber: number;
}

export interface LevelResult {
  totalCorrect: number;
  totalWrong: number;
  accuracy: number;
  totalTimeMs: number;
  stars: number;
  maxStreak: number;
  passed: boolean;
  newBadges: string[];
}

export interface GalaxyInfo {
  id: number;
  operation: Operation;
  name: { en: string; es: string };
  theme: string;
  destinations: DestinationInfo[];
  unlocked: boolean;
}

export interface DestinationInfo {
  levelNumber: number;
  name: { en: string; es: string };
  type: 'planet' | 'moon' | 'star' | 'galaxy' | 'station';
  imageKey: string;
  funFact: { en: string; es: string };
  unlocked: boolean;
  stars: number;
}
```

## 5. Local Storage Schema (Offline)

For offline play, progress is cached in IndexedDB via Zustand's persist middleware:

```typescript
interface LocalProgress {
  profileId: string;
  levels: Record<string, {  // key: "addition-5"
    stars: number;
    bestAccuracy: number;
    bestTimeMs: number | null;
    attempts: number;
    completedAt: string | null;
  }>;
  pendingSyncs: PendingSync[];
  lastSyncedAt: string;
}

interface PendingSync {
  type: 'session_complete' | 'achievement_earned';
  data: unknown;
  createdAt: string;
}
```

When the app comes back online, pending syncs are pushed to Supabase in order. The server reconciles using timestamps (latest wins).
