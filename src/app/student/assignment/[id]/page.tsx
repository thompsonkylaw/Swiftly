'use client';

import { useState, useEffect } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { Assignment } from '@/lib/types';

export default function AssignmentDetail() {
  const { id } = useParams();
  const router = useRouter();
  const [assignment, setAssignment] = useState<Assignment | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Interaction State
  const [chatInput, setChatInput] = useState('');
  const [chatHistory, setChatHistory] = useState<{role: 'user'|'ai', content: string}[]>([]);
  const [quizAnswers, setQuizAnswers] = useState<Record<number, number>>({});
  const [quizScore, setQuizScore] = useState<number | null>(null);

  useEffect(() => {
    fetch(`/api/assignment/${id}`)
      .then(res => {
          if(!res.ok) throw new Error("Not found");
          return res.json();
      })
      .then(data => {
          setAssignment(data);
          // Initialize chat if applicable
          if ((data.learningMethod === 'ai_tutor' || data.learningMethod === 'socratic_dialogue') && data.aiContent) {
              setChatHistory([{ role: 'ai', content: data.aiContent }]);
          }
      })
      .catch(err => {
          console.error(err);
          // Redirect or show error
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleChatSend = () => {
      if(!chatInput.trim()) return;
      const userMsg = chatInput;
      setChatHistory(prev => [...prev, { role: 'user', content: userMsg }]);
      setChatInput('');
      
      // Mock AI Reply
      setTimeout(() => {
          let reply = "That's an interesting point! Tell me more based on the document.";
          if (assignment?.learningMethod === 'socratic_dialogue') {
              reply = "Why do you think that is the case? How does the text support your view?";
          }
          setChatHistory(prev => [...prev, { role: 'ai', content: reply }]);
      }, 1000);
  };

  const handleQuizSubmit = (questions: any[]) => {
      let score = 0;
      questions.forEach(q => {
          if (quizAnswers[q.id] === q.answer) score++;
      });
      setQuizScore(score);
  };

  if (loading) return <div className="p-12 text-center text-gray-500">Loading Assignment...</div>;
  if (!assignment) return <div className="p-12 text-center text-red-500">Assignment not found.</div>;

  return (
    <div className="min-h-screen bg-gray-50 font-sans">
        {/* Navigation */}
        <nav className="bg-white shadow">
            <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="text-gray-500 hover:text-gray-700">
                        &larr; Back
                    </button>
                    <h1 className="text-xl font-bold text-gray-800">{assignment.title}</h1>
                </div>
                <div className="text-sm text-gray-500">
                    Method: <span className="font-semibold capitalize text-indigo-600">{assignment.learningMethod.replace('_', ' ')}</span>
                </div>
            </div>
        </nav>

        <main className="max-w-5xl mx-auto py-8 px-4">
            <div className="bg-white shadow rounded-lg overflow-hidden min-h-[600px] flex flex-col">
                {/* Header */}
                <div className="bg-indigo-50 px-6 py-4 border-b border-indigo-100">
                    <h2 className="text-lg font-medium text-indigo-900">
                        Interactive Learning Session
                    </h2>
                    {assignment.fileName && (
                        <p className="text-sm text-indigo-500 mt-1">Reference Material: {assignment.fileName}</p>
                    )}
                </div>

                {/* Content Area */}
                <div className="flex-1 p-6 overflow-y-auto">
                    
                    {/* AI Tutor / Socratic Chat Interface */}
                    {(assignment.learningMethod === 'ai_tutor' || assignment.learningMethod === 'socratic_dialogue') && (
                        <div className="flex flex-col h-full">
                            <div className="flex-1 space-y-4 mb-4">
                                {chatHistory.map((msg, idx) => (
                                    <div key={idx} className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}>
                                        <div className={`max-w-[80%] rounded-lg px-4 py-3 ${
                                            msg.role === 'user' 
                                            ? 'bg-indigo-600 text-white' 
                                            : 'bg-gray-100 text-gray-800 border'
                                        }`}>
                                            {msg.content}
                                        </div>
                                    </div>
                                ))}
                            </div>
                            <div className="border-t pt-4 flex gap-2">
                                <input 
                                    type="text" 
                                    className="flex-1 border border-gray-300 rounded-full px-4 py-2 focus:ring-2 focus:ring-indigo-500 focus:outline-none text-black"
                                    placeholder="Type your response..."
                                    value={chatInput}
                                    onChange={e => setChatInput(e.target.value)}
                                    onKeyDown={e => e.key === 'Enter' && handleChatSend()}
                                />
                                <button 
                                    onClick={handleChatSend}
                                    className="bg-indigo-600 text-white rounded-full p-2 hover:bg-indigo-700 w-10 h-10 flex items-center justify-center"
                                >
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"></path></svg>
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Quiz Mode Interface */}
                    {assignment.learningMethod === 'quiz_mode' && (
                        <div className="max-w-2xl mx-auto">
                            {(() => {
                                try {
                                    const questions = typeof assignment.aiContent === 'string' && assignment.aiContent.startsWith('[') 
                                        ? JSON.parse(assignment.aiContent) 
                                        : [];
                                    
                                    if (questions.length === 0) return <p>No quiz generated.</p>;
                                    if (quizScore !== null) {
                                        return (
                                            <div className="text-center py-12">
                                                <h3 className="text-2xl font-bold text-gray-800 mb-2">Quiz Complete!</h3>
                                                <div className="text-6xl font-bold text-indigo-600 mb-4">{Math.round((quizScore / questions.length) * 100)}%</div>
                                                <p className="text-gray-600">You scored {quizScore} out of {questions.length}</p>
                                                <button onClick={() => {setQuizScore(null); setQuizAnswers({})}} className="mt-6 text-indigo-600 font-medium">Retry Quiz</button>
                                            </div>
                                        );
                                    }

                                    return (
                                        <div className="space-y-8">
                                            {questions.map((q: any) => (
                                                <div key={q.id} className="bg-white p-4">
                                                    <h3 className="text-lg font-medium text-gray-900 mb-4">{q.id}. {q.question}</h3>
                                                    <div className="space-y-3">
                                                        {q.options.map((opt: string, idx: number) => (
                                                            <label key={idx} className={`flex items-center p-3 border rounded-lg cursor-pointer hover:bg-gray-50 ${quizAnswers[q.id] === idx ? 'border-indigo-500 bg-indigo-50' : 'border-gray-200'}`}>
                                                                <input 
                                                                    type="radio" 
                                                                    name={`q-${q.id}`} 
                                                                    className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300"
                                                                    checked={quizAnswers[q.id] === idx}
                                                                    onChange={() => setQuizAnswers({...quizAnswers, [q.id]: idx})}
                                                                />
                                                                <span className="ml-3 block text-sm font-medium text-gray-700">{opt}</span>
                                                            </label>
                                                        ))}
                                                    </div>
                                                </div>
                                            ))}
                                            <button 
                                                onClick={() => handleQuizSubmit(questions)}
                                                className="w-full bg-indigo-600 text-white py-3 rounded-lg font-bold hover:bg-indigo-700 transition shadow-lg"
                                            >
                                                Submit Answers
                                            </button>
                                        </div>
                                    );
                                } catch (e) {
                                    return <p className="text-red-500">Error loading quiz content.</p>;
                                }
                            })()}
                        </div>
                    )}

                    {/* Summary Check Interface */}
                    {assignment.learningMethod === 'summary_check' && (
                        <div className="max-w-3xl mx-auto">
                            <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
                                <div className="flex">
                                    <div className="flex-shrink-0">
                                        <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" /></svg>
                                    </div>
                                    <div className="ml-3">
                                        <p className="text-sm text-yellow-700">
                                            {assignment.aiContent}
                                        </p>
                                    </div>
                                </div>
                            </div>
                            <textarea 
                                className="w-full h-64 p-4 border border-gray-300 rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-transparent text-black"
                                placeholder="Start writing your summary here..."
                            ></textarea>
                            <button className="mt-4 bg-indigo-600 text-white px-6 py-2 rounded font-medium hover:bg-indigo-700">
                                Submit Summary
                            </button>
                        </div>
                    )}

                </div>
            </div>
        </main>
    </div>
  );
}
