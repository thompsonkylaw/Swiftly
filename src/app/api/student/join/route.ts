// src/app/api/student/join/route.ts
import { NextResponse } from 'next/server';
import { getClassByCode, enrollStudentInClass, getAssignmentsByClass } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const { code } = await request.json();
    const classData = getClassByCode(code);
    
    if (!classData) {
      return NextResponse.json({ error: 'Invalid invite code' }, { status: 404 });
    }

    // Mock student ID (in real app, from session)
    const studentId = 'student-1'; 
    enrollStudentInClass(studentId, classData.id);

    // Return class info + assignments
    const assignments = getAssignmentsByClass(classData.id);
    
    return NextResponse.json({ 
      class: classData,
      assignments 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Join failed' }, { status: 500 });
  }
}
