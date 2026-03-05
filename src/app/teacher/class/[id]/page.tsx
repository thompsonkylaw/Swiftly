'use client';

import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Assignment, LearningMethod } from '@/lib/types';

export default function ClassManagement() {
  const { id } = useParams();
  const [assignments, setAssignments] = useState<Assignment[]>([]);
  const [newAssignment, setNewAssignment] = useState({
    title: '',
    learningMethod: 'ai_tutor' as LearningMethod,
    deadline: '',
    fileName: '',
  });

  const [isScanning, setIsScanning] = useState(false);

  useEffect(() => {
    fetch(`/api/class/${id}/assignment`)
      .then(res => res.json())
      .then(data => setAssignments(data));
  }, [id]);

  const handleCreateAssignment = async () => {
    setIsScanning(true);
    
    // Simulate AI Scan delay
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    // Generate Mock AI Content based on method
    let aiContent = "";
    const { title, learningMethod, fileName } = newAssignment;
    
    if (learningMethod === 'ai_tutor') {
        aiContent = `Welcome to your AI Tutor session for "${title}". Based on ${fileName}, I'm ready to help you understand the core concepts. What would you like to start with?`;
    } else if (learningMethod === 'quiz_mode') {
        aiContent = JSON.stringify([
            { id: 1, question: `Based on ${title}, what is the primary outcome?`, options: ["Outcome A", "Outcome B", "Outcome C"], answer: 0 },
            { id: 2, question: `In ${fileName}, which factor is most critical?`, options: ["Factor X", "Factor Y", "Factor Z"], answer: 1 }
        ]);
    } else if (learningMethod === 'summary_check') {
        aiContent = `Please provide a concise summary of ${fileName} regarding "${title}". Focus on the main arguments and conclusion.`;
    } else if (learningMethod === 'socratic_dialogue') {
        aiContent = `I've analyzed ${fileName}. Let's discuss "${title}". To begin, what creates the central conflict in this piece?`;
    }

    const payload = { ...newAssignment, aiContent };

    const res = await fetch(`/api/class/${id}/assignment`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload),
    });
    
    setIsScanning(false);

    if (res.ok) {
      const created = await res.json();
      setAssignments([...assignments, created]);
      setNewAssignment({ title: '', learningMethod: 'ai_tutor', deadline: '', fileName: '' });
      alert("Assignment created and AI content generated successfully!");
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-8">
      <div className="max-w-5xl mx-auto">
        <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Class Assignments</h1>
            <Link 
                href="/teacher/command-center" 
                className="flex items-center text-indigo-600 hover:text-indigo-800 font-medium transition-colors"
            >
                <svg className="w-5 h-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18"></path></svg>
                Back to Dashboard
            </Link>
        </div>
        
        {/* Create Assignment Form */}
        <div className="bg-white p-6 rounded-lg shadow-md mb-8">
          <h2 className="text-xl font-semibold mb-4 text-gray-700">Add New Assignment</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">Assignment Title</label>
              <input 
                type="text" 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2 text-black"
                value={newAssignment.title}
                onChange={e => setNewAssignment({...newAssignment, title: e.target.value})}
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Upload Work File (AI Scan)</label>
              <div className={`mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-dashed rounded-md cursor-pointer hover:bg-gray-50 ${isScanning ? 'border-indigo-500 bg-indigo-50 animate-pulse' : 'border-gray-300'}`}>
                <div className="space-y-1 text-center">
                  {isScanning ? (
                      <div className="text-indigo-600 font-bold">Scanning Document...</div>
                  ) : (
                    <>
                    <svg className="mx-auto h-8 w-8 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48">
                      <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth={2} strokeLinecap="round" strokeLinejoin="round" />
                    </svg>
                    <div className="text-sm text-gray-600">
                      <label className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500">
                        <span>Upload a file</span>
                        <input type="file" className="sr-only" onChange={e => setNewAssignment({...newAssignment, fileName: e.target.files?.[0]?.name || ''})} />
                      </label>
                    </div>
                    </>
                  )}
                  {newAssignment.fileName && !isScanning && <p className="text-xs text-green-600 font-bold">Selected: {newAssignment.fileName}</p>}
                </div>
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Learning Method</label>
              <select
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2 text-black"
                value={newAssignment.learningMethod}
                onChange={e => setNewAssignment({...newAssignment, learningMethod: e.target.value as LearningMethod})}
              >
                <option value="ai_tutor">AI Tutor (Chat)</option>
                <option value="quiz_mode">Quiz Mode</option>
                <option value="summary_check">Summary Check</option>
                <option value="socratic_dialogue">Socratic Dialogue</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">Deadline</label>
              <input 
                type="datetime-local" 
                className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 border p-2 text-black"
                value={newAssignment.deadline}
                onChange={e => setNewAssignment({...newAssignment, deadline: e.target.value})}
              />
            </div>
          </div>
          <button 
            onClick={handleCreateAssignment}
            disabled={isScanning || !newAssignment.title}
            className={`mt-4 w-full text-white py-2 px-4 rounded transition ${isScanning ? 'bg-indigo-400 cursor-not-allowed' : 'bg-indigo-600 hover:bg-indigo-700'}`}
          >
            {isScanning ? 'AI Scanning...' : 'Assign Work'}
          </button>
        </div>

        {/* Existing Assignments */}
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-700">Active Assignments</h2>
          {assignments.map(a => (
            <div key={a.id} className="bg-white p-4 rounded-lg shadow border border-l-4 border-indigo-500 flex justify-between items-center">
              <div>
                <h3 className="font-bold text-lg text-gray-800">{a.title}</h3>
                <p className="text-sm text-gray-500">Method: <span className="font-medium capitalize">{a.learningMethod.replace('_', ' ')}</span></p>
                <p className="text-sm text-gray-500">File: {a.fileName || 'No file uploaded'}</p>
                {a.aiContent && <span className="text-xs bg-purple-100 text-purple-800 px-2 py-0.5 rounded-full mt-1 inline-block">AI Generated</span>}
              </div>
              <div className="text-right flex flex-col items-end gap-2">
                 <p className="text-sm font-semibold text-red-600">Due: {new Date(a.deadline).toLocaleDateString()}</p>
                 <Link 
                    href={`/teacher/assignment/${a.id}/submissions`}
                    className="text-xs bg-indigo-100 text-indigo-700 px-3 py-1 rounded-full hover:bg-indigo-200 transition"
                 >
                    View Submissions
                 </Link>
                 <span className="text-xs text-gray-400">ID: {a.id}</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
