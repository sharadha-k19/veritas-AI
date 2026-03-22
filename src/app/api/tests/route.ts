import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch all tests or tests by admin
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const adminId = searchParams.get('adminId');
    const status = searchParams.get('status');
    const studentId = searchParams.get('studentId');

    if (studentId) {
      // Get tests for student (active tests they haven't taken or have taken)
      const results = await db.testResult.findMany({
        where: { studentId },
        include: { test: true }
      });
      
      const takenTestIds = results.map(r => r.testId);
      
      const activeTests = await db.test.findMany({
        where: { 
          status: 'Active',
          id: { notIn: takenTestIds }
        },
        orderBy: { createdAt: 'desc' }
      });
      
      const completedTests = results.filter(r => r.completedAt).map(r => ({
        ...r.test,
        marksScored: r.marksScored,
        riskScore: r.riskScore,
        flagStatus: r.flagStatus,
        resultId: r.id
      }));
      
      const inProgressTests = results.filter(r => r.startedAt && !r.completedAt).map(r => ({
        ...r.test,
        resultId: r.id
      }));

      return NextResponse.json({
        upcoming: activeTests.filter(t => new Date() < new Date(t.createdAt.getTime() + 24 * 60 * 60 * 1000)),
        ongoing: inProgressTests,
        completed: completedTests
      });
    }

    let tests;
    if (adminId) {
      tests = await db.test.findMany({
        where: { createdBy: adminId },
        include: { 
          results: {
            include: {
              student: true
            }
          }
        },
        orderBy: { createdAt: 'desc' }
      });
    } else if (status) {
      tests = await db.test.findMany({
        where: { status },
        orderBy: { createdAt: 'desc' }
      });
    } else {
      tests = await db.test.findMany({
        orderBy: { createdAt: 'desc' }
      });
    }

    return NextResponse.json({ tests });
  } catch (error) {
    console.error('Fetch tests error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create a new test
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { name, type, timeLimit, totalMarks, examType, allowedTools, questions, createdBy } = body;

    // Validation
    if (!name || !type || !timeLimit || !totalMarks || !createdBy) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    const test = await db.test.create({
      data: {
        name,
        type,
        timeLimit: parseInt(timeLimit),
        totalMarks: parseInt(totalMarks),
        status: 'Draft',
        examType: examType || 'Closed-book',
        allowedTools: allowedTools ? JSON.stringify(allowedTools) : null,
        questions: JSON.stringify(questions || []),
        createdBy,
      }
    });

    return NextResponse.json({
      message: 'Test created successfully',
      test
    }, { status: 201 });

  } catch (error) {
    console.error('Create test error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// PUT - Update test
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, status, ...updateData } = body;

    if (!id) {
      return NextResponse.json(
        { error: 'Test ID is required' },
        { status: 400 }
      );
    }

    const updatePayload: Record<string, unknown> = {};
    
    if (status) updatePayload.status = status;
    if (updateData.name) updatePayload.name = updateData.name;
    if (updateData.type) updatePayload.type = updateData.type;
    if (updateData.timeLimit) updatePayload.timeLimit = parseInt(updateData.timeLimit as string);
    if (updateData.totalMarks) updatePayload.totalMarks = parseInt(updateData.totalMarks as string);
    if (updateData.examType) updatePayload.examType = updateData.examType;
    if (updateData.allowedTools) updatePayload.allowedTools = JSON.stringify(updateData.allowedTools);
    if (updateData.questions) updatePayload.questions = JSON.stringify(updateData.questions);

    const test = await db.test.update({
      where: { id },
      data: updatePayload
    });

    return NextResponse.json({
      message: 'Test updated successfully',
      test
    });

  } catch (error) {
    console.error('Update test error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// DELETE - Delete test
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json(
        { error: 'Test ID is required' },
        { status: 400 }
      );
    }

    await db.test.delete({
      where: { id }
    });

    return NextResponse.json({
      message: 'Test deleted successfully'
    });

  } catch (error) {
    console.error('Delete test error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
