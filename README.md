# 🚀 SmartMath: Space Voyage

An educational math game for children ages 5-12. Master addition, subtraction, multiplication, and division tables 1-20 while piloting a spaceship through the cosmos!

![SmartMath Space Voyage](docs/screenshot-placeholder.png)

## ✨ Features

- **1,600 math problems** — 4 operations × 20 levels × 20 problems each
- **Space theme** — Travel from Earth to distant galaxies while answering questions
- **Bilingual** — Full English 🇺🇸 and Spanish 🇪🇸 support (switchable anytime)
- **Age-adaptive** — Multiple choice for young kids, keyboard input for older ones
- **Streak system** — Fire up your combo for speed boosts!
- **Hints** — Visual block-based hints (3 per level)
- **Progress tracking** — Stars, badges, astronaut ranks, planet collection
- **Offline-first PWA** — Play without internet, syncs when reconnected
- **Self-hosted** — Runs on your own Ubuntu server with Docker + Cloudflare Tunnel

## 🛠 Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 15 (App Router, standalone output) |
| UI | Tailwind CSS + Framer Motion |
| Game Graphics | HTML5 Canvas + SVG |
| State | Zustand (persistent + ephemeral) |
| Auth | NextAuth.js (magic links + credentials) |
| Database | PostgreSQL 16 (local) |
| ORM | Prisma |
| i18n | next-intl |
| Containers | Docker + Docker Compose |
| Hosting | Ubuntu + Cloudflare Tunnel |

## 🚀 Quick Start with Docker

```bash
# 1. Clone the repo
git clone <repo-url> /opt/smartmath
cd /opt/smartmath

# 2. Configure environment
cp .env.example .env
nano .env  # Fill in required values

# 3. Run migrations
docker compose --profile migrate run --rm migrate

# 4. Start everything
docker compose up -d

# 5. Verify
curl http://localhost:3000/api/health
```

Visit **http://localhost:3000** (or your Cloudflare tunnel domain).

## 💻 Local Development

```bash
# Install dependencies
npm install --legacy-peer-deps

# Start PostgreSQL only
docker compose up db -d

# Set up local .env.local
echo 'DATABASE_URL=postgresql://smartmath:your_password@localhost:5432/smartmath' > .env.local
echo 'NEXTAUTH_SECRET=local-dev-secret' >> .env.local
echo 'NEXTAUTH_URL=http://localhost:3000' >> .env.local

# Run database migrations
npx prisma migrate dev

# Start dev server
npm run dev
```

Open [http://localhost:3000/en](http://localhost:3000/en)

## 🐳 Docker Commands

```bash
# Development with hot reload
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# Production build
docker compose build app

# Run migrations
docker compose --profile migrate run --rm migrate

# View logs
docker compose logs -f app
docker compose logs -f db

# Database shell
docker compose exec db psql -U smartmath smartmath

# Prisma Studio (visual DB editor)
npx prisma studio

# Stop everything
docker compose down
```

## 🌍 Environment Variables

| Variable | Description | Required |
|----------|-------------|----------|
| `POSTGRES_DB` | Database name | ✅ |
| `POSTGRES_USER` | Database user | ✅ |
| `POSTGRES_PASSWORD` | Database password | ✅ |
| `DATABASE_URL` | Full PostgreSQL connection string | ✅ |
| `NEXTAUTH_SECRET` | JWT signing secret (`openssl rand -base64 32`) | ✅ |
| `NEXTAUTH_URL` | App URL (e.g., `https://smartmath.yourdomain.com`) | ✅ |
| `NEXT_PUBLIC_APP_URL` | Public app URL | ✅ |
| `NEXT_PUBLIC_DEFAULT_LOCALE` | Default language (`en` or `es`) | ✅ |
| `SMTP_HOST` | SMTP server host | Optional (for magic links) |
| `SMTP_PORT` | SMTP port (587) | Optional |
| `SMTP_USER` | SMTP username | Optional |
| `SMTP_PASSWORD` | SMTP password | Optional |
| `SMTP_FROM` | From email address | Optional |
| `CLOUDFLARE_TUNNEL_TOKEN` | Cloudflare Tunnel token | Optional (for production) |

## 🖥 Ubuntu + Cloudflare Deployment

See [docs/11-DOCKER-DEPLOYMENT.md](docs/11-DOCKER-DEPLOYMENT.md) for detailed instructions.

**Quick steps:**
1. Run `scripts/setup.sh` on fresh Ubuntu 22.04+
2. Clone repo to `/opt/smartmath`
3. Configure `.env` with production values
4. Set up Cloudflare Tunnel (Networks → Tunnels → Create)
5. Run `scripts/deploy.sh`

**Automated backups:**
```bash
# Add to crontab (daily at 3 AM)
crontab -e
# Add: 0 3 * * * /opt/smartmath/scripts/backup.sh
```

## 📊 Database Management

```bash
# Create migration
npx prisma migrate dev --name my_change

# Deploy migrations (production)
npx prisma migrate deploy

# Backup database
./scripts/backup.sh

# Restore from backup
gunzip -c backups/smartmath_20260309_030000.sql.gz | \
  docker compose exec -T db psql -U smartmath smartmath
```

## 🧪 Tests

```bash
# Run all unit tests
npm test

# Watch mode
npm run test:ui
```

Tests cover:
- All math operations generate exactly 20 problems
- Subtraction never produces negative answers
- Division always produces whole numbers
- Distractor generation never includes correct answer
- Star calculation for various accuracy levels
- Level unlock progression logic

## 📁 Project Structure

```
smartmath/
├── src/
│   ├── app/             # Next.js App Router pages
│   │   ├── [locale]/    # Localized pages (en/es)
│   │   └── api/         # API routes
│   ├── components/      # React components
│   │   ├── ui/          # Primitives (Button, Card, etc.)
│   │   ├── game/        # Game-specific components
│   │   ├── galaxy/      # Navigation components
│   │   └── layout/      # Layout components
│   ├── engine/          # Pure game logic (math, scoring)
│   ├── hooks/           # Custom React hooks
│   ├── store/           # Zustand state stores
│   ├── i18n/            # Translations (en/es)
│   └── lib/             # Types, constants, utilities
├── prisma/              # Database schema & migrations
├── tests/               # Unit tests
├── public/              # Static assets
├── scripts/             # Deployment scripts
├── docs/                # Project documentation
├── Dockerfile           # Multi-stage production build
├── docker-compose.yml   # Production compose
└── docker-compose.dev.yml # Development overrides
```

## 🎮 Game Design

See [docs/01-GAME-DESIGN.md](docs/01-GAME-DESIGN.md) for complete game design spec.

| Galaxy | Operation | Destination |
|--------|-----------|-------------|
| 🌍 Solar System | Addition | Earth → Voyager Probe |
| 🌌 Outer Reaches | Subtraction | Oort Cloud → Interstellar Gate |
| ✨ The Stars | Multiplication | Orion Nebula → Galactic Center |
| 🌀 Deep Space | Division | Large Magellanic Cloud → Big Bang |

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feat/my-feature`
3. Run tests: `npm test`
4. Open a pull request

## 📄 License

MIT — see [LICENSE](LICENSE) for details.

---

Built with ❤️ for curious kids everywhere. Keep exploring! 🚀
