import { getServerSession } from 'next-auth';
import { redirect } from 'next/navigation';
import Chat from '@/components/Chat'

export default function ChatPage() {
  return <Chat />
}
