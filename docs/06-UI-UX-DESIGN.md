# 06 - UI/UX Design Specifications

## 1. Design Principles

1. **Kid-First:** Every interaction must be intuitive for a 5-year-old
2. **No Punishment:** Wrong answers are learning moments, never penalties
3. **Constant Feedback:** Every action has immediate visual/audio response
4. **Progressive Disclosure:** Show only what's needed at each age level
5. **Celebration:** Make success feel amazing with animations and sounds
6. **Accessibility:** Large targets, high contrast, screen reader support

## 2. Responsive Breakpoints

| Breakpoint | Device | Layout |
|------------|--------|--------|
| < 640px | Phone (portrait) | Single column, stacked |
| 640-768px | Phone (landscape) / small tablet | Adapted layout |
| 768-1024px | Tablet | Two-column where appropriate |
| > 1024px | Desktop / large tablet | Full layout |

**Primary target:** Tablet (768-1024px) — most common device for children's education.

## 3. Screen Designs

### 3.1 Home / Landing Screen

```
┌─────────────────────────────────────────┐
│                                         │
│          🚀 SMARTMATH                   │
│          SPACE VOYAGE                   │
│                                         │
│     [animated starfield background]     │
│     [spaceship flying animation]        │
│                                         │
│    ┌─────────────────────────────┐      │
│    │    🎮  START ADVENTURE      │      │
│    └─────────────────────────────┘      │
│                                         │
│    ┌─────────────────────────────┐      │
│    │    👤  LOG IN               │      │
│    └─────────────────────────────┘      │
│                                         │
│         🌐 English | Español            │
│                                         │
└─────────────────────────────────────────┘
```

**Design notes:**
- Full-screen animated space background
- Logo with metallic/glowing text effect
- Large, rounded buttons (min 56px height on mobile)
- Language switcher at bottom

### 3.2 Galaxy Map (Operation Selection)

```
┌─────────────────────────────────────────┐
│  ← Back     ⭐ 47    👤 AstroKid       │
│─────────────────────────────────────────│
│                                         │
│  [Animated space scene with 4 galaxies] │
│                                         │
│    🌍 SOLAR SYSTEM          ⭐⭐⭐      │
│    Addition · 12/20 levels              │
│    ─────────────────────                │
│                                         │
│    🌌 OUTER REACHES         ⭐⭐        │
│    Subtraction · 5/20 levels            │
│    ─────────────────────                │
│                                         │
│    ✨ THE STARS              🔒         │
│    Multiplication · Locked              │
│    ─────────────────────                │
│                                         │
│    🌀 DEEP SPACE             🔒         │
│    Division · Locked                    │
│    ─────────────────────                │
│                                         │
└─────────────────────────────────────────┘
```

**Design notes:**
- Each galaxy shown as a card with progress bar
- Locked galaxies have a subtle lock icon and grayed appearance
- Unlocked galaxies glow and pulse subtly
- Star count header shows total stars earned
- Current galaxy highlighted with animated border

### 3.3 Level Select (Planet Map)

```
┌─────────────────────────────────────────┐
│  ← Galaxy Map    ⭐ 47    🚀 Level 13  │
│─────────────────────────────────────────│
│                                         │
│  THE SOLAR SYSTEM · Addition            │
│                                         │
│  [Scrollable path with planet nodes]    │
│                                         │
│  🌍──⭐⭐⭐──🌙──⭐⭐⭐──🏠──⭐⭐──    │
│   1        2        3        4          │
│                                         │
│  ──🪐──⭐⭐──☿──⭐⭐⭐──🔴──⭐──      │
│     5        6        7       8         │
│                                         │
│  ──💫──⭐⭐──🟤──⭐⭐⭐──[🔵]──       │
│     9       10       11      12 ←NEXT   │
│                                         │
│  ──🟡──🔒──🟢──🔒──🔵──🔒──           │
│    13      14      15      16           │
│                                         │
│  ──⚫──🔒──❄️──🔒──🪨──🔒──🛸──🔒    │
│    17      18      19      20           │
│                                         │
└─────────────────────────────────────────┘
```

**Design notes:**
- Winding path connecting planets (like a board game)
- Completed levels show earned stars below the planet
- Current/next level has a pulsing highlight
- Locked levels are dimmed with lock overlay
- Tap a completed level to replay it
- Planet illustrations are colorful and cartoonish
- Scrollable vertically on mobile

### 3.4 Game Play Screen

```
┌─────────────────────────────────────────┐
│  Level 5 · Addition    🔥 Streak: 7    │
│  ████████████░░░░░░░░  12/20           │
│─────────────────────────────────────────│
│                                         │
│  [=== SPACE SCENE ===]                  │
│  [Stars scrolling, ship moving right]   │
│  [🚀───────────────────────🪐]         │
│                                         │
│─────────────────────────────────────────│
│                                         │
│           5 + 12 = ?                    │
│                                         │
│  ┌─────────┐  ┌─────────┐              │
│  │         │  │         │              │
│  │   15    │  │   17    │              │
│  │         │  │         │              │
│  └─────────┘  └─────────┘              │
│  ┌─────────┐  ┌─────────┐              │
│  │         │  │         │              │
│  │   16    │  │   18    │              │
│  │         │  │         │              │
│  └─────────┘  └─────────┘              │
│                                         │
│       💡 Hints: 3    ⏱ 0:23            │
│                                         │
└─────────────────────────────────────────┘
```

**For Numeric Input Mode (older kids):**

```
┌─────────────────────────────────────────┐
│           5 + 12 = ?                    │
│                                         │
│         ┌──────────────┐                │
│         │     __       │                │
│         └──────────────┘                │
│                                         │
│    ┌───┐  ┌───┐  ┌───┐                 │
│    │ 1 │  │ 2 │  │ 3 │                 │
│    ├───┤  ├───┤  ├───┤                 │
│    │ 4 │  │ 5 │  │ 6 │                 │
│    ├───┤  ├───┤  ├───┤                 │
│    │ 7 │  │ 8 │  │ 9 │                 │
│    ├───┤  ├───┤  ├───┤                 │
│    │ ⌫ │  │ 0 │  │ ✓ │                 │
│    └───┘  └───┘  └───┘                 │
│                                         │
└─────────────────────────────────────────┘
```

**Design notes:**
- Space scene takes ~35% of screen height (enough to see ship + destination)
- Problem text is LARGE (32-48px) and centered
- Multiple choice buttons: minimum 64×64px, well-spaced
- Number pad buttons: minimum 56×56px
- Streak counter with fire emoji when active
- Progress bar shows problems completed
- Hint and timer at bottom, unobtrusive

### 3.5 Correct Answer Feedback

```
┌─────────────────────────────────────────┐
│                                         │
│         ✅ CORRECT!                     │
│                                         │
│         5 + 12 = 17                     │
│                                         │
│    [Ship whooshes forward animation]    │
│    [Stars sparkle, streak fire grows]   │
│                                         │
│    [Auto-advance to next in 1 second]   │
│                                         │
└─────────────────────────────────────────┘
```

### 3.6 Wrong Answer Feedback

```
┌─────────────────────────────────────────┐
│                                         │
│         Not quite!                      │
│                                         │
│         5 + 12 = 17                     │
│         (shows correct answer briefly)  │
│                                         │
│    [Ship shakes gently, resets]         │
│    [Encouraging message:]               │
│    "You'll get it next time!"           │
│                                         │
│    [Auto-advance in 2 seconds]          │
│                                         │
└─────────────────────────────────────────┘
```

### 3.7 Level Complete Screen

```
┌─────────────────────────────────────────┐
│                                         │
│    🎉 MISSION COMPLETE! 🎉              │
│                                         │
│    [Planet landing animation]           │
│    [Confetti / star particles]          │
│                                         │
│    You reached MARS! 🔴                 │
│                                         │
│    "Mars has the tallest volcano        │
│     in the solar system!"              │
│                                         │
│    ⭐ ⭐ ⭐ ☆   (3/4 stars)            │
│                                         │
│    Correct: 19/20  (95%)               │
│    Time: 34 seconds                     │
│    Best Streak: 12 🔥                   │
│                                         │
│    ┌──────────┐  ┌──────────┐          │
│    │ RETRY ⟲  │  │ NEXT ▶   │          │
│    └──────────┘  └──────────┘          │
│                                         │
│    🏆 New Badge: Speed Demon!           │
│                                         │
└─────────────────────────────────────────┘
```

### 3.8 Profile / Stats Screen

```
┌─────────────────────────────────────────┐
│  ← Back         Settings ⚙              │
│─────────────────────────────────────────│
│                                         │
│    👨‍🚀 AstroKid                         │
│    Rank: Astronaut 🚀                   │
│    ⭐ 47 Stars                          │
│                                         │
│  ┌──────────────────────────────┐       │
│  │ PROGRESS                      │       │
│  │ Addition:       ████████░░ 12/20│    │
│  │ Subtraction:    █████░░░░░  5/20│    │
│  │ Multiplication: ░░░░░░░░░░  0/20│    │
│  │ Division:       ░░░░░░░░░░  0/20│    │
│  └──────────────────────────────┘       │
│                                         │
│  ┌──────────────────────────────┐       │
│  │ STATS                         │       │
│  │ Problems Solved: 340          │       │
│  │ Best Streak: 23               │       │
│  │ Accuracy: 89%                 │       │
│  │ Play Time: 2h 15m             │       │
│  └──────────────────────────────┘       │
│                                         │
│  ┌──────────────────────────────┐       │
│  │ BADGES (5/12)                 │       │
│  │ 🏅🏅🏅🏅🏅🔒🔒🔒🔒🔒🔒🔒    │       │
│  └──────────────────────────────┘       │
│                                         │
│  ┌──────────────────────────────┐       │
│  │ 🚀 MY SHIP                   │       │
│  │ [Ship preview with current   │       │
│  │  customization]               │       │
│  │ [Customize →]                 │       │
│  └──────────────────────────────┘       │
│                                         │
└─────────────────────────────────────────┘
```

## 4. Animation Specifications

### 4.1 Space Scene (Canvas)

The game play screen features a Canvas-rendered space scene:

```typescript
interface SpaceSceneConfig {
  layers: [
    { type: 'stars', count: 200, speed: 0.2, size: [1, 2] },      // distant
    { type: 'stars', count: 100, speed: 0.5, size: [2, 3] },      // middle
    { type: 'stars', count: 50,  speed: 1.0, size: [3, 5] },      // near
    { type: 'particles', count: 20, speed: 1.5, size: [1, 3] },   // dust
  ],
  ship: {
    position: { x: '10%-90%', y: 'center' },  // moves with progress
    trail: true,
    wobble: { amplitude: 3, frequency: 0.5 },  // gentle hover
  },
  destination: {
    position: { x: '90%', y: 'center' },
    scale: { start: 0.3, end: 1.0 },  // grows as ship approaches
    glow: true,
  },
}
```

### 4.2 Key Animations (Framer Motion)

| Animation | Trigger | Duration | Effect |
|-----------|---------|----------|--------|
| Ship advance | Correct answer | 500ms | Ship slides right 5%, ease-out |
| Ship stall | Wrong answer | 300ms | Ship shakes horizontally 3px, 3 cycles |
| Streak fire | 3+ streak | Continuous | Flame behind ship grows with streak |
| Turbo boost | 5+ streak | 800ms | Ship surges forward, stars blur |
| Star sparkle | Star earned | 600ms | Star icon scales up 1.5x with particle burst |
| Planet landing | Level complete | 2000ms | Ship flies to planet, orbits once, lands |
| Confetti burst | Level passed | 3000ms | Particles burst from center |
| Countdown | Level start | 3000ms | "3... 2... 1... LAUNCH!" with scaling |
| Button press | Any button | 150ms | Scale down 0.95, spring back |
| Card hover | Mouse enter | 200ms | Scale up 1.02, shadow increase |
| Badge reveal | Badge earned | 1000ms | Flip animation, golden glow |
| Progress bar | Progress change | 400ms | Width animates smoothly |

### 4.3 Transition Between Screens

- **Page transitions:** Slide + fade (300ms)
- **Galaxy to Level Select:** Zoom into the galaxy (500ms)
- **Level Select to Game:** Rocket launch animation (1500ms)
- **Game to Results:** Ship landing → fade to results (1000ms)

## 5. Typography

```css
/* Headings: Fun, rounded, kid-friendly */
font-family: 'Fredoka One', 'Nunito', system-ui, sans-serif;

/* Body: Clear, readable */
font-family: 'Nunito', 'Inter', system-ui, sans-serif;

/* Math problems: Monospace-like for number alignment */
font-family: 'Space Mono', 'JetBrains Mono', monospace;
```

| Element | Size (Mobile) | Size (Tablet+) | Weight |
|---------|---------------|----------------|--------|
| Game title | 36px | 48px | 700 |
| Section heading | 24px | 32px | 700 |
| Math problem | 32px | 48px | 700 |
| Answer choices | 24px | 32px | 600 |
| Body text | 16px | 18px | 400 |
| Button text | 18px | 20px | 600 |
| Caption/small | 12px | 14px | 400 |

## 6. Color System

```css
:root {
  /* Primary */
  --color-primary: #3B82F6;          /* Blue - main actions */
  --color-primary-hover: #2563EB;
  --color-primary-light: #DBEAFE;

  /* Success */
  --color-success: #10B981;          /* Green - correct answers */
  --color-success-light: #D1FAE5;

  /* Error */
  --color-error: #F59E0B;            /* Amber (NOT red) - wrong answers */
  --color-error-light: #FEF3C7;
  /* Note: Using amber instead of red for wrong answers.
     Red is aggressive; amber is gentle "try again" */

  /* Background */
  --color-bg-space: #0F172A;         /* Deep space */
  --color-bg-card: #1E293B;          /* Card background */
  --color-bg-overlay: rgba(0,0,0,0.6);

  /* Text */
  --color-text-primary: #F8FAFC;     /* White-ish */
  --color-text-secondary: #94A3B8;   /* Muted */
  --color-text-accent: #FBBF24;      /* Gold highlights */

  /* Streaks */
  --color-streak-3: #F97316;         /* Orange fire */
  --color-streak-5: #EF4444;         /* Red turbo */
  --color-streak-10: #A855F7;        /* Purple supernova */

  /* Stars */
  --color-star-filled: #FBBF24;      /* Gold */
  --color-star-empty: #475569;       /* Dark gray */
}
```

## 7. Touch & Click Targets

Following WCAG and child-friendly guidelines:

| Element | Minimum Size | Spacing |
|---------|-------------|---------|
| Primary buttons | 56px height | 12px gap |
| Answer choices (MC) | 72×72px | 16px gap |
| Number pad keys | 56×56px | 8px gap |
| Navigation icons | 44×44px | 8px gap |
| Planet nodes (map) | 48×48px | Variable |

## 8. Loading & Empty States

### Loading
- Animated spaceship flying across screen with "Preparing for launch..." text
- Skeleton screens for data-dependent areas

### Empty States
- Galaxy not yet unlocked: Ship approaching locked gate with "Complete more levels to unlock!"
- No badges yet: Empty trophy case with "Start your adventure to earn badges!"

## 9. Error States

- Network error: "Houston, we have a problem! Check your connection." with retry button
- Save failed: "Progress saved on your device. We'll sync when you're back online." (auto-retry)
- All errors use friendly, space-themed language
