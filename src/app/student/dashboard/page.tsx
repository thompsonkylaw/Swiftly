'use client';

import { useEffect, useState, Suspense } from 'react';
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

function DashboardContent() {
  const searchParams = useSearchParams();
  const schoolName = searchParams.get('school');
  const isOwner = false; // Students are never owners/admins
  const userId = searchParams.get('user');

  const [posts, setPosts] = useState<BulletinPost[]>([]);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [inviteCode, setInviteCode] = useState('');
  const [showHomework, setShowHomework] = useState(false);

  useEffect(() => {
    if (schoolName) {
      fetch(`/api/school/bulletin?school=${encodeURIComponent(schoolName)}`)
        .then(res => res.json())
        .then(data => setPosts(Array.isArray(data) ? data : []));
    }
    
    if (userId) {
        fetch(`/api/student/assignments?studentId=${encodeURIComponent(userId)}`)
            .then(res => res.json())
            .then(data => {
                if(Array.isArray(data)) {
                     const formatted = data.map((a: any) => ({
                        id: a.id,
                        title: a.title,
                        deadline: a.deadline,
                        teacherName: "Teacher", 
                        description: `Learning Method: ${a.learningMethod}`
                    }));
                    setAssignments(formatted);
                }
            })
            .catch(err => console.error("Failed to fetch assignments", err));
    }
  }, [schoolName, userId]);

  const handleJoinClass = async (e: React.FormEvent) => {
      e.preventDefault();
      if (!inviteCode.trim()) return;
      try {
          const res = await fetch('/api/student/join', {
              method: 'POST',
              headers: {'Content-Type': 'application/json'},
              body: JSON.stringify({ code: inviteCode, studentId: userId })
          });
          const data = await res.json();
          if (data.assignments) {
              // Add new assignments to the list. In a real app we'd fetch all user's assignments.
              // Here we just append for the session.
              const newAssigns = data.assignments.map((a: any) => ({
                  id: a.id,
                  title: a.title,
                  deadline: a.deadline,
                  teacherName: "Teacher", // In real app, fetch teacher name
                  description: `Learning Method: ${a.learningMethod}`
              }));
              setAssignments(prev => [...prev, ...newAssigns]);
              setInviteCode('');
              alert(`Joined class: ${data.class.name}`);
          } else {
              alert("Failed to join class. Invalid code?");
          }
      } catch (err) {
          console.error(err);
          alert("Error joining class");
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
        <div className="bg-white overflow-hidden shadow rounded-lg mb-8">
            <div className="p-6">
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

        {/* Join Class Section */}
        <div className="bg-white shadow rounded-lg mb-8 p-6 text-center">
            <h3 className="text-lg font-bold text-gray-800 mb-4">Join a Class</h3>
            <form onSubmit={handleJoinClass} className="flex justify-center gap-2 max-w-md mx-auto">
                <input 
                    type="text" 
                    value={inviteCode}
                    onChange={(e) => setInviteCode(e.target.value)}
                    placeholder="Enter 6-char Invite Code"
                    className="border border-gray-300 rounded p-2 flex-1 text-center font-mono uppercase tracking-widest"
                    maxLength={6}
                />
                <button type="submit" className="bg-green-600 text-white px-6 py-2 rounded hover:bg-green-700 font-medium">
                    Join
                </button>
            </form>
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
                        <Link href={`/student/assignment/${ass.id}`} key={ass.id}>
                        <li className="p-6 hover:bg-gray-50 transition cursor-pointer">
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
                        </Link>
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

export default function StudentDashboard() {
    return (
        <Suspense fallback={<div className="p-12 text-center text-gray-500">Loading Dashboard...</div>}>
            <DashboardContent />
        </Suspense>
    );
}
