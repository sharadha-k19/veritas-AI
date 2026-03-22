import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Helper function to hash password
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// POST - Register new student
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { fullName, email, password, confirmPassword, collegeName, department, studentId } = body;

    // Validation
    if (!fullName || !email || !password || !confirmPassword || !collegeName || !department || !studentId) {
      return NextResponse.json(
        { error: 'All fields are required' },
        { status: 400 }
      );
    }

    if (password !== confirmPassword) {
      return NextResponse.json(
        { error: 'Passwords do not match' },
        { status: 400 }
      );
    }

    if (password.length < 6) {
      return NextResponse.json(
        { error: 'Password must be at least 6 characters' },
        { status: 400 }
      );
    }

    // Check if email already exists
    const existingEmail = await db.student.findUnique({
      where: { email }
    });

    if (existingEmail) {
      return NextResponse.json(
        { error: 'Email already registered' },
        { status: 400 }
      );
    }

    // Check if studentId already exists
    const existingStudentId = await db.student.findUnique({
      where: { studentId }
    });

    if (existingStudentId) {
      return NextResponse.json(
        { error: 'Student ID already registered' },
        { status: 400 }
      );
    }

    // Hash password
    const hashedPassword = await hashPassword(password);

    // Create student
    const student = await db.student.create({
      data: {
        fullName,
        email,
        password: hashedPassword,
        collegeName,
        department,
        studentId,
      }
    });

    return NextResponse.json({
      message: 'Registration successful',
      student: {
        id: student.id,
        fullName: student.fullName,
        email: student.email,
        collegeName: student.collegeName,
        department: student.department,
        studentId: student.studentId,
      }
    }, { status: 201 });

  } catch (error) {
    console.error('Registration error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
