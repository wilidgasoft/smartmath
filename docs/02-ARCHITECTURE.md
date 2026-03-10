# 02 - Technical Architecture

## 1. Technology Stack

| Layer | Technology | Version | Purpose |
|-------|-----------|---------|---------|
| **Runtime** | Node.js | 20 LTS | Server runtime |
| **Framework** | Next.js | 14+ (App Router) | Full-stack React framework |
| **Language** | TypeScript | 5.x | Type safety |
| **Styling** | Tailwind CSS | 3.x | Utility-first CSS |
| **Animation** | Framer Motion | 11.x | UI animations & transitions |
| **Game Graphics** | HTML5 Canvas + Lottie | - | Space scene rendering |
| **State Mgmt** | Zustand | 4.x | Lightweight client state |
| **Auth** | NextAuth.js (Auth.js) | 5.x | Self-hosted authentication |
| **Database** | PostgreSQL | 16 | Local persistent storage |
| **ORM** | Prisma | 5.x | Type-safe database access |
| **i18n** | next-intl | 3.x | Internationalization |
| **Sound** | Howler.js | 2.x | Sound effects & music |
| **PWA** | @ducanh2912/next-pwa | - | Offline capability |
| **Testing** | Vitest + Playwright | - | Unit + E2E tests |
| **Linting** | ESLint + Prettier | - | Code quality |
| **Containers** | Docker + Compose | - | Containerization |
| **Deployment** | Ubuntu + Cloudflare Tunnel | - | Self-hosted with CDN |

> **See [11-DOCKER-DEPLOYMENT.md](./11-DOCKER-DEPLOYMENT.md)** for full Docker, PostgreSQL, and deployment details.

## 2. Project Structure

```
smartmath/
├── public/
│   ├── icons/                     # PWA icons (192, 512)
│   ├── images/
│   │   ├── planets/               # Planet illustrations (WebP)
│   │   ├── ships/                 # Ship designs (SVG/WebP)
│   │   ├── badges/                # Achievement badges (SVG)
│   │   └── backgrounds/           # Space backgrounds (WebP)
│   ├── sounds/
│   │   ├── effects/               # SFX: correct, wrong, launch, land
│   │   └── music/                 # Background music loops
│   ├── lottie/                    # Lottie animation JSON files
│   ├── manifest.json              # PWA manifest
│   └── sw.js                      # Service worker
│
├── src/
│   ├── app/
│   │   ├── [locale]/              # i18n locale segment
│   │   │   ├── layout.tsx         # Root layout with providers
│   │   │   ├── page.tsx           # Landing / Home page
│   │   │   ├── login/
│   │   │   │   └── page.tsx       # Login / Register
│   │   │   ├── galaxy/
│   │   │   │   ├── page.tsx       # Galaxy map (operation selection)
│   │   │   │   └── [operationId]/
│   │   │   │       ├── page.tsx   # Level select (planet map)
│   │   │   │       └── [levelId]/
│   │   │   │           └── page.tsx  # Game play screen
│   │   │   ├── results/
│   │   │   │   └── page.tsx       # Level results screen
│   │   │   ├── album/
│   │   │   │   └── page.tsx       # Planet collection album
│   │   │   ├── profile/
│   │   │   │   └── page.tsx       # Player profile & stats
│   │   │   └── settings/
│   │   │       └── page.tsx       # Settings (language, sound, input mode)
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts   # NextAuth.js API route
│   │   │   ├── progress/
│   │   │   │   └── route.ts       # Save/load progress API
│   │   │   └── health/
│   │   │       └── route.ts       # Health check endpoint
│   │   └── globals.css            # Global styles + Tailwind imports
│   │
│   ├── components/
│   │   ├── ui/                    # Reusable UI primitives
│   │   │   ├── Button.tsx
│   │   │   ├── Card.tsx
│   │   │   ├── Modal.tsx
│   │   │   ├── ProgressBar.tsx
│   │   │   ├── StarRating.tsx
│   │   │   └── NumberPad.tsx
│   │   ├── game/                  # Game-specific components
│   │   │   ├── SpaceScene.tsx     # Canvas-based space background
│   │   │   ├── Spaceship.tsx      # Animated spaceship
│   │   │   ├── ProblemDisplay.tsx # Shows the math problem
│   │   │   ├── MultipleChoice.tsx # MC answer buttons
│   │   │   ├── NumericInput.tsx   # Keypad answer input
│   │   │   ├── StreakCounter.tsx  # Streak display
│   │   │   ├── HintOverlay.tsx   # Visual hint display
│   │   │   ├── CountdownLaunch.tsx# 3-2-1 launch animation
│   │   │   └── LevelComplete.tsx  # Results celebration
│   │   ├── galaxy/                # Galaxy/navigation components
│   │   │   ├── GalaxyMap.tsx      # 4-galaxy overview
│   │   │   ├── PlanetMap.tsx      # Level select within galaxy
│   │   │   ├── PlanetNode.tsx     # Individual planet/level node
│   │   │   └── JourneyPath.tsx    # Connecting path between planets
│   │   ├── profile/               # Profile components
│   │   │   ├── StatsCard.tsx
│   │   │   ├── BadgeGrid.tsx
│   │   │   └── ShipCustomizer.tsx
│   │   └── layout/                # Layout components
│   │       ├── Header.tsx
│   │       ├── Navigation.tsx
│   │       └── Footer.tsx
│   │
│   ├── engine/                    # Math & game logic (pure functions)
│   │   ├── problems.ts            # Problem generation for all operations
│   │   ├── scoring.ts             # Score calculation, star rating
│   │   ├── progression.ts         # Level unlock logic
│   │   ├── distractors.ts         # Generate plausible wrong answers
│   │   ├── hints.ts               # Hint content generation
│   │   └── review.ts              # Review mode problem selection
│   │
│   ├── store/                     # Zustand stores
│   │   ├── gameStore.ts           # Current game session state
│   │   ├── progressStore.ts       # Player progress (synced w/ DB)
│   │   ├── settingsStore.ts       # User preferences
│   │   └── audioStore.ts          # Sound state
│   │
│   ├── lib/                       # Utilities and configurations
│   │   ├── prisma.ts              # Prisma client singleton
│   │   ├── auth.ts                # NextAuth.js configuration
│   │   ├── constants.ts           # Game constants (thresholds, etc.)
│   │   ├── types.ts               # TypeScript type definitions
│   │   └── utils.ts               # General utility functions
│   │
│   ├── hooks/                     # Custom React hooks
│   │   ├── useGame.ts             # Game session management
│   │   ├── useTimer.ts            # Level timer
│   │   ├── useSound.ts            # Sound effect triggers
│   │   ├── useProgress.ts         # Progress loading/saving
│   │   └── useKeyboard.ts         # Keyboard input handling
│   │
│   ├── i18n/
│   │   ├── config.ts              # i18n configuration
│   │   ├── request.ts             # Server-side locale loading
│   │   └── messages/
│   │       ├── en.json            # English translations
│   │       └── es.json            # Spanish translations
│   │
│   └── middleware.ts              # Next.js middleware (auth + i18n)
│
├── prisma/
│   ├── schema.prisma              # Database schema (Prisma ORM)
│   └── migrations/                # Auto-generated migrations
│
├── tests/
│   ├── unit/
│   │   ├── problems.test.ts       # Math engine tests
│   │   ├── scoring.test.ts
│   │   └── progression.test.ts
│   └── e2e/
│       ├── auth.spec.ts
│       ├── gameplay.spec.ts
│       └── progression.spec.ts
│
├── scripts/
│   ├── setup.sh                   # Ubuntu server setup
│   ├── deploy.sh                  # Deployment/update script
│   └── backup.sh                  # Database backup script
│
├── docs/                          # This documentation folder
├── Dockerfile                     # Multi-stage production build
├── docker-compose.yml             # Production compose
├── docker-compose.dev.yml         # Development overrides
├── .dockerignore
├── .env.example                   # Environment variables template
├── .eslintrc.json
├── .prettierrc
├── next.config.mjs
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── README.md
```

## 3. Architecture Diagram

```
        🌍 Users
             │
             ▼
┌──────────────────────┐
│    CLOUDFLARE CDN    │
│   smartmath.your.com │
│   HTTPS / WAF / CDN  │
└──────────┬───────────┘
           │ Encrypted tunnel
┌──────────┴───────────────────────────────────────────────┐
│                    UBUNTU SERVER                          │
│  ┌─────────────────────────────────────────────────────┐ │
│  │              DOCKER COMPOSE                          │ │
│  │                                                      │ │
│  │  ┌──────────────┐    ┌──────────────┐               │ │
│  │  │   Next.js    │◄──►│  PostgreSQL  │               │ │
│  │  │   App:3000   │    │    :5432     │               │ │
│  │  └──────────────┘    └──────────────┘               │ │
│  │         ▲                                            │ │
│  │  ┌──────┴───────┐                                   │ │
│  │  │ cloudflared   │                                   │ │
│  │  │  (tunnel)    │                                   │ │
│  │  └──────────────┘                                   │ │
│  └─────────────────────────────────────────────────────┘ │
└──────────────────────────────────────────────────────────┘

CLIENT (Browser):
┌─────────────────────────────────────────────────────────┐
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │  Pages   │  │Components│  │  Stores  │              │
│  │(Next.js) │──│ (React)  │──│(Zustand) │              │
│  └──────────┘  └──────────┘  └──────────┘              │
│       │              │              │                    │
│       │         ┌────┴────┐         │                    │
│       │         │  Game   │         │                    │
│       │         │ Engine  │         │                    │
│       │         │ (Pure)  │         │                    │
│       │         └─────────┘         │                    │
│       │                             │                    │
│  ┌────┴─────────────────────────────┴───┐               │
│  │         Service Worker (PWA)          │               │
│  │    Offline Cache + Sync Queue         │               │
│  └───────────────────────────────────────┘               │
└─────────────────────────────────────────────────────────┘

SERVER (Docker):
┌─────────────────────────────────────────────────────────┐
│  ┌──────────┐  ┌──────────┐  ┌──────────┐              │
│  │ API      │  │ NextAuth │  │  Prisma  │              │
│  │ Routes   │──│  (Auth)  │──│  (ORM)   │              │
│  └──────────┘  └──────────┘  └────┬─────┘              │
│                                    │                     │
│                              ┌─────┴─────┐              │
│                              │ PostgreSQL │              │
│                              │  (local)   │              │
│                              └───────────┘              │
└─────────────────────────────────────────────────────────┘
```

## 4. Key Architecture Decisions

### 4.1 Client-Heavy Game Logic

The math engine runs entirely on the client. Problems are generated deterministically from level parameters — no server round-trips during gameplay. This ensures:
- Zero latency during play (critical for children's attention span)
- Works offline
- Server only needed for auth and progress persistence

### 4.2 Offline-First with PWA

Using service worker to cache:
- All static assets (images, sounds, animations)
- Game engine code
- Last known progress state

Progress is saved locally (IndexedDB via Zustand persist) and synced to PostgreSQL via API when online. Conflict resolution: server timestamp wins, but local progress is never lost.

### 4.3 State Architecture

```
Zustand Stores:
├── gameStore        (ephemeral: current level, current problem, answers, timer)
├── progressStore    (persisted: completed levels, stars, streaks, badges)
├── settingsStore    (persisted: language, sound, input mode, age group)
└── audioStore       (ephemeral: current track, volume, muted)
```

### 4.4 Rendering Strategy

- **Home / Galaxy Map:** Server-rendered (SEO, fast first load)
- **Game Play:** Client-rendered (interactive, real-time)
- **Profile / Stats:** Server-rendered with client hydration
- **Animations:** Framer Motion for UI, Canvas for space scene

### 4.5 Performance Targets

| Metric | Target |
|--------|--------|
| First Contentful Paint | < 1.5s |
| Time to Interactive | < 2.5s |
| Lighthouse Score | > 90 |
| Bundle Size (initial) | < 200KB gzipped |
| Animation FPS | 60fps constant |

## 5. Environment Variables

```env
# ── PostgreSQL ──
POSTGRES_DB=smartmath
POSTGRES_USER=smartmath
POSTGRES_PASSWORD=change_me_to_a_strong_password
DATABASE_URL=postgresql://smartmath:change_me_to_a_strong_password@db:5432/smartmath

# ── NextAuth.js ──
NEXTAUTH_SECRET=generate_with_openssl_rand_base64_32
NEXTAUTH_URL=https://smartmath.yourdomain.com

# ── App ──
NEXT_PUBLIC_APP_URL=https://smartmath.yourdomain.com
NEXT_PUBLIC_DEFAULT_LOCALE=en

# ── Email (SMTP for magic links) ──
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=SmartMath <noreply@yourdomain.com>

# ── Cloudflare Tunnel ──
CLOUDFLARE_TUNNEL_TOKEN=your_tunnel_token

# ── Analytics (optional) ──
NEXT_PUBLIC_ANALYTICS_ID=your_analytics_id
```

## 6. Deployment Pipeline

```
Developer Push → GitHub → SSH to Ubuntu Server
                           │
                           ▼
                    scripts/deploy.sh
                    ├── git pull origin main
                    ├── docker compose build app
                    ├── docker compose run --rm migrate
                    └── docker compose up -d app tunnel

Database migrations via Prisma:
  npx prisma migrate deploy    (production)
  npx prisma migrate dev       (development)
```

> **Full deployment details:** See [11-DOCKER-DEPLOYMENT.md](./11-DOCKER-DEPLOYMENT.md)
