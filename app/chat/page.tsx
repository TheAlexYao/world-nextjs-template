import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import dynamic from 'next/dynamic';
import { PayBlock } from "@/components/Pay";

// Dynamically import Chat component to avoid SSR issues with Socket.IO
const ChatComponent = dynamic(() => import('@/components/ChatComponent'), {
  ssr: false,
});

export default async function ChatPage() {
  const session = await getServerSession();

  if (!session) {
    redirect('/');
  }

  return (
    <main className="flex min-h-screen flex-col p-8 max-w-4xl mx-auto relative">
      <div className="w-full text-center mb-8">
        <h1 className="text-3xl font-bold mb-2">Ephemeral Chat</h1>
        <p className="text-gray-600">Group chat with automated receipt scanning and payment splitting</p>
      </div>
      
      {/* Chat Component */}
      <div className="flex-1 bg-white rounded-lg shadow-lg overflow-hidden">
        <ChatComponent />
      </div>

      {/* Fixed Payment Button */}
      <div className="fixed bottom-4 right-4">
        <PayBlock />
      </div>
    </main>
  );
}
