# 09 - Implementation Prompts for AI Agent

## How to Use This Document

This document contains sequential prompts for an AI coding agent to build SmartMath: Space Voyage from scratch. Each prompt should be executed in order. The agent should read the referenced documentation files for full context before implementing.

**Prerequisites:** The agent should have access to all files in the `docs/` folder.

---

## Phase 0: Docker & Infrastructure

### Prompt 0.1 — Docker & Database Setup

```
Read docs/11-DOCKER-DEPLOYMENT.md for the complete Docker and self-hosted specification.

Create the Docker infrastructure files in the project root:

1. Dockerfile — Multi-stage build (deps → builder → runner) as specified in docs/11-DOCKER-DEPLOYMENT.md section 3.1:
   - Stage 1 (deps): Install npm dependencies
   - Stage 2 (builder): Generate Prisma client, build Next.js standalone
   - Stage 3 (runner): Minimal production image with standalone output
   - Non-root user (nextjs:nodejs)
   - Include Prisma runtime files

2. docker-compose.yml — Production compose as specified in docs/11-DOCKER-DEPLOYMENT.md section 3.2:
   - PostgreSQL 16 (alpine) with health check, volume for data persistence, bound to 127.0.0.1
   - Next.js app container depending on healthy db
   - Migrate service (profile: migrate) for running Prisma migrations
   - Cloudflare Tunnel container (cloudflared) with token from env
   - Shared network: smartmath-net

3. docker-compose.dev.yml — Development overrides as specified in docs/11-DOCKER-DEPLOYMENT.md section 3.3:
   - App uses volume mount for hot reload
   - DB port exposed to host
   - Tunnel only runs with explicit profile

4. .dockerignore — Exclude node_modules, .next, .git, docs, tests, env files

5. .env.example — All environment variables from docs/11-DOCKER-DEPLOYMENT.md section 4:
   - POSTGRES_DB, POSTGRES_USER, POSTGRES_PASSWORD
   - DATABASE_URL
   - NEXTAUTH_SECRET, NEXTAUTH_URL
   - SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASSWORD, SMTP_FROM
   - CLOUDFLARE_TUNNEL_TOKEN
   - NEXT_PUBLIC_APP_URL, NEXT_PUBLIC_DEFAULT_LOCALE

6. scripts/setup.sh — Ubuntu server setup script from docs/11-DOCKER-DEPLOYMENT.md section 10.2
7. scripts/deploy.sh — Deployment script from docs/11-DOCKER-DEPLOYMENT.md section 10.4
8. scripts/backup.sh — Database backup script from docs/11-DOCKER-DEPLOYMENT.md section 10.5

Make all scripts executable (chmod +x).
```

---

## Phase 1: Project Setup & Foundation

### Prompt 1.1 — Initialize Next.js Project

```
Create a new Next.js 14+ project with the App Router in the current directory (SmartMath/). Use TypeScript, Tailwind CSS, and ESLint. The project name is "smartmath".

Install these dependencies:
- next, react, react-dom (latest)
- typescript, @types/react, @types/node
- tailwindcss, postcss, autoprefixer
- framer-motion (animations)
- zustand (state management)
- next-intl (internationalization)
- howler, @types/howler (sound)
- prisma, @prisma/client (database ORM)
- next-auth@beta, @auth/prisma-adapter (authentication)
- bcryptjs, @types/bcryptjs (password hashing)
- nodemailer (email for magic links)
- @ducanh2912/next-pwa (PWA support)

Dev dependencies:
- vitest, @testing-library/react (testing)
- prettier, eslint-config-prettier

Configure:
- tsconfig.json with path alias "@/*" pointing to "src/*"
- tailwind.config.ts with custom colors from docs/06-UI-UX-DESIGN.md section 6
- Add Google Fonts: "Fredoka One", "Nunito", "Space Mono" via next/font
- next.config.mjs with output: 'standalone' (required for Docker)
- Create .env.example with all variables from docs/11-DOCKER-DEPLOYMENT.md section 4
- Set up the folder structure exactly as described in docs/02-ARCHITECTURE.md section 2

Create placeholder files for the folder structure (empty files are fine for now).
```

### Prompt 1.2 — Set Up Internationalization

```
Read docs/08-I18N.md for full specification.

Set up next-intl with the App Router:
1. Create src/i18n/config.ts with locales ['en', 'es'] and defaultLocale 'en'
2. Create src/i18n/request.ts for server-side locale loading
3. Create src/middleware.ts combining next-intl middleware (locale routing)
4. Create the [locale] dynamic segment in the app directory
5. Create src/i18n/messages/en.json with ALL translations from docs/08-I18N.md section 3
6. Create src/i18n/messages/es.json with ALL Spanish translations from docs/08-I18N.md section 3
7. Create the LanguageSwitcher component from docs/08-I18N.md section 5
8. Update the root layout to wrap with NextIntlClientProvider

Test: visiting /en should show English, /es should show Spanish.
```

### Prompt 1.3 — Set Up Prisma & Database Schema

```
Read docs/11-DOCKER-DEPLOYMENT.md section 5 for the complete Prisma schema.
Read docs/03-DATA-MODEL.md for the data model specification.

Set up Prisma ORM:

1. Initialize Prisma: npx prisma init
2. Create prisma/schema.prisma with the FULL schema from docs/11-DOCKER-DEPLOYMENT.md section 5:
   - NextAuth.js required models: Account, Session, VerificationToken, User
   - Game models: Profile, LevelProgress, SessionLog, ProblemLog, Achievement, ShipConfig
   - Enums: Operation, AgeGroup, InputMode
   - All relations, indexes, and unique constraints
3. Create src/lib/prisma.ts — Prisma client singleton (from docs/11-DOCKER-DEPLOYMENT.md section 6)

Set up NextAuth.js (replaces Supabase Auth):

1. Create src/lib/auth.ts with NextAuth.js configuration from docs/11-DOCKER-DEPLOYMENT.md section 6:
   - PrismaAdapter for database sessions
   - EmailProvider for magic link login (using SMTP env vars)
   - CredentialsProvider for email + password/PIN login
   - JWT session strategy with 30-day expiry
   - Custom pages pointing to /login
2. Create src/app/api/auth/[...nextauth]/route.ts — NextAuth API route
3. Create src/app/api/health/route.ts — Health check endpoint (from docs/11-DOCKER-DEPLOYMENT.md section 12)
4. Update src/middleware.ts to combine NextAuth session check with i18n middleware

Create TypeScript types:
1. Create src/lib/types.ts with ALL type definitions from docs/03-DATA-MODEL.md section 4
2. Also add the constants from docs/01-GAME-DESIGN.md (PASS_THRESHOLD, STAR_THRESHOLDS, etc.)

Generate initial migration:
  npx prisma migrate dev --name initial_schema

Test: Start PostgreSQL with docker compose up db -d, then run npx prisma migrate dev.
```

---

## Phase 2: Core Game Engine

### Prompt 2.1 — Math Problem Engine

```
Read docs/04-MATH-ENGINE.md for complete specification.

Create src/engine/problems.ts implementing:
1. generateProblems(operation, level) — returns 20 MathProblem objects
2. generateAddition(level) — Addition: N + M where M = 1..20
3. generateSubtraction(level) — Subtraction: (N+i) - N = i where i = 0..19
4. generateMultiplication(level) — Multiplication: N × M where M = 1..20
5. generateDivision(level) — Division: (N×M) ÷ N = M where M = 1..20

Each function must follow the exact formulas in docs/04-MATH-ENGINE.md sections 2.2-2.5.

Create src/engine/distractors.ts implementing:
1. generateDistractors(correctAnswer, operation) — returns 3 plausible wrong answers
2. generateChoices(correctAnswer, operation) — returns shuffled array of [correct, ...distractors]
Follow the distractor strategy from docs/04-MATH-ENGINE.md section 3.

Create unit tests in tests/unit/problems.test.ts:
- Test that each operation generates exactly 20 problems per level
- Test that subtraction never produces negative answers
- Test that division always produces whole number answers
- Test that distractors never include the correct answer
- Test level 1 and level 20 for each operation
- Test boundary conditions
```

### Prompt 2.2 — Scoring & Progression Engine

```
Read docs/04-MATH-ENGINE.md sections 4-6 and docs/01-GAME-DESIGN.md section 3.

Create src/engine/scoring.ts implementing:
1. calculateScore(answers, totalTimeMs, ageGroup) — returns ScoreResult with stars, accuracy, pass/fail
2. Star thresholds: 1★=80%, 2★=90%, 3★=100%, 4★=100%+time bonus
3. Pass threshold: 80% (16/20)
4. Time bonus thresholds per age group: young=60s, medium=40s, advanced=30s

Create src/engine/progression.ts implementing:
1. isLevelUnlocked(operation, level, progress) — checks if a level is available
2. getNextLevel(currentOp, currentLevel, progress) — returns next level to play
3. Galaxy unlock: Need level 10 of previous operation to unlock next operation
4. Within galaxy: Need to pass (≥1 star) previous level

Create src/engine/hints.ts implementing:
1. generateHint(problem) — returns HintContent with visual breakdown per operation type
Follow docs/04-MATH-ENGINE.md section 7.

Create src/engine/review.ts implementing:
1. getWeakProblems(problemHistory, limit) — returns problems with highest error rate
Follow docs/04-MATH-ENGINE.md section 6.

Create unit tests in tests/unit/scoring.test.ts and tests/unit/progression.test.ts:
- Test star calculation for various accuracy levels
- Test time bonus for each age group
- Test level unlock logic (within galaxy and between galaxies)
- Test that level 1 addition is always unlocked
- Test that multiplication unlocks after addition level 10
```

### Prompt 2.3 — State Management (Zustand Stores)

```
Read docs/02-ARCHITECTURE.md section 4.3 and docs/03-DATA-MODEL.md section 5.

Create Zustand stores:

1. src/store/gameStore.ts — Current game session state:
   - operation, levelNumber, problems[], currentIndex, answers[], streak, maxStreak, hintsRemaining, startedAt
   - Actions: startLevel, submitAnswer, useHint, resetLevel
   - This store is ephemeral (not persisted)

2. src/store/progressStore.ts — Player progress:
   - levels (Map of completed levels with stars), badges, totalStars, astronautRank, longestStreak
   - Actions: updateLevelProgress, earnBadge, recalculateRank
   - Persisted to localStorage with Zustand persist middleware
   - Includes pendingSyncs array for offline queue

3. src/store/settingsStore.ts — User preferences:
   - locale, inputMode, soundEnabled, musicEnabled, ageGroup
   - Actions: setLocale, setInputMode, toggleSound, toggleMusic, setAgeGroup
   - Persisted to localStorage

4. src/store/audioStore.ts — Sound state:
   - currentTrack, volume, isMuted
   - Actions: playEffect, playMusic, stopMusic, setVolume
   - Not persisted

All stores should use TypeScript strictly. Include proper type exports.
```

---

## Phase 3: UI Components

### Prompt 3.1 — UI Primitives

```
Read docs/06-UI-UX-DESIGN.md for design specifications.

Create reusable UI components in src/components/ui/:

1. Button.tsx — Primary, secondary, ghost variants. Large touch targets (min 56px height). Rounded corners. Framer Motion press animation (scale 0.95). Color variants: primary (blue), success (green), warning (amber), ghost (transparent).

2. Card.tsx — Dark card with border glow. Glassmorphism effect (backdrop-blur). Hover animation (scale 1.02). Variants: default, interactive (clickable), locked (dimmed).

3. Modal.tsx — Centered overlay modal. Fade-in backdrop. Scale-up entrance animation. Close on backdrop click. Accessible with focus trap.

4. ProgressBar.tsx — Animated progress bar. Smooth width transition (400ms). Color changes based on percentage (red < 50%, amber < 80%, green ≥ 80%). Optional label showing fraction (e.g., "12/20").

5. StarRating.tsx — Shows 0-4 stars. Filled stars are gold (#FBBF24), empty stars are dark gray (#475569). Optional sparkle animation on earn. Sizes: sm (16px), md (24px), lg (32px).

6. NumberPad.tsx — On-screen number pad for numeric input mode. 3×4 grid: 1-9, backspace, 0, submit. Large buttons (56px). Haptic-style press animation. Supports keyboard input passthrough.

All components must:
- Use Tailwind CSS for styling
- Accept className prop for customization
- Use Framer Motion for animations
- Be fully accessible (aria labels, keyboard navigation)
- Use the color system from docs/06-UI-UX-DESIGN.md section 6
```

### Prompt 3.2 — Space Scene & Ship Components

```
Read docs/05-SPACE-THEME.md sections 6-7 and docs/06-UI-UX-DESIGN.md section 4.1.

Create game visual components in src/components/game/:

1. SpaceScene.tsx — HTML5 Canvas component rendering the space background:
   - 3 parallax star layers (200 distant, 100 medium, 50 near stars)
   - Stars scroll left-to-right continuously
   - Speed increases with streak count
   - Occasional shooting stars (random)
   - Background color from current galaxy theme (docs/05-SPACE-THEME.md section 7)
   - Must be performant: requestAnimationFrame, 60fps target
   - Responsive: fills container, recalculates on resize

2. Spaceship.tsx — Animated spaceship component:
   - SVG-based ship design (start with a simple rocket shape)
   - Positioned based on progress (0-100% horizontal)
   - Gentle hover wobble animation (sine wave, 3px amplitude)
   - Engine trail effect (particle system or CSS gradient)
   - Streak visual effects: normal → flame → turbo → supernova glow
   - Shake animation on wrong answer
   - Forward boost animation on correct answer

3. CountdownLaunch.tsx — "3... 2... 1... LAUNCH!" countdown:
   - Full-screen overlay
   - Numbers scale up and fade (Framer Motion)
   - "LAUNCH!" with flash effect
   - Total duration: 3 seconds
   - Triggers a callback when complete

4. LevelComplete.tsx — Results celebration overlay:
   - Confetti particle effect (use CSS or canvas)
   - Planet landing animation if passed
   - Star rating animation (stars fill one by one)
   - Stats display (accuracy, time, streak)
   - Retry / Next Level buttons
```

### Prompt 3.3 — Game Play Components

```
Read docs/06-UI-UX-DESIGN.md sections 3.4-3.6 and docs/01-GAME-DESIGN.md section 4.

Create game interaction components:

1. ProblemDisplay.tsx — Shows the current math problem:
   - Large centered text (32-48px)
   - Format: "N + M = ?" with operation symbol
   - Animate entrance of each new problem (slide in from right)
   - Highlight animation on answer (green flash for correct, amber for wrong)

2. MultipleChoice.tsx — 4-button answer grid:
   - 2×2 grid of large buttons (min 72×72px)
   - Each button shows a number
   - Correct button flashes green on selection
   - Wrong button flashes amber, correct one highlights
   - Disabled after selection (prevents double-tap)
   - Buttons use Framer Motion layoutId for smooth transitions

3. NumericInput.tsx — Text input + number pad for typed answers:
   - Display field showing entered number (large, centered)
   - Uses NumberPad component
   - Also accepts physical keyboard input (0-9, Enter, Backspace)
   - Submit on Enter or submit button
   - Clear visual feedback on submit

4. StreakCounter.tsx — Streak display:
   - Shows current streak count with fire emoji
   - Grows/pulses when streak increases
   - Color progression: white(0-2) → orange(3-4) → red(5-9) → purple(10+)
   - Resets with deflate animation on wrong answer

5. HintOverlay.tsx — Visual hint display:
   - Semi-transparent overlay
   - Shows visual representation based on operation type
   - Addition: colored blocks counting up
   - Subtraction: blocks with some crossed out
   - Multiplication: groups of items
   - Division: items split into groups
   - Close button or tap-to-dismiss
   - Uses animated SVG or Canvas
```

### Prompt 3.4 — Galaxy & Navigation Components

```
Read docs/05-SPACE-THEME.md sections 2-5 and docs/06-UI-UX-DESIGN.md sections 3.2-3.3.

Create navigation components:

1. GalaxyMap.tsx — Operation selection screen:
   - 4 galaxy cards arranged vertically (scrollable)
   - Each card shows: galaxy name, operation name, progress bar, star count
   - Unlocked galaxies have colored border glow matching galaxy theme
   - Locked galaxies are dimmed with lock icon
   - Animated space background behind cards
   - Tap a galaxy to navigate to its PlanetMap

2. PlanetMap.tsx — Level selection within a galaxy:
   - Winding path connecting 20 planet nodes
   - Path drawn as a curved SVG line
   - Scrollable vertically
   - Current/next level has pulsing glow
   - Completed levels show mini star rating below
   - Auto-scrolls to current level on mount

3. PlanetNode.tsx — Individual level node:
   - Circular planet illustration (use colored circles with simple details for now)
   - Level number displayed
   - States: locked (gray, lock icon), available (glowing border), completed (colored + stars)
   - Tap to start level (if unlocked) or replay (if completed)
   - Tooltip/label showing planet name

4. JourneyPath.tsx — SVG path connecting planet nodes:
   - Curved/zigzag path between nodes
   - Completed sections are bright/colored
   - Uncompleted sections are dim/dashed
   - Animated dots traveling along completed path
```

---

## Phase 4: Pages & Game Flow

### Prompt 4.1 — Home & Auth Pages

```
Read docs/06-UI-UX-DESIGN.md section 3.1 and docs/07-AUTH-PROGRESS.md sections 2-3.

Create the following pages:

1. src/app/[locale]/page.tsx — Home/Landing page:
   - Full-screen animated space background (use SpaceScene component)
   - Animated title "SmartMath: Space Voyage" with glow effect
   - "Start Adventure" button (large, primary) → starts guest flow or goes to galaxy map
   - "Log In" button (secondary) → goes to login page
   - Language switcher at bottom (LanguageSwitcher component)
   - Animated spaceship flying across screen periodically

2. src/app/[locale]/login/page.tsx — Login/Register page:
   - Tab switcher: "Log In" / "Create Account"
   - Login form: parent email + password/PIN, submit button, magic link option
   - Register form: astronaut name, age selector (5-12), parent email, PIN/password
   - Profile selector (if multiple children on one email)
   - "Play as Guest" link at bottom
   - All text uses translations from i18n
   - Form validation with friendly error messages
   - NextAuth.js integration for actual login/signup (signIn/signUp from next-auth/react)

3. src/app/[locale]/layout.tsx — Root locale layout:
   - NextIntlClientProvider wrapping children
   - SessionProvider from next-auth/react wrapping children
   - Global styles (space-themed dark background)
   - Font loading (Fredoka One, Nunito, Space Mono)
   - Audio provider initialization
```

### Prompt 4.2 — Galaxy Map & Level Select Pages

```
Read docs/05-SPACE-THEME.md and docs/06-UI-UX-DESIGN.md sections 3.2-3.3.

Create the following pages:

1. src/app/[locale]/galaxy/page.tsx — Galaxy Map:
   - Uses GalaxyMap component
   - Loads player progress from store/database
   - Header with back button, total stars, player name
   - Shows 4 galaxies with current progress
   - Uses progression engine to determine which galaxies are unlocked
   - Animated entrance when page loads

2. src/app/[locale]/galaxy/[operationId]/page.tsx — Level Select:
   - operationId is one of: addition, subtraction, multiplication, division
   - Validates operationId, redirects to galaxy map if invalid
   - Uses PlanetMap component with planet data from docs/05-SPACE-THEME.md
   - Loads level progress for this operation
   - Header shows operation name and galaxy name
   - Back button returns to galaxy map
   - Tapping a level navigates to game play
```

### Prompt 4.3 — Game Play Page (Core Loop)

```
Read docs/01-GAME-DESIGN.md section 4, docs/04-MATH-ENGINE.md, and docs/06-UI-UX-DESIGN.md section 3.4.

Create the main game page:

src/app/[locale]/galaxy/[operationId]/[levelId]/page.tsx — Game Play:

This is the core game loop. It should:

1. INITIALIZATION:
   - Validate operationId and levelId (1-20)
   - Check if level is unlocked (redirect to level select if not)
   - Generate 20 problems using the math engine
   - Initialize game store (reset state)
   - Determine input mode (multiple choice or numeric) based on settings + age group
   - Show CountdownLaunch (3-2-1-LAUNCH!)

2. GAMEPLAY LOOP:
   - Display SpaceScene with Spaceship (top portion of screen)
   - Show progress bar with problem count (e.g., "12/20")
   - Show current problem using ProblemDisplay
   - Show StreakCounter
   - Show answer input (MultipleChoice or NumericInput based on mode)
   - Show hint button with remaining hints count
   - Show timer (optional, for older kids)

3. ON ANSWER:
   - If correct:
     - Play correct sound effect
     - Green flash animation
     - Advance spaceship (5% forward)
     - Increment streak
     - Show streak message if milestone (3, 5, 10, 20)
     - Auto-advance to next problem after 0.8s
   - If wrong:
     - Play wrong sound effect
     - Amber flash animation
     - Ship shake animation
     - Show correct answer briefly
     - Reset streak to 0
     - Add problem to retry queue (appears again later in the level)
     - Auto-advance after 1.5s

4. ON HINT:
   - Show HintOverlay with visual breakdown
   - Decrement hints remaining
   - Mark current problem as hint-used

5. ON LEVEL COMPLETE (all 20 problems answered):
   - Calculate score using scoring engine
   - Save result to progress store (local + remote)
   - Check for new badges/achievements
   - Show LevelComplete overlay with results
   - If passed: show planet landing, fun fact, stars earned
   - If failed: show encouragement, retry button
   - Buttons: Retry (restarts level) / Next Level (goes to next)

6. Create custom hook src/hooks/useGame.ts that encapsulates all game logic:
   - Manages the game state machine
   - Handles problem queue (including retries)
   - Tracks timing per problem and total
   - Exposes: currentProblem, submitAnswer, useHint, gameState, progress

7. Create custom hook src/hooks/useTimer.ts for level timing:
   - Starts on first problem
   - Pauses when game is paused
   - Returns elapsed time in ms

8. Create custom hook src/hooks/useKeyboard.ts for keyboard input:
   - Listens for number keys (0-9)
   - Enter to submit
   - Backspace to delete
   - Only active when NumericInput mode
```

### Prompt 4.4 — Results Page

```
Read docs/06-UI-UX-DESIGN.md section 3.7 and docs/01-GAME-DESIGN.md section 5.

Create src/app/[locale]/results/page.tsx — Level Results:

This page shows after completing a level. It receives data via URL search params or from the game store.

1. Planet landing animation (if level passed)
2. "Mission Complete!" or "Mission Incomplete" header
3. Fun fact about the destination planet (from docs/05-SPACE-THEME.md)
4. Star rating animation (stars fill in one by one with sparkle)
5. Stats: correct/total, accuracy %, time, best streak
6. Time bonus indicator (if earned)
7. New badge notification (if earned)
8. Action buttons: Retry, Next Level, Back to Map
9. Confetti/particles for successful completion

This page should also:
- Save the session log to the database
- Update the progress store
- Check and award any newly earned badges
- Update astronaut rank if threshold crossed
```

### Prompt 4.5 — Profile & Settings Pages

```
Read docs/06-UI-UX-DESIGN.md section 3.8 and docs/07-AUTH-PROGRESS.md.

Create:

1. src/app/[locale]/profile/page.tsx — Player Profile:
   - Avatar/astronaut name and rank
   - Total stars display
   - Progress bars for each operation (levels completed / 20)
   - Aggregate stats: problems solved, best streak, accuracy, play time
   - Badge grid (earned badges shown, unearned are locked/gray)
   - Ship preview with current customization
   - Link to ship customizer
   - Link to settings

2. src/app/[locale]/settings/page.tsx — Settings:
   - Language selector (English / Español)
   - Sound effects toggle (on/off)
   - Music toggle (on/off)
   - Input mode selector (Multiple Choice / Type Answer / Automatic)
   - Age group selector (affects difficulty timers)
   - Account section: parent email, logout button
   - About section: version, credits

3. src/app/[locale]/album/page.tsx — Planet Collection Album:
   - Grid of all planets/destinations across all galaxies
   - Visited planets are colorful with name and fun fact
   - Unvisited planets are silhouetted with "?"
   - Tap a visited planet to see its fun fact again
   - Progress indicator: "X/80 destinations visited"
```

---

## Phase 5: Sound, Animation & Polish

### Prompt 5.1 — Sound System

```
Read docs/05-SPACE-THEME.md section 8.

Create the sound system:

1. src/hooks/useSound.ts — Custom hook for sound effects:
   - Uses Howler.js to play sound effects
   - Preloads all sound files on first interaction
   - Respects soundEnabled setting from settings store
   - Methods: playCorrect(), playWrong(), playLaunch(), playLanding(), playClick(), playStreak(level), playBadge(), playCountdown()

2. src/store/audioStore.ts — Audio state management:
   - Background music management (play, stop, crossfade between galaxies)
   - Volume control
   - Mute toggle

For initial implementation, use placeholder/generated sounds. Create a README in public/sounds/ listing all required sound files with descriptions, durations, and mood/style:
- public/sounds/effects/correct.mp3
- public/sounds/effects/wrong.mp3
- public/sounds/effects/launch.mp3
- public/sounds/effects/landing.mp3
- public/sounds/effects/click.mp3
- public/sounds/effects/streak-3.mp3
- public/sounds/effects/streak-5.mp3
- public/sounds/effects/streak-10.mp3
- public/sounds/effects/badge.mp3
- public/sounds/effects/countdown.mp3
- public/sounds/effects/star.mp3
- public/sounds/music/galaxy-1.mp3
- public/sounds/music/galaxy-2.mp3
- public/sounds/music/galaxy-3.mp3
- public/sounds/music/galaxy-4.mp3
```

### Prompt 5.2 — Animations & Transitions

```
Read docs/06-UI-UX-DESIGN.md section 4.

Enhance all components with polished Framer Motion animations:

1. Page transitions: Add AnimatePresence wrapper in layout, slide+fade between pages (300ms)
2. Galaxy to Level Select: Zoom transition (500ms)
3. Problem transitions: Slide in from right, slide out to left
4. Answer feedback: Spring animations for correct/wrong states
5. Streak counter: Scale bounce on increment, deflate on reset
6. Star rating: Sequential fill animation with delay between stars
7. Badge reveal: 3D flip with golden glow
8. Progress bar: Spring physics width animation
9. Planet nodes: Continuous subtle pulse for available levels
10. Spaceship: Smooth spring-based position updates
11. Button hover/press: Scale and shadow transitions
12. Modal: Backdrop fade-in, content scale-up with spring
13. Toast notifications: Slide in from top, auto-dismiss

Create a shared animations config in src/lib/animations.ts with reusable Framer Motion variants.
```

### Prompt 5.3 — PWA Setup

```
Configure Progressive Web App support:

1. Update next.config.mjs to include @ducanh2912/next-pwa configuration
2. Create public/manifest.json with:
   - name: "SmartMath: Space Voyage"
   - short_name: "SmartMath"
   - theme_color: "#0F172A"
   - background_color: "#0F172A"
   - display: "standalone"
   - orientation: "portrait"
   - icons: 192x192 and 512x512 (create placeholder PNGs)
3. Configure service worker to cache:
   - All static assets (images, sounds, fonts)
   - Game engine code
   - Translation files
4. Implement background sync for progress data
5. Add install prompt UI for "Add to Home Screen"
6. Create offline fallback page with message: "You can still play! Progress will sync when you're back online."
```

---

## Phase 6: Testing & Deployment

### Prompt 6.1 — Unit Tests

```
Write comprehensive unit tests using Vitest:

tests/unit/problems.test.ts:
- Test all 4 operations generate exactly 20 problems
- Test correct answers for each operation at levels 1, 5, 10, 15, 20
- Test subtraction never produces negative numbers
- Test division always produces whole numbers
- Test distractor generation never includes correct answer
- Test distractors are all non-negative
- Test choices array always has exactly 4 items

tests/unit/scoring.test.ts:
- Test 0% accuracy → 0 stars, not passed
- Test 80% accuracy → 1 star, passed
- Test 90% accuracy → 2 stars
- Test 100% accuracy → 3 stars
- Test 100% accuracy + time bonus → 4 stars
- Test time bonus thresholds for each age group

tests/unit/progression.test.ts:
- Test level 1 addition is always unlocked
- Test level 2 requires level 1 completion
- Test subtraction level 1 requires addition level 10
- Test multiplication requires subtraction level 10
- Test division requires multiplication level 10
- Test getNextLevel returns correct next level
- Test getNextLevel at end of last galaxy returns null
```

### Prompt 6.2 — Final Polish & Build Verification

```
Final steps for production readiness:

1. Create README.md at project root with:
   - Project description and screenshots placeholder
   - Tech stack overview
   - Prerequisites (Docker, Docker Compose, Node.js for local dev)
   - Quick start with Docker: docker compose up -d
   - Local development setup (docker compose up db, npm run dev)
   - Environment variables reference
   - Deployment instructions for Ubuntu + Cloudflare (reference docs/11-DOCKER-DEPLOYMENT.md)
   - Database management (migrations, backups, restore)
   - Contributing guidelines
   - License (MIT)

2. Verify .env.example has all required environment variables

3. Set up ESLint and Prettier configurations:
   - Enforce TypeScript strict mode
   - Tailwind class sorting
   - Import ordering

4. Add meta tags and SEO:
   - Title, description, Open Graph tags
   - Favicon (space-themed)
   - Apple touch icon

5. Performance optimization:
   - Image optimization with next/image
   - Dynamic imports for heavy components (Canvas, Lottie)
   - Font subsetting
   - Ensure bundle size < 200KB initial load

6. Verify Docker build works:
   - docker compose build app (should complete without errors)
   - docker compose up db -d && docker compose run --rm migrate (migrations work)
   - docker compose up -d (full stack starts)
   - curl http://localhost:3000/api/health (returns healthy)

7. Run final build check: npm run build should complete without errors
```

---

## Phase 7: Server Deployment

### Prompt 7.1 — Deploy to Ubuntu Server

```
Read docs/11-DOCKER-DEPLOYMENT.md sections 10-13 for complete deployment instructions.

This prompt is for deploying to the production Ubuntu server:

1. On the server, run scripts/setup.sh to install Docker and prepare the environment
2. Clone the repository to /opt/smartmath
3. Copy .env.example to .env and fill in production values:
   - Strong PostgreSQL password
   - Generate NEXTAUTH_SECRET with: openssl rand -base64 32
   - Set NEXTAUTH_URL to the production domain
   - Configure SMTP for magic link emails
   - Add Cloudflare Tunnel token

4. Set up Cloudflare Tunnel:
   - Create tunnel in Cloudflare Dashboard (Networks → Tunnels)
   - Name: smartmath
   - Add public hostname: smartmath.yourdomain.com → http://app:3000
   - Copy tunnel token to .env

5. Deploy:
   - docker compose build
   - docker compose run --rm migrate
   - docker compose up -d

6. Verify:
   - curl http://localhost:3000/api/health
   - Visit https://smartmath.yourdomain.com in browser
   - Test login flow

7. Set up automated backups:
   - crontab -e
   - Add: 0 3 * * * /opt/smartmath/scripts/backup.sh

8. Configure Cloudflare:
   - Enable caching for static assets (see docs/11-DOCKER-DEPLOYMENT.md section 13)
   - SSL/TLS: Full (strict)
   - Enable Brotli, HTTP/2, HTTP/3
   - Disable Rocket Loader (breaks React)
```

---

## Execution Order Summary

```
Phase 0: Docker & Infrastructure (1-2 hours)
  0.1

Phase 1: Foundation (4-6 hours)
  1.1 → 1.2 → 1.3

Phase 2: Game Engine (3-4 hours)
  2.1 → 2.2 → 2.3

Phase 3: UI Components (6-8 hours)
  3.1 → 3.2 → 3.3 → 3.4

Phase 4: Pages & Flow (6-8 hours)
  4.1 → 4.2 → 4.3 → 4.4 → 4.5

Phase 5: Polish (4-6 hours)
  5.1 → 5.2 → 5.3

Phase 6: Testing & Build (2-3 hours)
  6.1 → 6.2

Phase 7: Server Deployment (1-2 hours)
  7.1

TOTAL ESTIMATED: 28-40 hours of agent work
```

---

## Notes for the Agent

1. **Always read the referenced docs/ file** before implementing each prompt
2. **Use the exact formulas** from docs/04-MATH-ENGINE.md for problem generation
3. **Follow the color system** from docs/06-UI-UX-DESIGN.md section 6
4. **All user-facing text** must use the i18n translation system (never hardcode English/Spanish strings)
5. **Test as you go** — run the dev server and verify each feature works
6. **Mobile-first** — design for 375px width minimum, then scale up
7. **Accessibility** — include aria labels, keyboard navigation, focus management
8. **Performance** — avoid unnecessary re-renders, use React.memo where appropriate
9. **Error handling** — graceful fallbacks for network errors, missing data
10. **Type safety** — no `any` types, strict TypeScript throughout
