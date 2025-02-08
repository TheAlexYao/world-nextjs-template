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
  const [usernames, setUsernames] = useState<Record<string, string>>({})
  const [isEditingName, setIsEditingName] = useState(false)
  const [connectedUsers, setConnectedUsers] = useState<number>(1)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const { data: session } = useSession()

  // Load username from localStorage or set default
  useEffect(() => {
    if (session?.user?.id) {
      const savedName = localStorage.getItem(`username_${session.user.id}`)
      const defaultName = session.user.id.slice(-4)
      const nameToUse = savedName || defaultName
      
      setUsername(nameToUse)
      setUsernames(prev => ({...prev, [session.user.id]: nameToUse}))
    }
  }, [session])

  // Save username to localStorage when it changes
  useEffect(() => {
    if (session?.user?.id && username) {
      localStorage.setItem(`username_${session.user.id}`, username)
      setUsernames(prev => ({...prev, [session.user.id]: username}))
      
      // Force Pusher to reconnect with new username
      pusherClient.disconnect()
      pusherClient.connect()
    }
  }, [username, session?.user?.id])

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  useEffect(() => {
    if (!session?.user?.id) {
      console.log('No session, skipping Pusher setup')
      return
    }
    
    // Store session ID for Pusher auth
    console.log('Setting up Pusher with user:', session.user.id)
    sessionStorage.setItem('user_id', session.user.id)

    // Subscribe to both chat and presence channels
    const chatChannel = pusherClient.subscribe(CHANNELS.CHAT)
    const presenceChannel = pusherClient.subscribe(CHANNELS.PRESENCE)

    // Handle presence events
    presenceChannel.bind('pusher:subscription_succeeded', (members: any) => {
      console.log('✅ Presence subscription succeeded:', members)
      setConnectedUsers(members.count)
      
      // Update usernames from presence data
      const userMap: Record<string, string> = {}
      members.each((member: any) => {
        userMap[member.id] = member.info.username
      })
      setUsernames(prev => ({...prev, ...userMap}))
    })
    presenceChannel.bind('pusher:member_added', (member: any) => {
      console.log('Member added:', member)
      setConnectedUsers(prev => prev + 1)
      setUsernames(prev => ({...prev, [member.id]: member.info.username}))
    })
    presenceChannel.bind('pusher:member_removed', (member: any) => {
      console.log('Member removed:', member)
      setConnectedUsers(prev => Math.max(1, prev - 1))
    })
    presenceChannel.bind('pusher:subscription_error', (error: any) => {
      console.error('❌ Presence subscription error:', {
        error,
        session: session?.user,
        username
      })
    })

    // Handle chat messages
    chatChannel.bind(EVENTS.MESSAGE, (data: Message) => {
      setMessages((prev) => [...prev, data])
    })

    // Cleanup on unmount
    return () => {
      chatChannel.unbind_all()
      presenceChannel.unbind_all()
      pusherClient.unsubscribe(CHANNELS.CHAT)
      pusherClient.unsubscribe(CHANNELS.PRESENCE)
    }
  }, [session, username])

  useEffect(() => {
    // iOS keyboard handling
    const handleVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        // Scroll to bottom when keyboard appears/disappears
        window.scrollTo(0, 0)
        setTimeout(() => {
          messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
        }, 100)
      }
    }

    document.addEventListener('visibilitychange', handleVisibilityChange)
    return () => document.removeEventListener('visibilitychange', handleVisibilityChange)
  }, [])

  const sendMessage = async (e?: React.FormEvent) => {
    e?.preventDefault()
    if (!newMessage.trim() || !session || !username) return

    try {
      await fetch('/api/pusher/message', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          message: newMessage,
          username
        }),
      })
      setNewMessage('')
    } catch (error) {
      console.error('Error sending message:', error)
    }
  }

  // Update message display to use latest username
  const getDisplayName = (msg: Message) => {
    return usernames[msg.userId] || msg.username
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

  // Show username setup if not set
  if (!username) {
    return (
      <div className="flex items-center justify-center h-[100dvh] px-4 bg-white overscroll-none">
        <div className="text-center">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Choose Your Display Name</h2>
          <form onSubmit={(e) => {
            e.preventDefault()
            const trimmedName = username.trim()
            if (trimmedName) {
              localStorage.setItem(`username_${session.user.id}`, trimmedName)
              setUsername(trimmedName)
              setUsernames(prev => ({...prev, [session.user.id]: trimmedName}))
            }
          }} className="flex flex-col items-center gap-4">
            <input
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter display name"
              className="border rounded-lg px-4 py-2 w-64 focus:outline-none focus:border-[#00A7B7] focus:ring-1 focus:ring-[#00A7B7]"
              autoFocus
            />
            <button 
              type="submit"
              disabled={!username.trim()}
              className="bg-[#00A7B7] text-white px-6 py-2 rounded-full font-medium hover:bg-[#008999] disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Continue to Chat
            </button>
          </form>
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col h-[100dvh] bg-white overscroll-none">
      {/* Header - Add min-height to prevent collapse */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-white sticky top-0 z-10 min-h-[60px]">
        {/* Left side: Title and user count */}
        <div className="flex items-center gap-3">
          <h1 className="text-lg font-semibold text-gray-900">Chat</h1>
          <div className="text-sm text-gray-500">{connectedUsers} online</div>
        </div>

        {/* Right side: Username and Sign out - Improve mobile layout */}
        <div className="flex items-center gap-4 min-w-0">
          {isEditingName ? (
            <form onSubmit={(e) => {
              e.preventDefault()
              const trimmedName = username.trim()
              if (trimmedName) {
                setUsername(trimmedName)
                setIsEditingName(false)
              }
            }} className="flex items-center gap-2 max-w-full">
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                onBlur={() => {
                  const trimmedName = username.trim()
                  if (trimmedName) {
                    setUsername(trimmedName)
                    setIsEditingName(false)
                  }
                }}
                placeholder="Enter display name"
                className="border rounded-full px-3 py-1 text-sm w-[140px] focus:outline-none focus:border-[#00A7B7] focus:ring-1 focus:ring-[#00A7B7] max-w-[50vw]"
                autoFocus
                // Add iOS specific fixes
                style={{
                  WebkitAppearance: 'none',
                  maxHeight: '35px'
                }}
              />
              <button 
                type="submit"
                className="text-xs text-[#00A7B7] hover:text-[#008999]"
              >
                Save
              </button>
            </form>
          ) : (
            <button 
              onClick={() => setIsEditingName(true)}
              className="flex items-center gap-1 text-gray-500 hover:text-[#00A7B7] transition-colors"
            >
              <span>{username}</span>
              <span className="text-xs">✎</span>
            </button>
          )}
          <button
            onClick={() => signOut()}
            className="text-sm text-gray-500 hover:text-gray-900"
          >
            Sign out
          </button>
          <button
            onClick={() => {
              localStorage.clear()
              sessionStorage.clear()
              window.location.reload()
            }}
            className="text-sm text-red-500 hover:text-red-700"
          >
            Clear Data
          </button>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-3 space-y-3 overscroll-none -webkit-overflow-scrolling-touch">
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
                  <p className="text-xs font-medium mb-1 flex items-center gap-1">
                    {getDisplayName(msg)}
                    {msg.verification_level === 'orb' ? (
                      <span title="Orb Verified" className="text-[#00A7B7]">⦿</span>
                    ) : (
                      <span title="Phone Verified" className="text-[#00A7B7]">☎</span>
                    )}
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
      <div className="px-4 py-3 bg-white sticky bottom-0 pb-safe">
        <form onSubmit={sendMessage} className="flex gap-2 items-center">
          <button
            type="button"
            onClick={() => {
              // TODO: Start receipt scan flow
              console.log('Starting receipt scan...')
            }}
            className="text-gray-500 hover:text-[#00A7B7] p-2 rounded-full hover:bg-gray-100 transition-colors"
            title="Scan Receipt"
          >
            📷
          </button>
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