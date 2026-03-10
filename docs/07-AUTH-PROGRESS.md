# 07 - Authentication & Progress Tracking

## 1. Design Goals

- **Frictionless for kids:** A child should be able to start playing within 30 seconds
- **Secure:** Parent email required for account creation (COPPA-mindful)
- **Persistent:** Progress is never lost, even offline
- **Simple:** No complex passwords — age-appropriate auth

## 2. Authentication Options

### 2.1 Guest Play (Zero Friction)

```
Flow:
1. User taps "Start Adventure"
2. Prompt: "What's your astronaut name?" (text input)
3. Prompt: "How old are you?" (age selector: 5-12)
4. Game starts immediately

Storage: LocalStorage + IndexedDB (device only)
```

- No account created in Supabase
- Progress stored locally on device only
- Prompt to create account appears:
  - After completing 3 levels
  - When closing the app ("Save your progress forever?")
  - On the profile screen
- Guest can upgrade to full account anytime without losing progress

### 2.2 Easy Account Creation

```
Flow:
1. User taps "Create Account" (or upgrade from guest)
2. Display Name: "What's your astronaut name?" (pre-filled if guest)
3. Parent Email: "Ask a parent for their email" (with visual helper)
4. Password: Simple 4-digit PIN or parent-set password
5. Age group auto-detected from previous input
6. Verification email sent to parent
7. Account active immediately (email verification optional but encouraged)
```

**Implementation:**

```typescript
// Supabase signup with metadata
const { data, error } = await supabase.auth.signUp({
  email: parentEmail,
  password: password,     // or generated from PIN
  options: {
    data: {
      display_name: astronautName,
      age_group: ageGroup,
      is_child_account: true,
    },
  },
});
```

### 2.3 Magic Link (Passwordless)

For returning users or parent-managed accounts:

```
Flow:
1. Enter parent email
2. Magic link sent to parent's email
3. Parent clicks link → child is logged in
4. Session persists for 30 days
```

### 2.4 Social Login (Optional, Phase 2)

- Google Sign-In (via parent's Google account)
- Apple Sign-In

## 3. Account Model

### For Children's Accounts

```typescript
interface ChildAccount {
  id: string;                 // UUID
  parentEmail: string;        // Required for COPPA
  displayName: string;        // "AstroKid", "SpaceQueen", etc.
  ageGroup: 'young' | 'medium' | 'advanced';
  pin?: string;               // Optional 4-digit PIN (hashed)
  locale: 'en' | 'es';
  createdAt: string;
  lastLoginAt: string;
}
```

### Multiple Children per Parent

A single parent email can have multiple child profiles:

```
Parent Email: parent@example.com
├── Child 1: "AstroKid" (age 7)
├── Child 2: "SpaceQueen" (age 10)
└── Child 3: "RocketBoy" (age 5)
```

Implementation: After login, if multiple profiles exist for the same parent email, show a profile selector:

```
┌─────────────────────────────────────────┐
│                                         │
│    Who's playing today?                 │
│                                         │
│    ┌──────┐  ┌──────┐  ┌──────┐       │
│    │ 👦   │  │ 👧   │  │ 👶   │       │
│    │Astro │  │Space │  │Rocket│       │
│    │ Kid  │  │Queen │  │ Boy  │       │
│    └──────┘  └──────┘  └──────┘       │
│                                         │
│         ┌──────────────┐               │
│         │ + Add Player │               │
│         └──────────────┘               │
│                                         │
└─────────────────────────────────────────┘
```

## 4. Session Management

```typescript
// Middleware checks session on protected routes
export async function middleware(request: NextRequest) {
  const supabase = createServerClient(/* config */);
  const { data: { session } } = await supabase.auth.getSession();

  // If no session, redirect to login (unless guest route)
  if (!session && isProtectedRoute(request.nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // Refresh session if close to expiry
  await supabase.auth.getSession();

  return NextResponse.next();
}
```

**Session durations:**
- Authenticated: 30 days (auto-refresh)
- Guest: Indefinite (localStorage), but prompt to save
- Session refresh: Silent, using refresh tokens

## 5. Progress Tracking Architecture

### 5.1 What We Track

```typescript
interface ProgressData {
  // Per-level
  levels: {
    operation: Operation;
    level: number;
    stars: number;            // 0-4
    bestAccuracy: number;     // 0-100
    bestTimeMs: number;
    attempts: number;
    completedAt: string | null;
  }[];

  // Aggregate stats
  stats: {
    totalStars: number;
    totalProblemsSolved: number;
    totalPlayTimeMs: number;
    longestStreak: number;
    averageAccuracy: number;
    problemsPerOperation: Record<Operation, number>;
  };

  // Collections
  badges: string[];           // earned badge keys
  planets: string[];          // visited planet keys

  // Session history (last 50)
  recentSessions: {
    operation: Operation;
    level: number;
    stars: number;
    accuracy: number;
    playedAt: string;
  }[];
}
```

### 5.2 Save Strategy

**Dual-write pattern: Local + Remote**

```typescript
async function saveProgress(result: LevelResult): Promise<void> {
  // 1. Save locally FIRST (instant, offline-safe)
  await localStore.saveLevelResult(result);

  // 2. Try to save remotely (best-effort)
  try {
    await supabaseClient
      .from('level_progress')
      .upsert({
        profile_id: userId,
        operation: result.operation,
        level_number: result.level,
        stars: Math.max(result.stars, existingStars),  // keep best
        best_accuracy: Math.max(result.accuracy, existingAccuracy),
        best_time_ms: Math.min(result.timeMs, existingTime),
        attempts: existingAttempts + 1,
        completed_at: result.passed ? new Date().toISOString() : null,
        last_played_at: new Date().toISOString(),
      }, {
        onConflict: 'profile_id,operation,level_number',
      });

    // Also save session log
    await supabaseClient
      .from('session_logs')
      .insert({ /* session data */ });

  } catch (error) {
    // Queue for later sync
    await localStore.addPendingSync({
      type: 'session_complete',
      data: result,
      createdAt: new Date().toISOString(),
    });
  }
}
```

### 5.3 Sync on Reconnect

```typescript
// Register sync event
if ('serviceWorker' in navigator && 'SyncManager' in window) {
  const registration = await navigator.serviceWorker.ready;
  await registration.sync.register('sync-progress');
}

// In service worker
self.addEventListener('sync', (event) => {
  if (event.tag === 'sync-progress') {
    event.waitUntil(syncPendingProgress());
  }
});

async function syncPendingProgress() {
  const pending = await localStore.getPendingSyncs();
  for (const sync of pending) {
    try {
      await pushToSupabase(sync);
      await localStore.removePendingSync(sync.id);
    } catch {
      break; // Will retry next sync event
    }
  }
}
```

### 5.4 Progress Merge (Guest → Account)

When a guest creates an account, merge local progress:

```typescript
async function mergeGuestProgress(userId: string): Promise<void> {
  const localProgress = await localStore.getAllProgress();

  for (const level of localProgress.levels) {
    await supabaseClient
      .from('level_progress')
      .upsert({
        profile_id: userId,
        ...level,
      }, {
        onConflict: 'profile_id,operation,level_number',
        // Use greatest values for stars, accuracy, etc.
      });
  }

  // Clear guest local data after successful merge
  await localStore.clearGuestData();
}
```

## 6. Parent Dashboard (Phase 2)

A simple dashboard for parents to view their children's progress:

```
URL: /parent-dashboard (requires parent email verification)

Features:
- View all children's profiles
- See progress per child: levels completed, accuracy trends
- Set play time limits (optional)
- View weak areas (most-missed problems)
- Export progress report (PDF)
```

## 7. Data Privacy & COPPA Considerations

- **Minimal data collection:** Only parent email, display name, age group
- **No advertising:** Game is ad-free
- **No social features:** No chat, messaging, or public profiles
- **Parent control:** Parent email required, can request data deletion
- **Data export:** Parents can export all child data on request
- **Encryption:** All data in transit (HTTPS) and at rest (Supabase encryption)
- **Retention:** Inactive accounts auto-archived after 2 years
- **Cookie policy:** Only essential cookies (auth session)
