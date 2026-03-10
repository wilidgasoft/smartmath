import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const profile = await prisma.profile.findFirst({
    where: { userId: session.user.id },
    include: {
      levelProgress: true,
      achievements: true,
      shipConfig: true,
    },
  });

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  return NextResponse.json(profile);
}

export async function POST(request: Request) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const body = await request.json();
  const { profileId, operation, levelNumber, stars, bestAccuracy, bestTimeMs, passed } = body;

  // Verify this profile belongs to the current user
  const profile = await prisma.profile.findFirst({
    where: { id: profileId, userId: session.user.id },
  });

  if (!profile) {
    return NextResponse.json({ error: 'Profile not found' }, { status: 404 });
  }

  // Get existing progress to preserve best values
  const existing = await prisma.levelProgress.findFirst({
    where: { profileId, operation, levelNumber },
  });

  const result = await prisma.levelProgress.upsert({
    where: {
      profileId_operation_levelNumber: { profileId, operation, levelNumber },
    },
    update: {
      stars: Math.max(stars, existing?.stars ?? 0),
      bestAccuracy: Math.max(bestAccuracy, existing?.bestAccuracy ?? 0),
      bestTimeMs:
        bestTimeMs != null
          ? existing?.bestTimeMs != null
            ? Math.min(bestTimeMs, existing.bestTimeMs)
            : bestTimeMs
          : existing?.bestTimeMs ?? null,
      attempts: { increment: 1 },
      completedAt: passed ? (existing?.completedAt ?? new Date()) : existing?.completedAt,
      lastPlayedAt: new Date(),
    },
    create: {
      profileId,
      operation,
      levelNumber,
      stars,
      bestAccuracy,
      bestTimeMs: bestTimeMs ?? null,
      attempts: 1,
      completedAt: passed ? new Date() : null,
    },
  });

  // Update profile totals
  await prisma.profile.update({
    where: { id: profileId },
    data: {
      totalStars: { increment: Math.max(0, stars - (existing?.stars ?? 0)) },
      totalProblemsSolved: { increment: body.totalProblems ?? 20 },
      totalPlayTimeMs: { increment: BigInt(body.totalTimeMs ?? 0) },
      longestStreak:
        body.maxStreak > profile.longestStreak
          ? body.maxStreak
          : profile.longestStreak,
    },
  });

  return NextResponse.json(result);
}
