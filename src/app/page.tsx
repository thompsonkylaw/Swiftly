import Link from 'next/link';

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-50 flex flex-col items-center justify-center p-4">
      <h1 className="text-4xl font-extrabold text-blue-900 mb-2">Swiftly</h1>
      <p className="text-gray-600 mb-12 text-center max-w-lg">
        The AI Instructor Platform. Validated curriculum, personalized instruction, and real-time oversight.
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 w-full max-w-2xl">
        <Link href="/registry" className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Institutional Registry</h2>
          <p className="text-gray-600">Start here: Validate credentials and upload official syllabus.</p>
        </Link>
        
        <Link href="/teacher/command-center" className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Teacher Dashboard</h2>
          <p className="text-gray-600">Create classes, assignments, and manage student work.</p>
        </Link>

        <Link href="/student/session" className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Student Portal</h2>
          <p className="text-gray-600">Join a class, view assignments, and complete work.</p>
        </Link>

        {/* Removed redundant live dashboard link as it is now part of teacher dashboard flow */}
      </div>
    </div>
  );
}
