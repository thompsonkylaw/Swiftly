'use client';

import { useEffect, useState } from 'react';
import { Class } from '@/lib/types';
import Link from 'next/link';

export default function GlobalDashboard() {
  const [classes, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    // Poll for class updates
    const interval = setInterval(async () => {
      const res = await fetch('/api/class');
      const data = await res.json();
      if (Array.isArray(data)) {
          setClasses(data);
      }
    }, 2000); // 2 seconds poll

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <h1 className="text-3xl font-bold mb-8 text-gray-800">Teacher Overview</h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {classes.map(cls => (
            <div key={cls.id} className="bg-white p-6 rounded-lg shadow-sm border-l-4 border-indigo-500">
                <div className="flex justify-between items-start mb-4">
                    <h3 className="text-lg font-bold text-gray-900 truncate">
                        {cls.name}
                    </h3>
                    <span className="bg-indigo-100 text-indigo-800 text-xs px-2 py-1 rounded-full uppercase tracking-wide font-semibold">Active</span>
                </div>
                <div className="text-gray-600 text-sm mb-4 space-y-1">
                    <p>Invite Code: <span className="font-mono font-bold bg-gray-100 px-1 rounded">{cls.inviteCode}</span></p>
                    <p>Enrolled Students: {Math.floor(Math.random() * 30) + 1} (Mock)</p>
                </div>
                
                <Link 
                    href={`/teacher/class/${cls.id}`}
                    className="block w-full text-center mt-2 border border-blue-200 text-blue-600 py-2 rounded hover:bg-blue-50 text-sm font-medium transition-colors"
                >
                    Manage Class
                </Link>
            </div>
        ))}
        
        {classes.length === 0 && (
            <div className="col-span-full text-center py-12 bg-white rounded-lg border border-dashed border-gray-300">
                <p className="text-gray-500">No active classes found.</p>
                <a href="/teacher/command-center" className="text-blue-600 hover:underline mt-2 inline-block">
                    Create a Class &rarr;
                </a>
            </div>
        )}
      </div>
    </div>
  );
}


