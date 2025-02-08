import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Chat from '@/components/Chat'

export default function ChatPage() {
  return (
    <main className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Chat Room</h1>
      <Chat />
    </main>
  );
}
