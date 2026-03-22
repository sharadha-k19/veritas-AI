import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';

// GET - Fetch results
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const testId = searchParams.get('testId');
    const adminId = searchParams.get('adminId');
    const resultId = searchParams.get('resultId');

    if (resultId) {
      // Get single result with proctoring logs
      const result = await db.testResult.findUnique({
        where: { id: resultId },
        include: {
          student: true,
          test: true,
          proctoringLogs: {
            orderBy: { timestamp: 'asc' }
          }
        }
      });

      if (!result) {
        return NextResponse.json(
          { error: 'Result not found' },
          { status: 404 }
        );
      }

      return NextResponse.json({ result });
    }

    if (testId) {
      // Get all results for a test
      const results = await db.testResult.findMany({
        where: { testId },
        include: {
          student: true,
          test: true,
          proctoringLogs: true
        },
        orderBy: { createdAt: 'desc' }
      });

      return NextResponse.json({ results });
    }

    if (adminId) {
      // Get all results for admin's tests
      const tests = await db.test.findMany({
        where: { createdBy: adminId },
        include: {
          results: {
            include: {
              student: true,
              proctoringLogs: true
            }
          }
        }
      });

      const allResults = tests.flatMap(t => t.results);

      return NextResponse.json({ results: allResults });
    }

    // Get all results
    const results = await db.testResult.findMany({
      include: {
        student: true,
        test: true
      },
      orderBy: { createdAt: 'desc' }
    });

    return NextResponse.json({ results });

  } catch (error) {
    console.error('Fetch results error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

// POST - Create or update test result
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { studentId, testId, action, answers, riskScore, eventType, description, riskPoints, severity } = body;

    if (action === 'start') {
      // Check if result already exists
      let result = await db.testResult.findFirst({
        where: { studentId, testId }
      });

      if (result) {
        // Resume existing test
        return NextResponse.json({ result });
      }

      // Create new test result
      result = await db.testResult.create({
        data: {
          studentId,
          testId,
          startedAt: new Date(),
          answers: JSON.stringify([])
        }
      });

      return NextResponse.json({ result });
    }

    if (action === 'submit') {
      const result = await db.testResult.update({
        where: { id: body.resultId },
        data: {
          completedAt: new Date(),
          answers: JSON.stringify(answers || []),
          marksScored: body.marksScored || 0,
          riskScore: riskScore || 0,
          flagStatus: riskScore >= 50 ? 'Red Flag' : riskScore >= 25 ? 'Warning' : 'None'
        }
      });

      return NextResponse.json({ result });
    }

    if (action === 'log') {
      // Add proctoring log
      const log = await db.proctoringLog.create({
        data: {
          testResultId: body.resultId,
          eventType,
          description,
          riskPoints: riskPoints || 0,
          severity: severity || 'Low'
        }
      });

      // Update risk score
      const currentResult = await db.testResult.findUnique({
        where: { id: body.resultId },
        include: { proctoringLogs: true }
      });

      if (currentResult) {
        const totalRisk = currentResult.proctoringLogs.reduce((sum, log) => sum + log.riskPoints, 0);
        
        await db.testResult.update({
          where: { id: body.resultId },
          data: {
            riskScore: Math.min(totalRisk, 100),
            flagStatus: totalRisk >= 50 ? 'Red Flag' : totalRisk >= 25 ? 'Warning' : 'None'
          }
        });
      }

      return NextResponse.json({ log });
    }

    return NextResponse.json(
      { error: 'Invalid action' },
      { status: 400 }
    );

  } catch (error) {
    console.error('Result operation error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
