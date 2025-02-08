import { SignIn } from "@/components/SignIn";
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import Image from 'next/image';

export default async function Home() {
  const session = await getServerSession();

  return (
    <main className="flex min-h-screen flex-col items-center p-8 bg-gradient-to-b from-white to-gray-50">
      {/* Hero Section */}
      <div className="w-full max-w-4xl mx-auto text-center pt-12 pb-16">
        <div className="flex justify-center mb-6">
          <Image
            src="/images/logo-dark.svg"
            alt="Ephemeral"
            width={180}
            height={40}
            className="h-10 w-auto"
          />
        </div>
        <h1 className="text-4xl font-bold mb-4 bg-gradient-to-r from-[#00A7B7] to-blue-600 text-transparent bg-clip-text">
          Split Bills with Friends
        </h1>
        <p className="text-xl text-gray-600 mb-8 max-w-2xl mx-auto">
          Join real-time chat rooms, scan receipts, and split payments instantly using World ID
        </p>
        
        {/* Auth/Action Card */}
        <div className="max-w-md mx-auto">
          {!session ? (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center justify-center mb-6">
                <Image
                  src="/images/icon.svg"
                  alt="Split & Pay"
                  width={48}
                  height={48}
                  className="w-12 h-12"
                />
              </div>
              <h2 className="text-xl font-semibold mb-4">Get Started</h2>
              <p className="text-gray-600 mb-6">
                Sign in with World ID to start splitting bills with friends
              </p>
              <SignIn />
            </div>
          ) : (
            <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-100">
              <div className="flex items-center justify-center mb-6">
                <Image
                  src="/images/icon.svg"
                  alt="Split & Pay"
                  width={48}
                  height={48}
                  className="w-12 h-12"
                />
              </div>
              <h2 className="text-xl font-semibold mb-4">Welcome Back!</h2>
              <p className="text-gray-600 mb-6">Ready to split bills with friends?</p>
              <Link 
                href="/chat"
                className="block w-full px-6 py-3 bg-[#00A7B7] text-white rounded-full font-medium hover:bg-[#008999] transition-colors text-center"
              >
                Join Chat Room
              </Link>
            </div>
          )}
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-16">
          <div className="p-6">
            <div className="w-12 h-12 bg-[#00A7B7]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-[#00A7B7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Real-time Chat</h3>
            <p className="text-gray-600">Chat with friends in real-time while splitting bills</p>
          </div>
          <div className="p-6">
            <div className="w-12 h-12 bg-[#00A7B7]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-[#00A7B7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Easy Payments</h3>
            <p className="text-gray-600">Send and receive payments with World ID wallet</p>
          </div>
          <div className="p-6">
            <div className="w-12 h-12 bg-[#00A7B7]/10 rounded-full flex items-center justify-center mx-auto mb-4">
              <svg className="w-6 h-6 text-[#00A7B7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
            <h3 className="font-semibold mb-2">Receipt Scanning</h3>
            <p className="text-gray-600">Scan receipts and auto-calculate splits</p>
          </div>
        </div>
      </div>
    </main>
  );
}
