'use client';
import { useState, useEffect } from 'react';
import { useParams } from 'next/navigation';
import { Assignment } from '@/lib/types';

export default function AssignmentView() {
  const { id } = useParams();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [messages, setMessages] = useState<{role: 'user' | 'ai', text: string}[]>([]);
  const [input, setInput] = useState('');

  // Simulating fetch assignment details (mock)
  useEffect(() => {
    // In real app, fetch from API. We'll use a mock for specific ID or minimal data
    // For now, let's just create a dummy object based on params because store is server-side only in this scaffold 
    // without an API route for single assignment get (left as exercise or we can add it).
    // Let's assume we can fetch it.
    // For scaffolding speed, I'll mock it if fetch fails.
    setAssignment({
        id: id as string,
        classId: '1',
        title: 'Mock Assignment',
        learningMethod: 'ai_tutor',
        deadline: new Date().toISOString(),
        fileName: 'chapter1.pdf',
        createdAt: new Date().toISOString()
    });
    
    setMessages([{role: 'ai', text: "I've analyzed the file you uploaded. I'm ready to help you complete this assignment using the AI Tutor method. What would you like to start with?"}]);
  }, [id]);

  const sendMessage = () => {
    if (!input.trim()) return;
    setMessages([...messages, {role: 'user', text: input}]);
    setInput('');
    setTimeout(() => {
        setMessages(prev => [...prev, {role: 'ai', text: "That's a valid point based on the reading. Can you support it with a quote from the text?"}]);
    }, 1000);
  };

  if (!assignment) return <div>Loading...</div>;

  return (
    <div className="flex h-screen bg-gray-100">
       {/* Left Panel: Content/File Viewer */}
       <div className="w-1/2 p-4 bg-gray-200 border-r border-gray-300 hidden md:block">
          <div className="bg-white h-full rounded shadow-lg p-8 overflow-y-auto">
             <h2 className="text-2xl font-serif font-bold text-gray-800 mb-4">{assignment.title}</h2>
             <div className="mb-6 p-4 bg-blue-50 text-blue-800 rounded border border-blue-200">
                <p className="font-bold mb-1">Attached Key File:</p>
                <p className="text-sm underline cursor-pointer">{assignment.fileName || 'learning_material.pdf'}</p>
             </div>
             
             <div className="prose max-w-none text-gray-600">
                <p>[Preview of file content would appear here]</p>
                <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.</p>
                <p>... (Remaining 45 pages) ...</p>
             </div>
          </div>
       </div>

       {/* Right Panel: Work Interface */}
       <div className="w-full md:w-1/2 flex flex-col">
          <header className="bg-white p-4 shadow-sm z-10 flex justify-between items-center">
             <h1 className="font-bold text-gray-800">Workspace</h1>
             <span className="text-xs bg-indigo-100 text-indigo-800 px-2 py-1 rounded-full uppercase font-bold">
                {assignment.learningMethod.replace('_', ' ')}
             </span>
          </header>

          <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
             {messages.map((m, i) => (
                <div key={i} className={`flex ${m.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                   <div className={`max-w-md p-3 rounded-lg ${m.role === 'user' ? 'bg-indigo-600 text-white' : 'bg-white shadow border border-gray-200 text-gray-800'}`}>
                      {m.text}
                   </div>
                </div>
             ))}
          </div>

          <div className="p-4 bg-white border-t border-gray-200">
             <div className="flex gap-2">
                <input 
                  type="text" 
                  className="flex-1 border border-gray-300 rounded-lg p-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-black"
                  placeholder="Type your answer..."
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && sendMessage()}
                />
                <button 
                  onClick={sendMessage}
                  className="bg-indigo-600 text-white px-4 py-2 rounded-lg hover:bg-indigo-700"
                >
                    Submit
                </button>
             </div>
          </div>
       </div>
    </div>
  );
}
