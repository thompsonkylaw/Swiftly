import { NextResponse } from 'next/server';
import { getAssignmentsForStudent, getSubmissionsForStudent } from '@/lib/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const studentId = searchParams.get('studentId');

  if (!studentId) {
    return NextResponse.json({ error: 'Missing studentId' }, { status: 400 });
  }

  const assignments = getAssignmentsForStudent(studentId);
  const submissions = getSubmissionsForStudent(studentId);

  // Filter out assignments that have already been submitted
  const pendingAssignments = assignments.filter(assignment => 
      !submissions.some(sub => sub.assignmentId === assignment.id)
  );

  return NextResponse.json(pendingAssignments);
