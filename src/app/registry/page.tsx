'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';

export default function RegistryPage() {
  const router = useRouter();
  const [schoolName, setSchoolName] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [status, setStatus] = useState<'idle' | 'validating' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('validating');
    setMessage('');

    try {
      const formData = new FormData();
      formData.append('schoolName', schoolName);
      if (file) formData.append('syllabus', file);

      const res = await fetch('/api/registry', {
        method: 'POST',
        body: formData,
      });

      const data = await res.json();

      if (res.ok) {
        setStatus('success');
        setMessage(`Success! ${data.school.name} verified and syllabus uploaded.`);
        // Redirect to Command Center (Lesson Creation) after a short delay
        setTimeout(() => {
          router.push('/teacher/command-center');
        }, 1500);
      } else {
        setStatus('error');
        setMessage(data.error || 'Validation failed');
      }
    } catch (error) {
      console.error(error);
      setStatus('error');
      setMessage('An error occurred during verification.');
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 to-blue-100 flex flex-col justify-center py-12 sm:px-6 lg:px-8">
      <div className="sm:mx-auto sm:w-full sm:max-w-md">
        <h2 className="mt-6 text-center text-4xl font-extrabold text-blue-900 tracking-tight">
          School Verification
        </h2>
        <p className="mt-2 text-center text-sm text-gray-600 max-w-sm mx-auto">
          Securely validate your institution's credentials and establish the digital curriculum baseline.
        </p>
      </div>

      <div className="mt-8 sm:mx-auto sm:w-full sm:max-w-lg">
        <div className="bg-white py-8 px-10 shadow-xl rounded-2xl border border-gray-100">
          <form className="space-y-6" onSubmit={handleSubmit}>
            <div>
              <label htmlFor="schoolName" className="block text-sm font-semibold text-gray-700 mb-1">
                Institution Name
              </label>
              <div className="relative rounded-md shadow-sm">
                <input
                  id="schoolName"
                  name="schoolName"
                  type="text"
                  required
                  value={schoolName}
                  onChange={(e) => setSchoolName(e.target.value)}
                  className="block w-full px-4 py-3 border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm text-gray-900 placeholder-gray-400 border shadow-sm transition-colors"
                  placeholder="e.g. Lincoln High School"
                />
              </div>
            </div>

            <div>
              <label htmlFor="syllabus" className="block text-sm font-semibold text-gray-700 mb-1">
                Official Syllabus / Textbook
              </label>
              <div className="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 border-dashed rounded-lg hover:bg-gray-50 transition-colors cursor-pointer group">
                <div className="space-y-1 text-center">
                  <svg
                    className="mx-auto h-12 w-12 text-gray-400 group-hover:text-indigo-500 transition-colors"
                    stroke="currentColor"
                    fill="none"
                    viewBox="0 0 48 48"
                    aria-hidden="true"
                  >
                    <path
                      d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02"
                      strokeWidth={2}
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                  <div className="flex text-sm text-gray-600 justify-center">
                    <label
                      htmlFor="syllabus"
                      className="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 focus-within:outline-none focus-within:ring-2 focus-within:ring-offset-2 focus-within:ring-indigo-500"
                    >
                      <span>Upload a file</span>
                      <input
                        id="syllabus"
                        name="syllabus"
                        type="file"
                        accept=".pdf,.txt"
                        className="sr-only"
                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                      />
                    </label>
                    <p className="pl-1">or drag and drop</p>
                  </div>
                  <p className="text-xs text-gray-500">PDF, TXT up to 10MB</p>
                  {file && (
                    <p className="text-sm text-green-600 font-medium mt-2">
                        Selected: {file.name}
                    </p>
                  )}
                </div>
              </div>
            </div>

            <div>
              <button
                type="submit"
                disabled={status === 'validating' || status === 'success'}
                className={`w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white transition-all transform hover:scale-[1.02] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 ${
                    status === 'success' 
                    ? 'bg-green-600 hover:bg-green-700 cursor-default' 
                    : 'bg-indigo-600 hover:bg-indigo-700 disabled:bg-indigo-300 disabled:cursor-not-allowed'
                }`}
              >
                {status === 'validating' ? (
                    <span className="flex items-center">
                        <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                            <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        Validating Credentials...
                    </span>
                ) : status === 'success' ? (
                    'Verified! Redirecting...' 
                ) : (
                    'Validate & Upload Curriculum'
                )}
              </button>
            </div>
          </form>

          {status === 'error' && (
            <div className="mt-4 p-4 bg-red-50 border border-red-100 rounded-lg flex items-start">
               <svg className="h-5 w-5 text-red-400 mt-0.5 mr-2" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
              <div className="text-sm text-red-700">{message}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
