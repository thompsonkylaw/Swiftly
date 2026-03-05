import { NextResponse } from 'next/server';
import { getSchoolByName, updateSchoolBulletin } from '@/lib/store';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const schoolName = searchParams.get('school');
  
  if (!schoolName) return NextResponse.json([], { status: 400 });

  const school = getSchoolByName(schoolName);
  return NextResponse.json(school ? school.bulletin : []);
}

export async function POST(request: Request) {
  const { schoolName, content, userId } = await request.json();
  const school = getSchoolByName(schoolName);

  if (!school) return NextResponse.json({ error: 'School not found' }, { status: 404 });
  
  // Validate ownership
  if (school.ownerId !== userId) {
      return NextResponse.json({ error: 'Unauthorized to post bulletin' }, { status: 403 });
  }

  const newPost = {
      id: Date.now().toString(),
      content,
      authorId: userId,
      createdAt: new Date().toISOString()
  };

  updateSchoolBulletin(schoolName, newPost);
  return NextResponse.json(newPost);
}
