import { prisma } from '@/lib/prisma';
import { NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';

function getAgeGroup(age: number): 'young' | 'medium' | 'advanced' {
  if (age <= 7) return 'young';
  if (age <= 10) return 'medium';
  return 'advanced';
}

export async function POST(request: Request) {
  try {
    const { email, password, displayName, age } = await request.json();

    if (!email || !password || !displayName) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // Check if user already exists
    const existing = await prisma.user.findUnique({ where: { email } });
    if (existing) {
      return NextResponse.json({ error: 'Email already registered' }, { status: 409 });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name: displayName,
        accounts: {
          create: {
            type: 'credentials',
            provider: 'credentials',
            providerAccountId: email,
            access_token: hashedPassword,
          },
        },
        profiles: {
          create: {
            displayName,
            ageGroup: getAgeGroup(age ?? 8),
          },
        },
      },
    });

    return NextResponse.json({ success: true, userId: user.id });
  } catch (error) {
    const err = error as Error;
    console.error('Registration error:', err?.message ?? error);
    if (process.env.NODE_ENV === 'development') {
      return NextResponse.json(
        { error: 'Registration failed', detail: err?.message },
        { status: 500 }
      );
    }
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
