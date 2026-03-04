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
          <p className="text-gray-600">Step 1: Validate credentials and upload official syllabus.</p>
        </Link>
        
        <Link href="/teacher/command-center" className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Teacher Command Center</h2>
          <p className="text-gray-600">Step 2: Define lesson perimeter and generate invite codes.</p>
        </Link>

        <Link href="/student/session" className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Student Interface</h2>
          <p className="text-gray-600">Step 3: Join active session with AI tutor.</p>
        </Link>

        <Link href="/teacher/dashboard" className="block p-6 bg-white rounded-lg shadow hover:shadow-md transition border border-gray-200">
          <h2 className="text-xl font-bold text-gray-800 mb-2">Live Dashboard</h2>
          <p className="text-gray-600">Step 4: Monitor real-time student progress.</p>
        </Link>
      </div>
    </div>
  );
}
