'use client';
import { useState } from 'react';
import { Class, Assignment } from '@/lib/types';
import Link from 'next/link';

export default function StudentDashboard() {
  const [inviteCode, setInviteCode] = useState('');
  const [joinedClass, setJoinedClass] = useState<Class | null>(null);
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [error, setError] = useState('');

  const handleJoin = async () => {
    setError('');
    const res = await fetch('/api/student/join', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code: inviteCode }),
    });
    
    if (res.ok) {
      const data = await res.json();
      setJoinedClass(data.class);
      setAssignments(data.assignments);
    } else {
      setError('Invalid invite code');
    }
  };

  if (!joinedClass) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full bg-white shadow-lg rounded-xl p-8">
          <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Join a Class</h2>
          <input
            type="text"
            className="w-full border-2 border-gray-300 rounded-lg p-3 text-center text-xl tracking-widest uppercase mb-4 focus:border-indigo-500 focus:outline-none text-black"
            placeholder="ENTER CODE"
            value={inviteCode}
            onChange={e => setInviteCode(e.target.value.toUpperCase())}
          />
          <button 
            onClick={handleJoin}
            className="w-full bg-indigo-600 text-white font-bold py-3 rounded-lg hover:bg-indigo-700 transition"
          >
            Join Class
          </button>
          {error && <p className="text-red-500 text-center mt-4 text-sm font-medium">{error}</p>}
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <header className="mb-8 flex justify-between items-center">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{joinedClass.name}</h1>
          <p className="text-gray-500">Student Dashboard</p>
        </div>
        <div className="bg-white px-4 py-2 rounded shadow-sm text-sm text-gray-600 font-medium">
          Teacher ID: {joinedClass.teacherId}
        </div>
      </header>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-2 space-y-6">
          <h2 className="text-xl font-semibold text-gray-800">Your Assignments</h2>
          {assignments.map(a => (
            <div key={a.id} className="bg-white rounded-lg shadow p-6 flex flex-col sm:flex-row justify-between items-start sm:items-center border-l-4 border-yellow-400">
              <div className="mb-4 sm:mb-0">
                <h3 className="text-lg font-bold text-gray-800">{a.title}</h3>
                <p className="text-sm text-gray-500 mb-1">Method: <span className="font-medium text-indigo-600 capitalize">{a.learningMethod.replace('_', ' ')}</span></p>
                {a.fileName && (
                    <div className="flex items-center text-xs text-gray-400">
                        <svg className="w-4 h-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                        {a.fileName}
                    </div>
                )}
              </div>
              <div className="flex flex-col items-end gap-2">
                <span className="text-xs font-semibold text-red-500 bg-red-50 px-2 py-1 rounded">Due: {new Date(a.deadline).toLocaleDateString()}</span>
                <Link 
                  href={`/student/assignment/${a.id}`}
                  className="bg-indigo-600 text-white px-4 py-2 rounded text-sm hover:bg-indigo-700 transition"
                >
                  Start Work &rarr;
                </Link>
              </div>
            </div>
          ))}
           {assignments.length === 0 && (
            <div className="text-center py-12 bg-white rounded-lg border border-dashed text-gray-400">
              No assignments pending. Nice work!
            </div>
           )}
        </div>

        <div className="space-y-6">
           <div className="bg-white rounded-lg shadow p-6">
              <h3 className="text-lg font-bold text-gray-800 mb-4">Class Updates</h3>
              <p className="text-sm text-gray-500">No new announcements from your teacher.</p>
           </div>
        </div>
      </div>
    </div>
  );
}


