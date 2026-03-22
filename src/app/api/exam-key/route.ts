import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { v4 as uuidv4 } from 'uuid';

// GET - Verify exam key
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const key = searchParams.get('key');
    const studentId = searchParams.get('studentId');

    if (!key) {
      return NextResponse.json(
        { error: 'Key is required' },
        { status: 400 }
      );
    }

    const examKey = await db.examKey.findUnique({
      where: { key },
      include: { test: true }
    });

    if (!examKey) {
      return NextResponse.json(
        { error: 'Invalid exam key' },
        { status: 404 }
      );
    }

    if (examKey.used) {
      return NextResponse.json(
        { error: 'This key has already been used' },
        { status: 400 }
      );
    }

    if (new Date() > examKey.expiresAt) {
      return NextResponse.json(
        { error: 'This key has expired' },
        { status: 400 }
      );
    }

    if (studentId && examKey.studentId !== studentId) {
      return NextResponse.json(
        { error: 'This key is not assigned to you' },
        { status: 403 }
      );
    }

    return NextResponse.json({
      valid: true,
      test: examKey.test,
      keyId: examKey.id
    });

  } catch (error) {
    console.error('Verify key error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Generate exam key
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { testId, studentId } = body;

    if (!testId || !studentId) {
      return NextResponse.json(
        { error: 'Test ID and Student ID are required' },
        { status: 400 }
      );
    }

    // Generate unique key
    const key = uuidv4().substring(0, 8).toUpperCase();

    // Set expiry to 1 hour from now
    const expiresAt = new Date(Date.now() + 60 * 60 * 1000);

    const examKey = await db.examKey.create({
      data: {
        testId,
        studentId,
        key,
        expiresAt
      }
    });

    return NextResponse.json({
      key: examKey.key,
      expiresAt: examKey.expiresAt
    });

  } catch (error) {
    console.error('Generate key error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Mark key as used
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { keyId } = body;

    await db.examKey.update({
      where: { id: keyId },
      data: { used: true }
    });

    return NextResponse.json({
      message: 'Key marked as used'
    });

  } catch (error) {
    console.error('Update key error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
