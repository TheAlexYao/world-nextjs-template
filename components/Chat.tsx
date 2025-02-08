'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { pusherClient, CHANNELS, EVENTS } from '@/lib/pusher'

type Message = {
  message: string
  userId: string
  timestamp: string
  verification_level: string
  username: string
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [username, setUsername] = useState<string>('')
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { data: session } = useSession()

  // Get username from MiniKit when component mounts
  useEffect(() => {
    console.log('MiniKit:', window.MiniKit)
    if (window.MiniKit?.user?.username) {
      console.log('Setting username:', window.MiniKit.user.username)
      setUsername(window.MiniKit.user.username)
    } else {
      console.log('No MiniKit username found')
      // Fallback to last 4 chars of ID if no username
      setUsername(session?.user?.id?.slice(-4) || 'Anonymous')
    }
  }, [session])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!session) return

    // Subscribe to the chat channel
    const channel = pusherClient.subscribe(CHANNELS.CHAT)

    // Bind to message events
    channel.bind(EVENTS.MESSAGE, (data: Message) => {
      setMessages((prev) => [...prev, data])
    })

    // Cleanup on unmount
    return () => {
      channel.unbind_all()
      pusherClient.unsubscribe(CHANNELS.CHAT)
    }
  }, [session])

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!newMessage.trim() || !session || !username) return

    try {
      await fetch('/api/pusher/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: newMessage,
          username: username // Send username from MiniKit
        }),
      })
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  if (!session) {
    return (
      <div className="flex items-center justify-center h-[100dvh] px-4 bg-white overscroll-none">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Welcome to Chat</h2>
          <p className="text-gray-600">Please sign in with World ID to continue</p>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-white overscroll-none">
      {/* Header */}
      <div className="flex items-center px-4 py-3 border-b bg-white sticky top-0">
        <h1 className="text-lg font-semibold text-gray-900">Group Chat</h1>
        <div className="ml-auto flex items-center gap-4">
          <div className="text-sm text-gray-500">
            {messages.length} messages
          </div>
          <button
            onClick={() => signOut()}
            className="text-sm text-gray-600 hover:text-gray-900"
          >
            Sign Out
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 overscroll-none">
        {messages.map((msg, i) => {
          const isCurrentUser = msg.userId === session.user.id
          return (
            <div
              key={msg.timestamp + i}
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'}`}
            >
              <div
                className={`rounded-2xl px-4 py-2 max-w-[80%] ${
                  isCurrentUser
                    ? 'bg-[#00A7B7] text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {!isCurrentUser && (
                  <p className="text-xs font-medium mb-1">
                    {msg.username} ({msg.verification_level})
                  </p>
                )}
                <p className="break-words text-[15px] leading-[1.3]">{msg.message}</p>
                <span className="text-xs opacity-75 mt-1 block">
                  {new Date(msg.timestamp).toLocaleTimeString()}
                </span>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} />
      </div>

      {/* Input */}
      <div className="px-4 py-3 bg-white sticky bottom-0">
        <form onSubmit={sendMessage} className="flex gap-2">
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="flex-1 rounded-full border-gray-300 border px-4 py-2 text-[15px] focus:outline-none focus:border-[#00A7B7] focus:ring-1 focus:ring-[#00A7B7]"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="bg-[#00A7B7] text-white px-6 py-2 rounded-full font-medium text-[15px] hover:bg-[#008999] disabled:opacity-50 disabled:cursor-not-allowed active:scale-95 transition-transform"
          >
            Send
          </button>
        </form>
      </div>
    </div>
  )
} 