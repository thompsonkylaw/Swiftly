'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function CommandCenter() {
  const router = useRouter();
  const [topic, setTopic] = useState('');
  const [perimeter, setPerimeter] = useState('');
  const [inviteCode, setInviteCode] = useState('');

  const createSession = async () => {
    const res = await fetch('/api/session', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ topic, perimeter }),
    });
    const data = await res.json();
    if (data.active) {
      setInviteCode(data.inviteCode);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-4xl mx-auto bg-white shadow rounded-lg p-6">
        <h1 className="text-2xl font-bold mb-4 text-gray-800">Command Center</h1>
        
        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">Lesson Topic</label>
          <input
            type="text"
            className="w-full border p-2 rounded text-black"
            value={topic}
            onChange={e => setTopic(e.target.value)}
            placeholder="e.g. American Revolution"
          />
        </div>

        <div className="mb-6">
          <label className="block text-sm font-medium text-gray-700 mb-1">
            Digital Perimeter
            <span className="text-xs text-gray-500 ml-2">(Define scope/boundaries for AI)</span>
          </label>
          <textarea
            className="w-full border p-2 rounded text-black h-32"
            value={perimeter}
            onChange={e => setPerimeter(e.target.value)}
            placeholder="The AI should focus on the causes and key battles. Avoid post-war analysis. Verify student understanding of 'No Taxation Without Representation'."
          />
        </div>

        <button
          onClick={createSession}
          className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700"
        >
          Create Session & Generate Code
        </button>

        {inviteCode && (
          <div className="mt-8 p-4 bg-green-50 border border-green-200 rounded">
            <h3 className="text-lg font-medium text-green-900">Session Active!</h3>
            <p className="mt-2 text-green-800">
              Share this invite code with your students:
              <span className="ml-2 font-mono text-2xl font-bold tracking-widest bg-white px-2 py-1 rounded border border-green-300">
                {inviteCode}
              </span>
            </p>
            <div className="mt-4">
              <button
                onClick={() => router.push('/teacher/dashboard')}
                className="text-blue-600 underline"
              >
                Go to Live Dashboard &rarr;
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
