# SmartMath: Space Voyage - Project Overview

## Vision

**SmartMath: Space Voyage** is an educational math game where children ages 5-12 pilot a spaceship through the solar system and beyond by mastering addition, subtraction, multiplication, and division tables from 1 to 20. Each correct answer propels their ship closer to the next cosmic destination — the Moon, Mars, Jupiter, distant stars, and faraway galaxies.

## Core Philosophy

Mathematics fluency with basic operations is the foundation of all mathematical thinking. This game transforms rote memorization into an exciting space adventure, making practice feel like play. The sequential, level-based structure ensures children build mastery progressively — just like astronauts train before each mission.

## Target Audience

| Age Group | Grade Level | Primary Focus |
|-----------|-------------|---------------|
| 5-6 years | K-1st | Addition tables 1-10, introduction to subtraction |
| 7-8 years | 2nd-3rd | All addition/subtraction, multiplication tables 1-10 |
| 9-10 years | 4th-5th | All four operations up to 15 |
| 11-12 years | 6th-7th | Mastery of all operations 1-20 |

## Game Structure at a Glance

```
4 Operations × 20 Levels × 20 Problems = 1,600 total problems

ADDITION (Galaxy 1: Solar System)
  └── Level 1-20: Travel from Earth through the Solar System

SUBTRACTION (Galaxy 2: Outer Planets)
  └── Level 1-20: Explore the Outer Solar System and Kuiper Belt

MULTIPLICATION (Galaxy 3: Nearby Stars)
  └── Level 1-20: Journey to neighboring star systems

DIVISION (Galaxy 4: Deep Space)
  └── Level 1-20: Voyage to distant galaxies
```

## Key Features

1. **Sequential Mastery** — Must complete each level before advancing, building confidence and fluency
2. **Space Theme** — Captivating cosmic journey with animated spaceship, planets, and stars
3. **Bilingual** — Full English and Spanish support (switchable anytime)
4. **Easy Accounts** — Simple sign-up for children with parental email, or guest play
5. **Progress Tracking** — Detailed stats: accuracy, speed, streaks, planets unlocked
6. **Age-Adaptive UI** — Larger buttons and multiple choice for younger kids; keyboard input for older kids
7. **Rewards System** — Ship upgrades, planet collection, achievement badges, astronaut rank
8. **Offline Capable** — PWA support for playing without internet (syncs when reconnected)

## Technology Summary

| Layer | Technology | Rationale |
|-------|-----------|-----------|
| Framework | Next.js 14+ (App Router) | SSR, great DX, standalone Docker output |
| UI | Tailwind CSS + Framer Motion | Rapid styling + smooth animations |
| Game Graphics | HTML5 Canvas + Lottie | Performant space animations |
| Auth | NextAuth.js (Auth.js) | Self-hosted, magic links, credentials |
| Database | PostgreSQL 16 (local) | Full control, no external dependencies |
| ORM | Prisma | Type-safe database access |
| i18n | next-intl | Best Next.js i18n solution |
| Containers | Docker + Docker Compose | Portable, reproducible deployments |
| Hosting | Ubuntu + Cloudflare Tunnel | Self-hosted with free CDN and HTTPS |
| PWA | next-pwa | Offline support |

## Document Index

| Document | Description |
|----------|-------------|
| [01-GAME-DESIGN.md](./01-GAME-DESIGN.md) | Complete game design: operations, levels, mechanics |
| [02-ARCHITECTURE.md](./02-ARCHITECTURE.md) | Technical architecture and folder structure |
| [03-DATA-MODEL.md](./03-DATA-MODEL.md) | Database schema and data structures |
| [04-MATH-ENGINE.md](./04-MATH-ENGINE.md) | Problem generation logic for all operations |
| [05-SPACE-THEME.md](./05-SPACE-THEME.md) | Space theme, destinations, visual progression |
| [06-UI-UX-DESIGN.md](./06-UI-UX-DESIGN.md) | UI/UX specifications for ages 5-12 |
| [07-AUTH-PROGRESS.md](./07-AUTH-PROGRESS.md) | Authentication and progress tracking |
| [08-I18N.md](./08-I18N.md) | Internationalization (English/Spanish) |
| [09-IMPLEMENTATION-PROMPTS.md](./09-IMPLEMENTATION-PROMPTS.md) | Step-by-step prompts for AI agent to build |
| [10-ACCESSIBILITY.md](./10-ACCESSIBILITY.md) | Accessibility and child-friendly design |
| [11-DOCKER-DEPLOYMENT.md](./11-DOCKER-DEPLOYMENT.md) | Docker, local PostgreSQL, Ubuntu + Cloudflare deployment |

## Success Metrics

- Children can complete all 4 operation galaxies (1,600 problems)
- Average session length > 10 minutes (engagement)
- Accuracy improvement tracked over time per child
- Parents can view progress reports
- Game loads in < 2 seconds on mobile devices
