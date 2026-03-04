'use client';

import { useState } from 'react';
import Link from 'next/link';

export default function TeacherDashboard() {
  const [className, setClassName] = useState('');
  const [classes, setClasses] = useState<{ id: string, name: string, inviteCode: string }[]>([]);

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

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Teacher Dashboard</h1>
        
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

