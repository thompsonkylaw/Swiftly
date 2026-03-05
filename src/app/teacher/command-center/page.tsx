'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface BulletinPost {
  id: string;
  content: string;
  createdAt: string;
}

function TeacherDashboardContent() {
  const searchParams = useSearchParams();
  const schoolName = searchParams.get('school'); // Passed from signup redirect
  const isAdmin = searchParams.get('admin') === 'true';
  const userId = searchParams.get('user');

  const [className, setClassName] = useState('');
  const [classes, setClasses] = useState<{ id: string, name: string, inviteCode: string }[]>([]);
  const [bulletinPost, setBulletinPost] = useState('');
  const [posts, setPosts] = useState<BulletinPost[]>([]);

  useEffect(() => {
    async function fetchData() {
      // Fetch Classes
      try {
        const res = await fetch('/api/class');
        const data = await res.json();
        if (Array.isArray(data)) setClasses(data);
      } catch (err) { console.error(err); }

      // Fetch Bulletin if Admin
      if (schoolName) {
         try {
             fetch(`/api/school/bulletin?school=${encodeURIComponent(schoolName)}`)
             .then(res => res.json())
             .then(data => setPosts(Array.isArray(data) ? data : []));
         } catch(e) { console.error(e); }
      }
    }
    fetchData();
  }, [schoolName]);

  const createClass = async () => {
    if (!className.trim()) return;
    const res = await fetch('/api/class', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name: className }),
    });
    const newClass = await res.json();
    setClasses(prev => [...prev, newClass]);
    setClassName('');
  };

  const handlePostBulletin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!bulletinPost.trim() || !schoolName || !userId) return;

    try {
        const res = await fetch('/api/school/bulletin', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ schoolName, content: bulletinPost, userId }),
        });
        if (res.ok) {
            setBulletinPost('');
             // Refresh
             fetch(`/api/school/bulletin?school=${encodeURIComponent(schoolName)}`)
             .then(res => res.json())
             .then(data => setPosts(Array.isArray(data) ? data : []));
        } else {
            alert("Failed to post: Not authorized?");
        }
    } catch(err) { console.error(err); }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Teacher Dashboard</h1>
        
        {/* School Admin Section */}
        {schoolName && (
            <div className="bg-white shadow rounded-lg p-6 mb-8 border-l-4 border-indigo-600">
                <h2 className="text-xl font-bold text-gray-800">School: {schoolName}</h2>
                {isAdmin ? (
                    <div className="mt-4">
                        <h3 className="font-semibold text-gray-700 mb-2">📢 Admin Bulletin Board</h3>
                        <form onSubmit={handlePostBulletin} className="flex gap-2 mb-4">
                            <input
                                type="text"
                                className="flex-1 border p-2 rounded text-black"
                                placeholder="Post a school-wide announcement..."
                                value={bulletinPost}
                                onChange={e => setBulletinPost(e.target.value)}
                            />
                            <button type="submit" className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-700">Post</button>
                        </form>
                        <div className="bg-gray-50 p-3 rounded h-32 overflow-y-auto">
                           {posts.map(p => (
                               <div key={p.id} className="border-b py-1 text-sm text-gray-600 last:border-0">{p.content}</div>
                           ))}
                           {posts.length === 0 && <span className="text-gray-400 text-sm">No posts yet.</span>}
                        </div>
                    </div>
                ) : (
                    <p className="text-gray-500 mt-2 text-sm">You are logged in as a teacher at this school.</p>
                )}
            </div>
        )}

        {/* Create Class Section */}
        <div className="bg-white shadow rounded-lg p-6 mb-8">
          <h2 className="text-xl font-bold mb-4 text-gray-800">Create New Class</h2>
          <div className="flex gap-4">
            <input
              type="text"
              className="flex-1 border p-2 rounded text-black"
              value={className}
              onChange={e => setClassName(e.target.value)}
              placeholder="e.g. AP US History - Period 1"
            />
            <button
              onClick={createClass}
              className="bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
            >
              Create Class
            </button>
          </div>
        </div>

        {/* Classes List */}
        <h2 className="text-xl font-bold mb-4 text-gray-800">Your Classes</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {classes.map(cls => (
            <div key={cls.id} className="bg-white p-6 rounded-lg shadow-sm border border-gray-200">
              <div className="flex justify-between items-start mb-4">
                <h3 className="text-lg font-bold text-gray-900">{cls.name}</h3>
                <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded font-mono font-bold tracking-wider">
                  {cls.inviteCode}
                </span>
              </div>
              <p className="text-gray-500 text-sm mb-4">Invite Code: {cls.inviteCode}</p>
              <Link
                href={`/teacher/class/${cls.id}`}
                className="text-blue-600 hover:text-blue-800 font-medium"
              >
                Manage Assignments &rarr;
              </Link>
            </div>
          ))}
          {classes.length === 0 && (
            <div className="col-span-full text-center py-12 text-gray-500 bg-white rounded-lg border border-dashed border-gray-300">
              No classes active. Create one above to get started.
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function TeacherDashboard() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <TeacherDashboardContent />
    </Suspense>
  );
}

