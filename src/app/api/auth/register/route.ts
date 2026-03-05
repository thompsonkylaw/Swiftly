import { NextResponse } from 'next/server';
import { addSchool, getSchoolByName } from '@/lib/store';
import { School } from '@/lib/types';

export async function POST(request: Request) {
  try {
    const { name, role, schoolName, isAdmin } = await request.json();
    const userId = name.toLowerCase().replace(/\s/g, '-') + '-' + Date.now(); // Simple mock ID

    // Handle Teacher Registration
    if (role === 'teacher') {
      let isSchoolAdmin = false;
      if (schoolName) {
         let school = getSchoolByName(schoolName);
         if (!school) {
             // Create new school if it doesn't exist
             school = {
                id: Date.now().toString(),
                name: schoolName,
                location: 'Unknown',
                ownerId: isAdmin ? userId : undefined, // Set owner if admin
                bulletin: []
             };
             addSchool(school);
             isSchoolAdmin = !!isAdmin;
         } else {
             // Existing school
             if (isAdmin && !school.ownerId) {
                 school.ownerId = userId; // Claim ownership if none exists
                 isSchoolAdmin = true;
             } else if (isAdmin && school.ownerId === userId) {
                 isSchoolAdmin = true;
             }
             // If school already has owner, we don't grant admin automatically in this mock
             // or we allow multiple admins? Let's assume simplistic "first owner" or "just mark as admin" mock
             if (isAdmin) isSchoolAdmin = true; // In this mock, we trust the checkbox for simplicity
         }
      }

      return NextResponse.json({ 
        redirect: '/teacher/command-center',
        user: { id: userId, name, role },
        isAdmin: isSchoolAdmin
      });
    }

    // Handle Student Registration
    if (role === 'student' && schoolName) {
      let school = getSchoolByName(schoolName);

      if (!school) {
        // Students CANNOT create schools anymore or be owners
        // In a real app, we might error here: "School not found"
        // For this mock, we'll create a placeholder school but with NO OWNER
         school = {
          id: Date.now().toString(),
          name: schoolName,
          location: 'Unknown',
          bulletin: []
        };
        addSchool(school);
      }

      return NextResponse.json({
        redirect: `/student/dashboard?school=${encodeURIComponent(schoolName)}&user=${userId}&owner=false`,
        user: { id: userId, name, role, schoolId: school.id },
        isOwner: false
      });
    }

    return NextResponse.json({ error: 'Invalid data' }, { status: 400 });

  } catch (error) {
    return NextResponse.json({ error: 'Registration failed' }, { status: 500 });
  }
}
