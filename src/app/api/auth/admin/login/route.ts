import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// Helper function to hash password for comparison
async function hashPassword(password: string): Promise<string> {
  const encoder = new TextEncoder();
  const data = encoder.encode(password);
  const hashBuffer = await crypto.subtle.digest('SHA-256', data);
  const hashArray = Array.from(new Uint8Array(hashBuffer));
  return hashArray.map(b => b.toString(16).padStart(2, '0')).join('');
}

// POST - Admin login
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { email, password } = body;

    // Validation
    if (!email || !password) {
      return NextResponse.json(
        { error: 'Email and password are required' },
        { status: 400 }
      );
    }

    // Find admin
    const admin = await db.admin.findUnique({
      where: { email }
    });

    if (!admin) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    // Verify password
    const hashedPassword = await hashPassword(password);
    if (admin.password !== hashedPassword) {
      return NextResponse.json(
        { error: 'Invalid email or password' },
        { status: 401 }
      );
    }

    return NextResponse.json({
      message: 'Login successful',
      admin: {
        id: admin.id,
        fullName: admin.fullName,
        email: admin.email,
        organizationName: admin.organizationName,
        role: admin.role,
        department: admin.department,
        contactNumber: admin.contactNumber,
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
