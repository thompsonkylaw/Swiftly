'use client';

import { useEffect, useState } from 'react';
import Link from 'next/link';
import { Class } from '@/lib/types';

export default function Dashboard() {
  const [classes, setClasses] = useState<Class[]>([]);

  useEffect(() => {
    async function fetchClasses() {
      try {
        const res = await fetch('/api/class');
        const data = await res.json();
        if (Array.isArray(data)) setClasses(data);
      } catch (err) {
        console.error("Failed to fetch classes", err);
      }
    }
    fetchClasses();
  }, []);

  return (
    <div className="min-h-screen bg-white text-gray-900 font-sans overflow-hidden relative">
      {/* Background Gradients */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden -z-10 pointer-events-none">
        <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-purple-200/50 rounded-full blur-3xl opacity-60 animate-pulse"></div>
        <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] bg-blue-200/50 rounded-full blur-3xl opacity-60"></div>
        <div className="absolute bottom-[-10%] left-[20%] w-[35%] h-[35%] bg-yellow-100/50 rounded-full blur-3xl opacity-60"></div>
      </div>

      {/* Navigation */}
      <nav className="flex items-center justify-between px-8 py-6 max-w-7xl mx-auto z-50 relative">
        <div className="flex items-center gap-12">
          <Link href="/teacher/dashboard">
            {/* User instructions: Save your cropped logo image to public/logo.png */}
            <img src="/logo.png" alt="Swiftly" className="h-16 w-auto object-contain" />
          </Link>

          <div className="hidden md:flex items-center gap-8 text-sm font-medium text-gray-600">
            <Link href="#" className="hover:text-gray-900 transition-colors">Products</Link>
            <Link href="#" className="hover:text-gray-900 transition-colors">Solutions</Link>
            <Link href="#" className="hover:text-gray-900 transition-colors">Impact Stories</Link>
            <Link href="#" className="hover:text-gray-900 transition-colors">Learn</Link>
            <Link href="#" className="hover:text-gray-900 transition-colors">Pricing</Link>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <Link href="/auth/signup" className="text-sm font-medium text-gray-600 hover:text-gray-900">Sign out</Link>
          <Link 
            href="/teacher/command-center" 
            className="bg-indigo-600 text-white px-5 py-2.5 rounded-lg text-sm font-medium hover:bg-indigo-500 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
          >
            <span>Command Center</span>
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 10V3L4 14h7v7l9-11h-7z"></path></svg>
          </Link>
        </div>
      </nav>

      {/* Main Content Area */}
      <main className="relative max-w-7xl mx-auto px-6 pt-16 pb-24 flex flex-col items-center justify-center min-h-[80vh]">
        
        {/* Floating Widgets Container - Absolute positioned elements around the center */}
        <div className="absolute inset-0 pointer-events-none hidden lg:block">
            {/* Top Left - Rubric Card */}
            <div className="absolute top-[10%] left-[5%] bg-white p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 w-64 rotate-[-6deg] animate-float-slow">
                <div className="flex items-center gap-3 mb-3">
                    <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center text-purple-600">
                        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2"></path></svg>
                    </div>
                    <span className="font-semibold text-gray-800 text-sm">Rubric</span>
                </div>
                <div className="space-y-2">
                    <div className="h-2 bg-gray-100 rounded w-3/4"></div>
                    <div className="h-2 bg-gray-100 rounded w-1/2"></div>
                    <div className="flex gap-1 mt-2">
                        <div className="h-6 w-6 bg-green-100 rounded"></div>
                        <div className="h-6 w-6 bg-green-100 rounded"></div>
                        <div className="h-6 w-6 bg-green-100 rounded"></div>
                    </div>
                </div>
            </div>

            {/* Bottom Left - Assignments Widget */}
             <div className="absolute bottom-[20%] left-[8%] bg-white p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 w-56 rotate-[3deg] animate-float-medium">
                <div className="text-xs font-semibold text-gray-500 mb-2 uppercase tracking-wider">Assignments</div>
                <ul className="space-y-3">
                    <li className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center text-white bg-blue-500 border-transparent text-[10px]">✓</div>
                        <span className="text-sm text-gray-700">Learning experience</span>
                    </li>
                    <li className="flex items-center gap-2">
                         <div className="w-4 h-4 rounded border border-gray-300 flex items-center justify-center text-white bg-blue-500 border-transparent text-[10px]">✓</div>
                        <span className="text-sm text-gray-700">Quick task</span>
                    </li>
                    <li className="flex items-center gap-2">
                        <div className="w-4 h-4 rounded border border-gray-300"></div>
                        <span className="text-sm text-gray-400">Assessment</span>
                    </li>
                </ul>
            </div>

            {/* Top Right - Analytics Graph */}
            <div className="absolute top-[15%] right-[5%] bg-white p-5 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 w-72 rotate-[4deg] animate-float-fast">
                <div className="flex justify-between items-center mb-4">
                     <span className="font-semibold text-gray-800 text-xs">Staff Engagement</span>
                     <div className="h-1.5 w-1.5 bg-green-500 rounded-full"></div>
                </div>
                <div className="h-24 w-full flex items-end gap-2 justify-between px-2">
                    <div className="w-full bg-blue-50 h-[40%] rounded-t-sm relative group"><div className="absolute bottom-0 w-full bg-blue-400 h-0 group-hover:h-full transition-all duration-500 h-[60%] rounded-t-sm"></div></div>
                    <div className="w-full bg-blue-50 h-[70%] rounded-t-sm relative group"><div className="absolute bottom-0 w-full bg-blue-400 h-0 group-hover:h-full transition-all duration-500 h-[30%] rounded-t-sm"></div></div>
                    <div className="w-full bg-blue-50 h-[50%] rounded-t-sm relative group"><div className="absolute bottom-0 w-full bg-blue-400 h-0 group-hover:h-full transition-all duration-500 h-[80%] rounded-t-sm"></div></div>
                     <div className="w-full bg-blue-50 h-[80%] rounded-t-sm relative group"><div className="absolute bottom-0 w-full bg-blue-400 h-0 group-hover:h-full transition-all duration-500 h-[40%] rounded-t-sm"></div></div>
                </div>
            </div>

             {/* Bottom Right - Chat/Message */}
            <div className="absolute bottom-[15%] right-[10%] bg-white p-4 rounded-2xl shadow-[0_8px_30px_rgb(0,0,0,0.06)] border border-gray-100 w-80 rotate-[-2deg] animate-float-medium">
                <div className="flex items-start gap-3">
                    <div className="w-10 h-10 rounded-full bg-orange-100 overflow-hidden flex-shrink-0">
                         <img src="https://api.dicebear.com/7.x/avataaars/svg?seed=Felix" alt="User" />
                    </div>
                    <div>
                        <div className="text-xs font-bold text-gray-800 mb-0.5">Helena Francis <span className="text-gray-400 font-normal">shared a response</span></div>
                        <p className="text-sm text-gray-600 leading-snug">"Hello students, here's the response to the task you should..."</p>
                    </div>
                </div>
                <div className="mt-3 pl-12 flex gap-2">
                     <div className="h-16 w-24 bg-gray-100 rounded-lg"></div>
                     <div className="h-16 w-24 bg-gray-800 rounded-lg"></div>
                </div>
                <div className="absolute -bottom-4 -right-4 w-12 h-12 bg-teal-500 rounded-full shadow-lg flex items-center justify-center text-white">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z"></path></svg>
                </div>
            </div>

             {/* Middle Left - Icon Card */}
            <div className="absolute top-[40%] left-[2%] bg-white p-3 rounded-xl shadow-lg border border-gray-50 rotate-[-12deg] w-16 h-16 flex items-center justify-center">
                 <div className="w-10 h-10 bg-indigo-100 rounded-lg flex items-center justify-center text-indigo-600">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z"></path></svg>
                 </div>
            </div>
            
             {/* Middle Right - Floating Icon */}
             <div className="absolute top-[50%] right-[2%] bg-red-50 p-4 rounded-xl shadow-sm rotate-[12deg] flex items-center justify-center">
                 <svg className="w-8 h-8 text-red-400" fill="currentColor" viewBox="0 0 20 20"><path d="M10 2a6 6 0 00-6 6v3.586l-.707.707A1 1 0 004 14h12a1 1 0 00.707-1.707L16 11.586V8a6 6 0 00-6-6zM10 18a3 3 0 01-3-3h6a3 3 0 01-3 3z"></path></svg>
            </div>
        </div>

        {/* Hero Text */}
        <div className="relative z-10 text-center max-w-4xl mx-auto space-y-8 mt-12 bg-white/30 backdrop-blur-sm p-8 rounded-3xl border border-white/50 shadow-sm md:bg-transparent md:backdrop-blur-none md:p-0 md:border-none md:shadow-none">
          <h1 className="text-5xl md:text-7xl font-extrabold text-gray-900 tracking-tight leading-[1.1]">
            Teacher-built. <span className="text-red-500">AI-first.</span><br />
            More than an LMS.
          </h1>
          
          <p className="text-lg md:text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Plan, teach, assess, report, and communicate - all in one place. Powered by the most advanced AI for education - so you can work faster, teach better, and personalise learning like never before.
          </p>
          
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-4">
            <Link 
                href="/teacher/command-center" 
                className="bg-gray-900 text-white px-8 py-4 rounded-xl text-lg font-bold hover:bg-gray-800 transition-all shadow-xl hover:shadow-2xl hover:-translate-y-1 transform"
            >
              Get a demo
            </Link>
          </div>
          
          {/* Active Classes Pill - Since we fetched them anyway, show a tiny hint if any exist */}
          {classes.length > 0 && (
              <div className="mt-8 inline-flex items-center gap-2 px-4 py-2 bg-green-50 text-green-700 rounded-full text-sm font-medium border border-green-100 animate-fade-in-up">
                  <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                  {classes.length} Active System Classes Detected
              </div>
          )}
        </div>

      </main>

      <style jsx global>{`
        @keyframes float-slow {
          0%, 100% { transform: translateY(0) rotate(-6deg); }
          50% { transform: translateY(-20px) rotate(-6deg); }
        }
        @keyframes float-medium {
          0%, 100% { transform: translateY(0) rotate(3deg); }
          50% { transform: translateY(-15px) rotate(3deg); }
        }
        @keyframes float-fast {
           0%, 100% { transform: translateY(0) rotate(4deg); }
          50% { transform: translateY(-10px) rotate(4deg); }
        }
        .animate-float-slow { animation: float-slow 6s ease-in-out infinite; }
        .animate-float-medium { animation: float-medium 5s ease-in-out infinite; }
        .animate-float-fast { animation: float-fast 4s ease-in-out infinite; }
      `}</style>
    </div>
  );
}


