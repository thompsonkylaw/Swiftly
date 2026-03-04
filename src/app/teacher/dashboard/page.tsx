'use client';

import { useEffect, useState } from 'react';
import { Session } from '@/lib/types';

export default function TeacherDashboard() {
  const [sessions, setSessions] = useState<Session[]>([]);

  useEffect(() => {
    // Poll for session updates
    const interval = setInterval(async () => {
      const res = await fetch('/api/session');
      const data = await res.json();
      if (Array.isArray(data)) {
          setSessions(data);
      }
    }, 2000); // 2 seconds poll

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Teacher Live Dashboard</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {sessions.map(session => (
            <div key={session.id} className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-green-500">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-900 truncate" title={session.perimeter}>
                        {session.perimeter || 'Lesson'}
                    </h3>
                    <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded-full uppercase tracking-wide font-semibold">Live</span>
                </div>
                <div className="text-gray-600 text-sm mb-4 space-y-1">
                    <p>Invite Code: <span className="font-mono font-bold bg-gray-100 px-1 rounded">{session.inviteCode}</span></p>
                    <p>Active Students: {Math.floor(Math.random() * 30) + 1} (Mock)</p>
                </div>
                
                <div className="mb-4">
                    <div className="flex justify-between text-xs mb-1 text-gray-500">
                        <span>Class Progress</span>
                        <span>{Math.floor(Math.random() * 100)}%</span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                        <div className="bg-green-500 h-2 rounded-full" style={{ width: `${Math.floor(Math.random() * 100)}%` }}></div>
                    </div>
                </div>

                <button className="w-full mt-2 border border-blue-200 text-blue-600 py-2 rounded hover:bg-blue-50 text-sm font-medium transition-colors">
                    Monitor Session
                </button>
            </div>
        ))}
        
        {sessions.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">No active sessions found.</p>
                <a href="/teacher/command-center" className="text-blue-600 hover:underline mt-2 inline-block">
                    Go to Command Center to start one &rarr;
                </a>
            </div>
        )}
      </div>
    </div>
  );
}

