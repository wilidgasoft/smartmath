# 11 - Docker, Local PostgreSQL & Ubuntu/Cloudflare Deployment

## 1. Overview

This document replaces the Vercel + Supabase-hosted deployment model with a fully **self-hosted** stack:

| Component | Technology | Purpose |
|-----------|-----------|---------|
| App Server | Next.js (standalone output) | Web application |
| Database | PostgreSQL 16 | Local persistent storage |
| ORM | Prisma | Type-safe database access |
| Auth | NextAuth.js (Auth.js) | Authentication (self-hosted) |
| Email | Nodemailer + SMTP | Magic links, notifications |
| Containers | Docker + Docker Compose | Containerization |
| Reverse Proxy | Cloudflare Tunnel | HTTPS, CDN, DDoS protection |
| Server | Ubuntu 22.04+ | Host OS |

### Why This Change

- **Supabase replaced by local PostgreSQL + Prisma:** Full control over data, no external dependency, lower latency
- **Supabase Auth replaced by NextAuth.js:** Self-hosted auth, no third-party dependency
- **Vercel replaced by Docker on Ubuntu:** Self-hosted, full control, no hosting costs
- **Cloudflare Tunnel:** Free HTTPS, CDN, no need to open ports or manage certificates

## 2. Architecture Diagram (Self-Hosted)

```
┌──────────────────────────────────────────────────────────┐
│                    UBUNTU SERVER                          │
│                                                           │
│  ┌─────────────────────────────────────────────────────┐ │
│  │              DOCKER COMPOSE                          │ │
│  │                                                      │ │
│  │  ┌──────────────┐    ┌──────────────┐               │ │
│  │  │   smartmath   │    │  PostgreSQL  │               │ │
│  │  │   (Next.js)  │◄──►│    :5432     │               │ │
│  │  │    :3000     │    │  (volume)    │               │ │
│  │  └──────┬───────┘    └──────────────┘               │ │
│  │         │                                            │ │
│  │  ┌──────┴───────┐                                   │ │
│  │  │  cloudflared  │                                   │ │
│  │  │   (tunnel)   │                                   │ │
│  │  └──────┬───────┘                                   │ │
│  │         │                                            │ │
│  └─────────┼────────────────────────────────────────────┘ │
│            │                                              │
└────────────┼──────────────────────────────────────────────┘
             │ Encrypted tunnel
             ▼
┌──────────────────────┐
│    CLOUDFLARE CDN    │
│   smartmath.your.com │
│   HTTPS / WAF / CDN  │
└──────────────────────┘
             │
             ▼
        🌍 Users
```

## 3. Project Files

### 3.1 Dockerfile

```dockerfile
# ── Stage 1: Dependencies ──
FROM node:20-alpine AS deps
WORKDIR /app
COPY package.json package-lock.json* ./
RUN npm ci --ignore-scripts

# ── Stage 2: Build ──
FROM node:20-alpine AS builder
WORKDIR /app

COPY --from=deps /app/node_modules ./node_modules
COPY . .

# Generate Prisma client
RUN npx prisma generate

# Build Next.js in standalone mode
ENV NEXT_TELEMETRY_DISABLED=1
ENV NODE_ENV=production
RUN npm run build

# ── Stage 3: Production ──
FROM node:20-alpine AS runner
WORKDIR /app

ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone output
COPY --from=builder /app/public ./public
COPY --from=builder /app/.next/standalone ./
COPY --from=builder /app/.next/static ./.next/static

# Copy Prisma schema and migrations for runtime migration support
COPY --from=builder /app/prisma ./prisma
COPY --from=builder /app/node_modules/.prisma ./node_modules/.prisma
COPY --from=builder /app/node_modules/@prisma ./node_modules/@prisma

USER nextjs

EXPOSE 3000
ENV PORT=3000
ENV HOSTNAME="0.0.0.0"

CMD ["node", "server.js"]
```

### 3.2 docker-compose.yml

```yaml
services:
  # ── PostgreSQL Database ──
  db:
    image: postgres:16-alpine
    container_name: smartmath-db
    restart: unless-stopped
    environment:
      POSTGRES_DB: ${POSTGRES_DB:-smartmath}
      POSTGRES_USER: ${POSTGRES_USER:-smartmath}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:?Set POSTGRES_PASSWORD in .env}
    volumes:
      - postgres_data:/var/lib/postgresql/data
    ports:
      - "127.0.0.1:5432:5432"
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-smartmath}"]
      interval: 10s
      timeout: 5s
      retries: 5
    networks:
      - smartmath-net

  # ── Next.js Application ──
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: smartmath-app
    restart: unless-stopped
    depends_on:
      db:
        condition: service_healthy
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER:-smartmath}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB:-smartmath}
      NEXTAUTH_URL: ${NEXTAUTH_URL:-http://localhost:3000}
      NEXTAUTH_SECRET: ${NEXTAUTH_SECRET:?Set NEXTAUTH_SECRET in .env}
      SMTP_HOST: ${SMTP_HOST:-}
      SMTP_PORT: ${SMTP_PORT:-587}
      SMTP_USER: ${SMTP_USER:-}
      SMTP_PASSWORD: ${SMTP_PASSWORD:-}
      SMTP_FROM: ${SMTP_FROM:-noreply@smartmath.app}
      NEXT_PUBLIC_APP_URL: ${NEXT_PUBLIC_APP_URL:-http://localhost:3000}
      NEXT_PUBLIC_DEFAULT_LOCALE: ${NEXT_PUBLIC_DEFAULT_LOCALE:-en}
    ports:
      - "127.0.0.1:3000:3000"
    networks:
      - smartmath-net

  # ── Database Migrations (run once) ──
  migrate:
    build:
      context: .
      dockerfile: Dockerfile
      target: builder
    container_name: smartmath-migrate
    depends_on:
      db:
        condition: service_healthy
    environment:
      DATABASE_URL: postgresql://${POSTGRES_USER:-smartmath}:${POSTGRES_PASSWORD}@db:5432/${POSTGRES_DB:-smartmath}
    command: npx prisma migrate deploy
    networks:
      - smartmath-net
    profiles:
      - migrate

  # ── Cloudflare Tunnel ──
  tunnel:
    image: cloudflare/cloudflared:latest
    container_name: smartmath-tunnel
    restart: unless-stopped
    depends_on:
      - app
    command: tunnel --no-autoupdate run
    environment:
      TUNNEL_TOKEN: ${CLOUDFLARE_TUNNEL_TOKEN:?Set CLOUDFLARE_TUNNEL_TOKEN in .env}
    networks:
      - smartmath-net

volumes:
  postgres_data:
    driver: local

networks:
  smartmath-net:
    driver: bridge
```

### 3.3 docker-compose.dev.yml (Development Override)

```yaml
services:
  db:
    ports:
      - "5432:5432"

  app:
    build:
      target: deps
    volumes:
      - .:/app
      - /app/node_modules
    command: npm run dev
    ports:
      - "3000:3000"
    environment:
      NODE_ENV: development

  tunnel:
    profiles:
      - tunnel
```

### 3.4 .dockerignore

```
node_modules
.next
.git
.gitignore
*.md
docs/
tests/
.env
.env.local
.env*.local
docker-compose*.yml
Dockerfile
.dockerignore
```

## 4. Environment Variables

### .env.example

```env
# ═══════════════════════════════════════
# SmartMath: Space Voyage - Environment
# ═══════════════════════════════════════

# ── PostgreSQL ──
POSTGRES_DB=smartmath
POSTGRES_USER=smartmath
POSTGRES_PASSWORD=change_me_to_a_strong_password

# Full connection string (used by Prisma and the app)
DATABASE_URL=postgresql://smartmath:change_me_to_a_strong_password@db:5432/smartmath

# ── NextAuth.js ──
# Generate with: openssl rand -base64 32
NEXTAUTH_SECRET=generate_a_random_secret_here
NEXTAUTH_URL=https://smartmath.yourdomain.com

# ── Application ──
NEXT_PUBLIC_APP_URL=https://smartmath.yourdomain.com
NEXT_PUBLIC_DEFAULT_LOCALE=en

# ── Email (for magic links & notifications) ──
# Use any SMTP provider: Gmail, SendGrid, Mailgun, AWS SES, etc.
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASSWORD=your-app-password
SMTP_FROM=SmartMath <noreply@yourdomain.com>

# ── Cloudflare Tunnel ──
# Get from: https://one.dash.cloudflare.com → Networks → Tunnels
CLOUDFLARE_TUNNEL_TOKEN=your_tunnel_token_here
```

## 5. Prisma Schema (Replaces Supabase)

Instead of using Supabase's client SDK and RLS policies, we use **Prisma ORM** for type-safe database access. The schema mirrors the SQL from `03-DATA-MODEL.md` but in Prisma's schema language.

### prisma/schema.prisma

```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

enum Operation {
  addition
  subtraction
  multiplication
  division
}

enum AgeGroup {
  young
  medium
  advanced
}

enum InputMode {
  multiple_choice
  numeric
  auto
}

// ── NextAuth.js required models ──

model Account {
  id                String  @id @default(cuid())
  userId            String
  type              String
  provider          String
  providerAccountId String
  refresh_token     String? @db.Text
  access_token      String? @db.Text
  expires_at        Int?
  token_type        String?
  scope             String?
  id_token          String? @db.Text
  session_state     String?

  user User @relation(fields: [userId], references: [id], onDelete: Cascade)

  @@unique([provider, providerAccountId])
}

model Session {
  id           String   @id @default(cuid())
  sessionToken String   @unique
  userId       String
  expires      DateTime
  user         User     @relation(fields: [userId], references: [id], onDelete: Cascade)
}

model VerificationToken {
  identifier String
  token      String   @unique
  expires    DateTime

  @@unique([identifier, token])
}

// ── User (replaces Supabase auth.users) ──

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  emailVerified DateTime?
  name          String?
  image         String?
  accounts      Account[]
  sessions      Session[]
  profiles      Profile[]
  createdAt     DateTime  @default(now())
}

// ── Game Models ──

model Profile {
  id                  String   @id @default(cuid())
  userId              String
  user                User     @relation(fields: [userId], references: [id], onDelete: Cascade)
  displayName         String   @default("Astronaut")
  avatarUrl           String?
  ageGroup            AgeGroup @default(medium)
  locale              String   @default("en")
  inputMode           InputMode @default(auto)
  soundEnabled        Boolean  @default(true)
  musicEnabled        Boolean  @default(true)
  totalStars          Int      @default(0)
  astronautRank       String   @default("cadet")
  currentGalaxy       Int      @default(1)
  longestStreak       Int      @default(0)
  totalProblemsSolved Int      @default(0)
  totalPlayTimeMs     BigInt   @default(0)
  createdAt           DateTime @default(now())
  updatedAt           DateTime @updatedAt

  levelProgress LevelProgress[]
  sessionLogs   SessionLog[]
  achievements  Achievement[]
  shipConfig    ShipConfig?

  @@index([userId])
}

model LevelProgress {
  id           String    @id @default(cuid())
  profileId    String
  profile      Profile   @relation(fields: [profileId], references: [id], onDelete: Cascade)
  operation    Operation
  levelNumber  Int
  stars        Int       @default(0)
  bestAccuracy Float     @default(0)
  bestTimeMs   Int?
  attempts     Int       @default(0)
  completedAt  DateTime?
  lastPlayedAt DateTime  @default(now())

  @@unique([profileId, operation, levelNumber])
  @@index([profileId])
}

model SessionLog {
  id           String      @id @default(cuid())
  profileId    String
  profile      Profile     @relation(fields: [profileId], references: [id], onDelete: Cascade)
  operation    Operation
  levelNumber  Int
  startedAt    DateTime    @default(now())
  endedAt      DateTime?
  totalCorrect Int         @default(0)
  totalWrong   Int         @default(0)
  totalTimeMs  Int?
  starsEarned  Int         @default(0)
  streakMax    Int         @default(0)
  completed    Boolean     @default(false)
  problemLogs  ProblemLog[]

  @@index([profileId])
  @@index([profileId, startedAt(sort: Desc)])
}

model ProblemLog {
  id              String     @id @default(cuid())
  sessionId       String
  session         SessionLog @relation(fields: [sessionId], references: [id], onDelete: Cascade)
  problemText     String
  correctAnswer   Int
  userAnswer      Int?
  isCorrect       Boolean
  timeMs          Int?
  hintUsed        Boolean    @default(false)
  attemptNumber   Int        @default(1)
  positionInLevel Int

  @@index([sessionId])
}

model Achievement {
  id        String   @id @default(cuid())
  profileId String
  profile   Profile  @relation(fields: [profileId], references: [id], onDelete: Cascade)
  badgeKey  String
  earnedAt  DateTime @default(now())

  @@unique([profileId, badgeKey])
  @@index([profileId])
}

model ShipConfig {
  id          String  @id @default(cuid())
  profileId   String  @unique
  profile     Profile @relation(fields: [profileId], references: [id], onDelete: Cascade)
  shipColor   String  @default("blue")
  shipShape   String  @default("basic")
  trailEffect String  @default("standard")
  companion   String?
}
```

## 6. NextAuth.js Configuration (Replaces Supabase Auth)

### src/lib/auth.ts

```typescript
import { PrismaAdapter } from "@auth/prisma-adapter";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import EmailProvider from "next-auth/providers/email";
import { prisma } from "@/lib/prisma";
import bcrypt from "bcryptjs";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    // Magic Link (passwordless email)
    EmailProvider({
      server: {
        host: process.env.SMTP_HOST,
        port: Number(process.env.SMTP_PORT),
        auth: {
          user: process.env.SMTP_USER,
          pass: process.env.SMTP_PASSWORD,
        },
      },
      from: process.env.SMTP_FROM,
    }),

    // Credentials (email + password/PIN)
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        const user = await prisma.user.findUnique({
          where: { email: credentials.email as string },
        });

        if (!user) return null;

        // Password verification logic here
        // (store hashed password in a separate field or use Account model)
        return user;
      },
    }),
  ],
  session: {
    strategy: "jwt",           // JWT for credentials, DB for email
    maxAge: 30 * 24 * 60 * 60, // 30 days
  },
  pages: {
    signIn: "/login",
    error: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token.id) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
});
```

### src/lib/prisma.ts

```typescript
import { PrismaClient } from "@prisma/client";

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined;
};

export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    log: process.env.NODE_ENV === "development" ? ["query"] : [],
  });

if (process.env.NODE_ENV !== "production") {
  globalForPrisma.prisma = prisma;
}
```

## 7. Key Code Changes from Supabase to Prisma

### Database Queries

The following shows how Supabase queries transform to Prisma:

```typescript
// ──────────────────────────────────────────
// BEFORE (Supabase)
// ──────────────────────────────────────────
const { data } = await supabase
  .from('level_progress')
  .select('*')
  .eq('profile_id', profileId)
  .eq('operation', operation);

// ──────────────────────────────────────────
// AFTER (Prisma)
// ──────────────────────────────────────────
const data = await prisma.levelProgress.findMany({
  where: { profileId, operation },
});

// ──────────────────────────────────────────
// BEFORE (Supabase upsert)
// ──────────────────────────────────────────
await supabase
  .from('level_progress')
  .upsert({
    profile_id: profileId,
    operation,
    level_number: levelNumber,
    stars,
  }, { onConflict: 'profile_id,operation,level_number' });

// ──────────────────────────────────────────
// AFTER (Prisma upsert)
// ──────────────────────────────────────────
await prisma.levelProgress.upsert({
  where: {
    profileId_operation_levelNumber: {
      profileId,
      operation,
      levelNumber,
    },
  },
  update: { stars: Math.max(stars, existing.stars) },
  create: { profileId, operation, levelNumber, stars },
});
```

### API Routes

```typescript
// src/app/api/progress/route.ts
import { auth } from "@/lib/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const profile = await prisma.profile.findFirst({
    where: { userId: session.user.id },
    include: {
      levelProgress: true,
      achievements: true,
      shipConfig: true,
    },
  });

  return NextResponse.json(profile);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();

  const result = await prisma.levelProgress.upsert({
    where: {
      profileId_operation_levelNumber: {
        profileId: body.profileId,
        operation: body.operation,
        levelNumber: body.levelNumber,
      },
    },
    update: {
      stars: body.stars,
      bestAccuracy: body.bestAccuracy,
      bestTimeMs: body.bestTimeMs,
      attempts: { increment: 1 },
      completedAt: body.passed ? new Date() : undefined,
      lastPlayedAt: new Date(),
    },
    create: {
      profileId: body.profileId,
      operation: body.operation,
      levelNumber: body.levelNumber,
      stars: body.stars,
      bestAccuracy: body.bestAccuracy,
      bestTimeMs: body.bestTimeMs,
      attempts: 1,
      completedAt: body.passed ? new Date() : null,
    },
  });

  return NextResponse.json(result);
}
```

## 8. Updated Project Structure (Docker additions)

```
smartmath/
├── docker-compose.yml              # Production compose
├── docker-compose.dev.yml          # Development overrides
├── Dockerfile                      # Multi-stage production build
├── .dockerignore
├── .env.example                    # Environment template
├── prisma/
│   ├── schema.prisma               # Database schema (replaces supabase/migrations)
│   └── migrations/                 # Auto-generated by prisma migrate
├── src/
│   ├── lib/
│   │   ├── prisma.ts               # Prisma client singleton
│   │   ├── auth.ts                 # NextAuth.js configuration
│   │   ├── constants.ts
│   │   ├── types.ts
│   │   └── utils.ts
│   ├── app/
│   │   ├── api/
│   │   │   ├── auth/
│   │   │   │   └── [...nextauth]/
│   │   │   │       └── route.ts    # NextAuth.js API route
│   │   │   └── progress/
│   │   │       └── route.ts
│   │   └── ... (rest unchanged)
│   └── ... (rest unchanged)
├── scripts/
│   ├── setup.sh                    # Initial server setup script
│   ├── deploy.sh                   # Deployment/update script
│   └── backup.sh                   # Database backup script
└── ... (rest of project)
```

## 9. Next.js Configuration for Standalone Output

```javascript
// next.config.mjs
/** @type {import('next').NextConfig} */
const nextConfig = {
  output: 'standalone',  // Required for Docker deployment
  // ... rest of config
};

export default nextConfig;
```

## 10. Server Setup Guide (Ubuntu + Cloudflare)

### 10.1 Prerequisites

- Ubuntu 22.04+ server (VPS, bare metal, or home server)
- Domain registered with Cloudflare DNS
- SSH access to the server

### 10.2 Initial Server Setup

```bash
#!/bin/bash
# scripts/setup.sh — Run on fresh Ubuntu server

set -euo pipefail

echo "=== SmartMath Server Setup ==="

# 1. Update system
sudo apt update && sudo apt upgrade -y

# 2. Install Docker
curl -fsSL https://get.docker.com | sudo sh
sudo usermod -aG docker $USER

# 3. Install Docker Compose plugin
sudo apt install -y docker-compose-plugin

# 4. Create app directory
sudo mkdir -p /opt/smartmath
sudo chown $USER:$USER /opt/smartmath

# 5. Install Git
sudo apt install -y git

# 6. Configure firewall (only SSH needed — Cloudflare Tunnel handles HTTP)
sudo ufw allow OpenSSH
sudo ufw --force enable

echo "=== Setup complete! Log out and back in for Docker group. ==="
echo "Next steps:"
echo "  1. Clone the repo to /opt/smartmath"
echo "  2. Copy .env.example to .env and fill in values"
echo "  3. Set up Cloudflare Tunnel"
echo "  4. Run: docker compose up -d"
```

### 10.3 Cloudflare Tunnel Setup

**Step 1: Create tunnel in Cloudflare Dashboard**

1. Go to https://one.dash.cloudflare.com
2. Navigate to **Networks** > **Tunnels**
3. Click **Create a tunnel**
4. Name it `smartmath`
5. Copy the tunnel token → put in `.env` as `CLOUDFLARE_TUNNEL_TOKEN`

**Step 2: Configure tunnel routing**

In the Cloudflare Dashboard tunnel config, add a public hostname:

| Field | Value |
|-------|-------|
| Subdomain | `smartmath` (or your choice) |
| Domain | `yourdomain.com` |
| Type | `HTTP` |
| URL | `app:3000` |

**Step 3: DNS is automatic**

Cloudflare automatically creates a CNAME record for the tunnel. No manual DNS configuration needed.

### 10.4 Deployment

```bash
#!/bin/bash
# scripts/deploy.sh — Deploy or update SmartMath

set -euo pipefail

cd /opt/smartmath

echo "=== Pulling latest code ==="
git pull origin main

echo "=== Building containers ==="
docker compose build app

echo "=== Running database migrations ==="
docker compose run --rm migrate

echo "=== Restarting application ==="
docker compose up -d app tunnel

echo "=== Cleaning up old images ==="
docker image prune -f

echo "=== Deployment complete! ==="
docker compose ps
```

### 10.5 Database Backups

```bash
#!/bin/bash
# scripts/backup.sh — Backup PostgreSQL database

set -euo pipefail

BACKUP_DIR="/opt/smartmath/backups"
TIMESTAMP=$(date +%Y%m%d_%H%M%S)
BACKUP_FILE="${BACKUP_DIR}/smartmath_${TIMESTAMP}.sql.gz"

mkdir -p "$BACKUP_DIR"

echo "=== Backing up SmartMath database ==="

docker compose exec -T db pg_dump \
  -U "${POSTGRES_USER:-smartmath}" \
  "${POSTGRES_DB:-smartmath}" \
  | gzip > "$BACKUP_FILE"

echo "Backup saved: $BACKUP_FILE"
echo "Size: $(du -h "$BACKUP_FILE" | cut -f1)"

# Keep only last 30 backups
cd "$BACKUP_DIR"
ls -t smartmath_*.sql.gz | tail -n +31 | xargs -r rm --

echo "=== Backup complete ==="
```

**Cron job for daily backups:**

```bash
# Add to crontab: crontab -e
0 3 * * * /opt/smartmath/scripts/backup.sh >> /var/log/smartmath-backup.log 2>&1
```

### 10.6 Database Restore

```bash
# Restore from backup
gunzip -c backups/smartmath_20260309_030000.sql.gz | \
  docker compose exec -T db psql -U smartmath smartmath
```

## 11. Development Workflow

### Local Development with Docker

```bash
# Start database only (develop Next.js locally)
docker compose up db -d

# Set DATABASE_URL in .env.local for local dev
# DATABASE_URL=postgresql://smartmath:your_password@localhost:5432/smartmath

# Run migrations locally
npx prisma migrate dev

# Start Next.js dev server
npm run dev
```

### Full Docker Development

```bash
# Start everything with dev overrides (hot reload)
docker compose -f docker-compose.yml -f docker-compose.dev.yml up

# Run Prisma Studio (database GUI)
npx prisma studio
```

### Useful Commands

```bash
# View logs
docker compose logs -f app
docker compose logs -f db

# Access database shell
docker compose exec db psql -U smartmath smartmath

# Reset database (development only!)
docker compose exec db psql -U smartmath -c "DROP SCHEMA public CASCADE; CREATE SCHEMA public;"
docker compose run --rm migrate

# Rebuild after code changes
docker compose build app && docker compose up -d app

# Stop everything
docker compose down

# Stop and remove volumes (DESTROYS DATA)
docker compose down -v
```

## 12. Production Checklist

### Security

- [ ] Change default PostgreSQL password in `.env`
- [ ] Generate strong `NEXTAUTH_SECRET` (`openssl rand -base64 32`)
- [ ] Enable UFW firewall (only SSH allowed, Cloudflare handles HTTP)
- [ ] Set up automatic security updates: `sudo apt install unattended-upgrades`
- [ ] Database only accessible from Docker network (bound to 127.0.0.1)
- [ ] No ports exposed to internet (Cloudflare Tunnel handles everything)

### Performance

- [ ] Enable Cloudflare caching for static assets
- [ ] Set `Cache-Control` headers for images, sounds, fonts
- [ ] Enable Cloudflare Auto Minify (HTML, CSS, JS)
- [ ] Monitor with `docker stats` for resource usage
- [ ] PostgreSQL: Set `shared_buffers` and `work_mem` based on server RAM

### Reliability

- [ ] Set up daily database backups (cron job)
- [ ] Test database restore procedure
- [ ] Set up uptime monitoring (Cloudflare or UptimeRobot)
- [ ] Configure Docker restart policies (`unless-stopped`)
- [ ] Set up log rotation: `docker compose logs --tail=1000`

### Monitoring

```bash
# Quick health check
curl -s http://localhost:3000/api/health | jq

# Docker resource usage
docker stats --no-stream

# Database size
docker compose exec db psql -U smartmath -c "SELECT pg_size_pretty(pg_database_size('smartmath'));"

# Active connections
docker compose exec db psql -U smartmath -c "SELECT count(*) FROM pg_stat_activity;"
```

### Health Check API

```typescript
// src/app/api/health/route.ts
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await prisma.$queryRaw`SELECT 1`;
    return NextResponse.json({
      status: "healthy",
      database: "connected",
      timestamp: new Date().toISOString(),
    });
  } catch (error) {
    return NextResponse.json(
      { status: "unhealthy", database: "disconnected" },
      { status: 503 }
    );
  }
}
```

## 13. Cloudflare Configuration Tips

### Page Rules / Cache Rules

| URL Pattern | Setting |
|------------|---------|
| `smartmath.yourdomain.com/sounds/*` | Cache Everything, Edge TTL: 30 days |
| `smartmath.yourdomain.com/images/*` | Cache Everything, Edge TTL: 30 days |
| `smartmath.yourdomain.com/_next/static/*` | Cache Everything, Edge TTL: 1 year |
| `smartmath.yourdomain.com/api/*` | Bypass Cache |

### Recommended Cloudflare Settings

| Setting | Value |
|---------|-------|
| SSL/TLS | Full (strict) |
| Always Use HTTPS | On |
| Auto Minify | HTML, CSS, JS |
| Brotli | On |
| HTTP/2 | On |
| HTTP/3 (QUIC) | On |
| 0-RTT | On |
| WebSockets | On (for future live features) |
| Rocket Loader | Off (can break React) |

## 14. Minimum Server Requirements

| Resource | Minimum | Recommended |
|----------|---------|-------------|
| CPU | 1 vCPU | 2 vCPU |
| RAM | 1 GB | 2 GB |
| Storage | 10 GB | 20 GB SSD |
| OS | Ubuntu 22.04 LTS | Ubuntu 24.04 LTS |
| Network | Any (Cloudflare handles CDN) | Any |

The app is lightweight — a $5-10/month VPS is more than enough for hundreds of concurrent users.
