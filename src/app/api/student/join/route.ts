// src/app/api/student/join/route.ts
import { NextResponse } from 'next/server';
import { getClassByCode, enrollStudentInClass, getAssignmentsByClass } from '@/lib/store';

export async function POST(request: Request) {
  try {
    const { code, studentId } = await request.json();
    const classData = getClassByCode(code);
    
    if (!classData) {
      return NextResponse.json({ error: 'Invalid invite code' }, { status: 404 });
    }

    // Use provided student ID or fallback
    const actualStudentId = studentId || 'student-1'; 
    enrollStudentInClass(actualStudentId, classData.id);

    // Return class info + assignments
    console.log(`Student ${actualStudentId} joining class ${classData.id}`);
    const assignments = getAssignmentsByClass(classData.id);
    
    return NextResponse.json({ 
      class: classData,
      assignments 
    });
  } catch (error) {
    return NextResponse.json({ error: 'Join failed' }, { status: 500 });
  }
}
