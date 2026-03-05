'use client';

import { Suspense, useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';

interface Submission {
  id: string;
  assignmentId: string;
  studentId: string;
  studentName: string; // From API enrichment
  content: string; 
  submittedAt: string;
  score?: number;
  status: 'submitted' | 'graded';
}

function SubmissionsList() {
    const { id } = useParams();
    const router = useRouter();
    const [submissions, setSubmissions] = useState<Submission[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/api/assignment/${id}/submissions`)
            .then(res => res.json())
            .then(data => setSubmissions(data))
            .catch(err => console.error(err))
            .finally(() => setLoading(false));
    }, [id]);


    const renderContentPreview = (sub: Submission) => {
        try {
            // Attempt to parse JSON
            const data = JSON.parse(sub.content);
            
            if (Array.isArray(data)) {
                // If array of objects with 'role', it's a chat
                if (data.length > 0 && data[0].role) {
                     return (
                        <div className="space-y-2">
                            <span className="font-semibold text-blue-600 block mb-2">Chat Session Log ({data.length} messages)</span>
                            <div className="bg-gray-50 border rounded p-2 max-h-40 overflow-y-auto text-xs space-y-2">
                                {data.map((msg: any, i: number) => (
                                    <div key={i} className={`p-1 rounded ${msg.role === 'user' ? 'bg-blue-50 ml-4' : 'bg-gray-100 mr-4'}`}>
                                        <span className="font-bold capitalize">{msg.role}:</span> {msg.content}
                                    </div>
                                ))}
                            </div>
                        </div>
                     );
                } 
                // Else maybe quiz answers as array (if stored that way, though we use object usually)
                return <span className="text-green-600 font-medium">Data Array Submitted (Length: {data.length})</span>;
            } else if (typeof data === 'object') {
                // Quiz answers object { 1: 0, 2: 1 }
                const keys = Object.keys(data);
                return (
                    <div>
                        <span className="text-green-600 font-medium block mb-1">Quiz Answers</span>
                        <pre className="text-xs bg-gray-100 p-2 rounded">{JSON.stringify(data, null, 2)}</pre>
                    </div>
                );
            }
        } catch (e) {
            // Not JSON, assume plain text (Summary)
        }

        // Plain text summary
        return (
            <div>
                <span className="font-medium text-purple-600 block mb-1">Written Summary</span>
                <p className="text-gray-700 whitespace-pre-wrap bg-white p-3 rounded border border-gray-200 text-sm">
                    {sub.content}
                </p>
            </div>
        );
    };

    if (loading) return <div className="p-8">Loading submissions...</div>;

    return (
        <div className="min-h-screen bg-gray-50 p-8">
            <div className="max-w-4xl mx-auto">
                <button onClick={() => router.back()} className="mb-4 text-indigo-600 hover:text-indigo-800">&larr; Back to Class</button>
                <h1 className="text-2xl font-bold mb-6 text-gray-800">Assignment Submissions</h1>
                
                {submissions.length === 0 ? (
                    <div className="bg-white p-8 rounded-lg shadow text-center text-gray-500">
                        No submissions yet.
                    </div>
                ) : (
                    <div className="bg-white shadow overflow-hidden sm:rounded-md">
                        <ul className="divide-y divide-gray-200">
                            {submissions.map((sub) => (
                                <li key={sub.id} className="px-6 py-4 hover:bg-gray-50">
                                    <div className="flex items-center justify-between">
                                        <div>
                                            <h3 className="text-lg font-medium text-gray-900">{sub.studentName}</h3>
                                            <p className="text-sm text-gray-500">Submitted: {new Date(sub.submittedAt).toLocaleString()}</p>
                                        </div>
                                        <div className="text-right">
                                            {sub.score !== undefined && (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    Score: {sub.score}
                                                </span>
                                            )}
                                        </div>
                                    </div>
                                    <div className="mt-2 text-sm text-gray-600 bg-gray-50 p-3 rounded border">
                                        {renderContentPreview(sub)}
                                    </div>
                                    {/* 
                                      Future: Add modal or expansion to see full chat logs/text 
                                      For now, basic preview is enough.
                                    */}
                                </li>
                            ))}
                        </ul>
                    </div>
                )}
            </div>
        </div>
    );
}

export default function SubmissionsPage() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <SubmissionsList />
        </Suspense>
    )
}
