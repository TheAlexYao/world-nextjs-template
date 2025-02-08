import { SignIn } from "@/components/SignIn";
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import Image from 'next/image';

export default async function Home() {
  const session = await getServerSession();

  return (
    <main className="flex min-h-[100dvh] flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 overscroll-none touch-manipulation">
      {/* Hero Section */}
      <div className="w-full px-4 py-8 md:py-12">
        <div className="max-w-4xl mx-auto">
          <div className="flex justify-center mb-6">
            <Image
              src="/images/logo-light.svg"
              alt="Ephemeral"
              width={180}
              height={40}
              className="h-10 w-auto dark:hidden"
            />
            <Image
              src="/images/logo-dark.svg"
              alt="Ephemeral"
              width={180}
              height={40}
              className="h-10 w-auto hidden dark:block"
            />
          </div>
          
          <h1 className="text-3xl md:text-4xl font-bold text-center mb-4 bg-gradient-to-r from-[#00A7B7] to-blue-600 text-transparent bg-clip-text">
            Snap. Split. Plan. Prosper.
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-300 text-center mb-8 max-w-2xl mx-auto">
            Transform every group adventure into a journey toward shared dreams. Chat in real time, split expenses effortlessly, and watch your contributions grow—fueling your next unforgettable trip.
          </p>

          {/* Auth Card */}
          <div className="max-w-sm mx-auto mb-12">
            {!session ? (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-3 dark:text-white text-center">Welcome to Ephemeral</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">
                  Where every expense is a team effort. Connect with friends, share costs, and let our smart AI handle the details.
                </p>
                <SignIn />
              </div>
            ) : (
              <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-xl p-6 border border-gray-100 dark:border-gray-700">
                <h2 className="text-xl font-semibold mb-3 dark:text-white text-center">Welcome Back!</h2>
                <p className="text-gray-600 dark:text-gray-300 mb-6 text-center">Ready to plan your next adventure?</p>
                <Link 
                  href="/chat"
                  className="block w-full px-6 py-3 bg-gradient-to-r from-[#00A7B7] to-[#008999] text-white rounded-full font-medium hover:from-[#008999] hover:to-[#007A8A] transition-all duration-200 text-center transform hover:scale-[1.02] active:scale-[0.98]"
                >
                  Join Chat Room
                </Link>
              </div>
            )}
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 px-4 max-w-4xl mx-auto">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-[#00A7B7]/10 dark:bg-[#00A7B7]/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#00A7B7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v6a2 2 0 01-2 2h-2v4l-4-4H9a1.994 1.994 0 01-1.414-.586m0 0L11 14h4a2 2 0 002-2V6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2v4l.586-.586z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2 dark:text-white">Live Group Chat</h3>
              <p className="text-gray-600 dark:text-gray-300">Stay in sync with your crew in dynamic, ephemeral conversations that keep plans moving smoothly—no delays, no awkward IOUs.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-[#00A7B7]/10 dark:bg-[#00A7B7]/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#00A7B7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2 dark:text-white">Instant Receipt Scanning</h3>
              <p className="text-gray-600 dark:text-gray-300">Snap your receipt and let our system auto-calculate the perfect split based on who&apos;s in the chat. Every bill becomes a simple, smart contribution.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-[#00A7B7]/10 dark:bg-[#00A7B7]/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#00A7B7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2 dark:text-white">Effortless Payments</h3>
              <p className="text-gray-600 dark:text-gray-300">The trip organizer pays upfront while everyone else confirms their share with a single tap. With secure World ID-powered transactions, every contribution adds up seamlessly.</p>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 shadow-sm border border-gray-100 dark:border-gray-700">
              <div className="w-12 h-12 bg-[#00A7B7]/10 dark:bg-[#00A7B7]/20 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-[#00A7B7]" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
              </div>
              <h3 className="font-semibold mb-2 dark:text-white">AI-Powered Travel Magic</h3>
              <p className="text-gray-600 dark:text-gray-300">Our intelligent travel agent helps book your flights, suggests the best group activities, and turns your everyday spending into a boost for your travel fund.</p>
            </div>
          </div>
        </div>
      </div>
    </main>
  );
}
