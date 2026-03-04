'use client';
import { useState } from 'react';
import { Session } from '@/lib/types'; // Correctly import type

export default function StudentSession() {
  const [inviteCode, setInviteCode] = useState('');
  const [session, setSession] = useState<Session | null>(null); // Use proper type
  const [messages, setMessages] = useState<{ role: 'user' | 'ai'; text: string }[]>([]);
  const [input, setInput] = useState('');

  const joinSession = async () => {
    const res = await fetch(`/api/session?code=${inviteCode}`);
    const data = await res.json();
    if (data.id) { // Check for valid session object
      setSession(data);
      setMessages([{ role: 'ai', text: `Welcome! I'm your AI tutor for today's lesson: "${data.perimeter}". Let's get started. Ask me anything about the material.` }]);
    } else {
      alert('Invalid or inactive session code.');
    }
  };

  const sendMessage = async () => {
    if (!input.trim() || !session) return;
    const userMsg = { role: 'user' as const, text: input };
    setMessages(prev => [...prev, userMsg]);
    setInput('');
    
    // Simulate AI response delay
    setTimeout(async () => {
        // In a real app, call /api/chat with context
        const responses = [
            `That is an excellent inquiry regarding ${session.perimeter}. According to the uploaded syllabus, the key factors include historical context and primary source analysis.`,
            `To answer your question about "${input.substring(0, 20)}...", we must look at the fundamental principles outlined in the course material. What do you think is the most critical element?`,
            `Based on the validated curriculum, the answer is multi-faceted. Consider the short-term impacts versus the long-term consequences.`,
            `The textbook defines this concept clearly. It states that understanding ${session.perimeter} requires analyzing the underlying causes.`,
            `Interesting perspective. If we apply the core theories from this week's lesson, how does that change your conclusion?`,
        ];
        // Pick a response based on input length to be deterministic but varied
        const randomResponse = responses[input.length % responses.length];

        const aiMsg = { role: 'ai' as const, text: randomResponse };
        setMessages(prev => [...prev, aiMsg]);
    }, 1000);
  };

  if (!session) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen bg-gray-50 p-4">
        <h1 className="text-3xl font-bold mb-8 text-gray-800">Student Access</h1>
        <div className="w-full max-w-sm bg-white p-6 rounded-lg shadow-md">
            <input
            type="text"
            placeholder="ENTER INVITE CODE"
            className="w-full border-2 border-gray-300 p-3 rounded mb-4 text-center text-xl font-mono uppercase tracking-widest focus:border-indigo-500 focus:outline-none"
            value={inviteCode}
            onChange={e => setInviteCode(e.target.value.toUpperCase())}
            />
            <button
            onClick={joinSession}
            className="w-full bg-green-600 text-white px-6 py-3 rounded font-semibold hover:bg-green-700 transition-colors"
            >
            Join Session
            </button>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-screen bg-white">
      <header className="bg-indigo-600 text-white p-4 shadow flex justify-between items-center">
        <h2 className="text-lg font-semibold truncate max-w-lg">Active Session: {session.perimeter}</h2>
        <span className="text-xs bg-indigo-800 px-2 py-1 rounded">STUDENT VIEW</span>
      </header>
      
      <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50">
        {messages.map((msg, idx) => (
          <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
            <div className={`max-w-xs md:max-w-md p-3 rounded-lg shadow-sm ${msg.role === 'user' ? 'bg-blue-600 text-white rounded-br-none' : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'}`}>
              {msg.text}
            </div>
          </div>
        ))}
      </div>

      <div className="p-4 border-t bg-white">
        <div className="flex space-x-2">
          <input
            type="text"
            className="flex-1 border p-2 rounded text-black focus:ring-2 focus:ring-indigo-500 outline-none"
            placeholder="Type your answer or question..."
            value={input}
            onChange={e => setInput(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && sendMessage()}
          />
          <button
            onClick={sendMessage}
            className="bg-indigo-600 text-white px-6 py-2 rounded hover:bg-indigo-700 transition-colors"
          >
            Send
          </button>
        </div>
      </div>
    </div>
  );
}

