import { NextResponse } from 'next/server';
import { submitAssignment } from '@/lib/store';
import { Submission } from '@/lib/types';

export async function POST(request: Request, context: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await context.params;
    const body = await request.json();
    const { studentId, content, score } = body;

    if (!studentId || !content) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const newSubmission: Submission = {
      id: Date.now().toString(),
      assignmentId: id,
      studentId,
      content: typeof content === 'string' ? content : JSON.stringify(content),
      submittedAt: new Date().toISOString(),
      score,
      status: 'submitted'
    };

    submitAssignment(newSubmission);

    console.log(`Assignment ${id} submitted by student ${studentId}`);
    
    return NextResponse.json({ success: true, submission: newSubmission });
  } catch (error) {
    console.error("Submission failed:", error);
    return NextResponse.json({ error: 'Failed to submit assignment' }, { status: 500 });
  }
}
