// src/app/api/registry/route.ts
import { NextResponse } from 'next/server';
import { verifySchoolCredential } from '@/lib/schools';

export async function POST(request: Request) {
  try {
    const formData = await request.formData();
    const schoolName = formData.get('schoolName') as string;
    const file = formData.get('syllabus') as File;

    if (!schoolName) {
        return NextResponse.json({ error: 'School name is required' }, { status: 400 });
    }

    const school = await verifySchoolCredential(schoolName);

    if (!school) {
        return NextResponse.json({ error: 'School verification failed. Not a registered institution.' }, { status: 401 });
    }

    // In a real app, we would process and store the file here (e.g., upload to S3, parse text for RAG).
    // For this scaffold, we just log it.
    console.log(`Uploaded syllabus: ${file?.name} for ${school.name}`);

    return NextResponse.json({ success: true, school });
  } catch (error) {
    console.error('Registry API error:', error);
    return NextResponse.json({ error: 'Internal Server Error' }, { status: 500 });
  }
}
