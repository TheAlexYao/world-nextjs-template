import { SignIn } from "@/components/SignIn";
import { getServerSession } from 'next-auth';
import Link from 'next/link';

export default async function Home() {
  const session = await getServerSession();

  return (
    <main className="flex min-h-screen flex-col items-center justify-center p-8 gap-y-6 max-w-4xl mx-auto">
      <div className="w-full text-center">
        <h1 className="text-3xl font-bold mb-4">Welcome to Ephemeral</h1>
        <p className="text-xl text-gray-600 mb-8">Split bills effortlessly in real-time group chats</p>
        
        <div className="flex flex-col items-center gap-y-6 max-w-md mx-auto">
          {!session ? (
            <div className="w-full p-6 bg-white rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Get Started</h2>
              <p className="text-gray-600 mb-6">Sign in with your World ID to join or create chat rooms.</p>
              <SignIn />
            </div>
          ) : (
            <div className="w-full p-6 bg-white rounded-lg shadow-lg">
              <h2 className="text-xl font-semibold mb-4">Welcome Back!</h2>
              <p className="text-gray-600 mb-6">Ready to chat and split bills with friends?</p>
              <Link 
                href="/chat"
                className="inline-block w-full px-6 py-3 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors"
              >
                Join Chat Room
              </Link>
            </div>
          )}
        </div>
      </div>
    </main>
  );
}
