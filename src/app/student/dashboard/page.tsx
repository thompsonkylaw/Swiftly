'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import Link from 'next/link';

interface BulletinPost {
  id: string;
  content: string;
  createdAt: string;
}

interface Assignment {
  id: string;
  title: string;
  deadline: string;
  teacherName: string; // Mocked for display
  description: string;
}

export default function StudentDashboard() {
  const searchParams = useSearchParams();
  const schoolName = searchParams.get('school');
  const isOwner = searchParams.get('order') === 'true' || searchParams.get('owner') === 'true'; // handle typo if any
  const userId = searchParams.get('user');

  const [posts, setPosts] = useState<BulletinPost[]>([]);
  const [newPost, setNewPost] = useState('');
  const [showHomework, setShowHomework] = useState(false);
  const [assignments, setAssignments] = useState<Assignment[]>([]);

  useEffect(() => {
    if (schoolName) {
      fetch(`/api/school/bulletin?school=${encodeURIComponent(schoolName)}`)
        .then(res => res.json())
        .then(data => setPosts(Array.isArray(data) ? data : []));
    }

    // Mock fetching assignments - in real app, fetch based on student ID
    setAssignments([
        { id: '1', title: 'Essay on WWII', deadline: '2024-10-15', teacherName: 'Mr. Smith', description: 'Write a 5 page essay on the impact of WWII.' },
        { id: '2', title: 'Math Problem Set 4', deadline: '2024-10-12', teacherName: 'Mrs. Davis', description: 'Complete problems 1-20 in Chapter 4.' },
    ]);

  }, [schoolName]);

  const handlePostSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newPost.trim() || !schoolName) return;

    try {
      const res = await fetch('/api/school/bulletin', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ schoolName, content: newPost, userId }),
      });
      
      if (res.ok) {
        setNewPost('');
        // Refresh posts
        const updated = await fetch(`/api/school/bulletin?school=${encodeURIComponent(schoolName)}`).then(res => res.json());
        setPosts(updated);
      }
    } catch (err) {
      console.error(err);
    }
  };

  if (!schoolName) return <div className="p-8">Please log in via the signup page.</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
      <nav className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <div className="flex-shrink-0 flex items-center">
                 <h1 className="text-xl font-bold text-gray-800">{schoolName} Student Dashboard</h1>
              </div>
            </div>
            <div className="flex items-center">
                <span className="text-gray-500 text-sm mr-4">Welcome, User</span>
            </div>
          </div>
        </div>
      </nav>

      <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
        
        {/* School Bulletin Section */}
        <div className="bg-white shadow rounded-lg mb-8 overflow-hidden">
            <div className="px-4 py-5 sm:px-6 border-b border-gray-200 bg-blue-50">
                <h3 className="text-lg leading-6 font-medium text-blue-900">
                    School Bulletin Board
                </h3>
                <p className="mt-1 max-w-2xl text-sm text-blue-500">
                    Official announcements and news.
                </p>
            </div>
            
            <div className="p-6">
                {isOwner && (
                    <div className="mb-6 bg-yellow-50 p-4 rounded border border-yellow-200">
                        <h4 className="font-bold text-yellow-800 mb-2">Admin Control: Add Announcement</h4>
                        <form onSubmit={handlePostSubmit} className="flex gap-2">
                            <input 
                                type="text" 
                                value={newPost}
                                onChange={(e) => setNewPost(e.target.value)}
                                className="flex-1 border border-gray-300 rounded p-2"
                                placeholder="Type a new announcement..."
                            />
                            <button type="submit" className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700">Post</button>
                        </form>
                    </div>
                )}

                <div className="space-y-4">
                    {posts.length === 0 ? (
                        <p className="text-gray-500 italic">No announcements yet.</p>
                    ) : (
                        posts.map((post: any) => (
                            <div key={post.id} className="border-l-4 border-blue-400 bg-gray-50 p-4 rounded-r shadow-sm">
                                <p className="text-gray-800 font-medium">{post.content}</p>
                                <p className="text-xs text-gray-400 mt-2">{new Date(post.createdAt || Date.now()).toLocaleDateString()}</p>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>

        {/* Homework Button & Section */}
        <div className="text-center mb-8">
            <button 
                onClick={() => setShowHomework(!showHomework)}
                className="bg-indigo-600 text-white px-8 py-3 rounded-full shadow-lg hover:bg-indigo-700 transition-all transform hover:scale-105 font-bold text-lg flex items-center justify-center gap-2 mx-auto"
            >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6"></path></svg>
                {showHomework ? 'Hide Homework' : 'View My Homework'}
            </button>
        </div>

        {showHomework && (
            <div className="bg-white shadow rounded-lg overflow-hidden animate-slide-up">
                 <div className="px-4 py-5 sm:px-6 border-b border-gray-200">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                        Unified Assignment Tracker
                    </h3>
                </div>
                <ul className="divide-y divide-gray-200">
                    {assignments.map(ass => (
                        <li key={ass.id} className="p-6 hover:bg-gray-50 transition">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h4 className="text-lg font-bold text-gray-900">{ass.title}</h4>
                                    <p className="text-gray-600 mt-1">{ass.description}</p>
                                    <div className="mt-2 text-sm text-indigo-600 font-medium">Set by: {ass.teacherName}</div>
                                </div>
                                <div className="text-right">
                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wide ${new Date(ass.deadline) < new Date() ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}`}>
                                        Due: {new Date(ass.deadline).toLocaleDateString()}
                                    </span>
                                </div>
                            </div>
                        </li>
                    ))}
                </ul>
            </div>
        )}

      </main>
      <style jsx>{`
        @keyframes slide-up {
           0% { opacity: 0; transform: translateY(20px); }
           100% { opacity: 1; transform: translateY(0); }
        }
        .animate-slide-up { animation: slide-up 0.3s ease-out forwards; }
      `}</style>
    </div>
  );
}
