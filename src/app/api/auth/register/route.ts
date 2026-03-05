import { NextResponse } from 'next/server';
import { addSchool, getSchoolByName } from '@/lib/store';
import { School } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const { name, role, schoolName } = await request.json();
    const userId = name.toLowerCase().replace(/\s/g, '-') + '-' + Date.now(); // Simple mock ID

    if (role === 'teacher') {
      return NextResponse.json({ 
        redirect: '/teacher/command-center',
        user: { id: userId, name, role }
      });
    }

    if (role === 'student' && schoolName) {
      let school = getSchoolByName(schoolName);
      let isOwner = false;

      if (!school) {
        // Create new school, assign this student as owner
        school = {
          id: Date.now().toString(),
          name: schoolName,
          location: 'Unknown',
          ownerId: userId,
          bulletin: []
        };
        addSchool(school);
        isOwner = true;
      } else {
         isOwner = school.ownerId === userId;
      }

      return NextResponse.json({
        redirect: `/student/dashboard?school=${encodeURIComponent(schoolName)}&user=${userId}&owner=${isOwner}`,
        user: { id: userId, name, role, schoolId: school.id },
        isOwner
      });
    }

    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });

  } catch (error) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
