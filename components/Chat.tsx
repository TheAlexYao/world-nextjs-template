'use client'

import { useState, useEffect, useRef } from 'react'
import { useSession, signOut } from 'next-auth/react'
import { pusherClient, CHANNELS, EVENTS } from '@/lib/pusher'
import ScanButton from './Receipt/ScanButton'
import ScanModal, { MOCK_RECEIPT } from './Receipt/ScanModal'
import ReceiptCard from './Receipt/ReceiptCard'
import { type ReceiptData } from '@/types/receipt'
import { PresenceChannel } from 'pusher-js'

type Message = {
  message: string
  userId: string
  timestamp: string
  verification_level: string
  username: string
  receipt?: {
    data: ReceiptData
    participants: Array<{
      userId: string
      username: string
      verification: 'orb' | 'phone'
      hasPaid: boolean
    }>
  }
}

type PresenceMember = {
  id: string
  info: {
    verification_level: 'orb' | 'phone'
  }
}

export default function Chat() {
  const [messages, setMessages] = useState<Message[]>([])
  const [newMessage, setNewMessage] = useState('')
  const [username, setUsername] = useState<string>('')
  const [usernames, setUsernames] = useState<Record<string, string>>({})
  const [isEditingName, setIsEditingName] = useState(false)
  const [connectedUsers, setConnectedUsers] = useState<number>(1)
  const [isScanModalOpen, setIsScanModalOpen] = useState(false)
  const messagesEndRef = useRef<HTMLDivElement>(null)
  const presenceChannelRef = useRef<PresenceChannel | null>(null)
  const { data: session } = useSession()

  // Load username from localStorage or set default
  useEffect(() => {
    if (session?.user?.id) {
      const savedName = localStorage.getItem(`username_${session.user.id}`)
      if (savedName) {
        setUsername(savedName)
        setUsernames(prev => ({...prev, [session.user.id]: savedName}))
      }
    }
  }, [session])

  // Save username to localStorage when it changes
  const updateUsername = (newUsername: string) => {
    if (session?.user?.id && newUsername.trim()) {
      const trimmedName = newUsername.trim()
      localStorage.setItem(`username_${session.user.id}`, trimmedName)
      setUsername(trimmedName)
      setUsernames(prev => ({...prev, [session.user.id]: trimmedName}))
      
      // Force Pusher to reconnect with new username
      pusherClient.disconnect()
      pusherClient.connect()
    }
  }

  // Auto-scroll to bottom when messages change
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages])

  // Pusher setup effect
  useEffect(() => {
    if (!session?.user?.id || !username) {
      console.log('Missing required data, skipping Pusher setup:', {
        hasSession: !!session?.user?.id,
        username
      })
      return
    }
    
    // Store session ID for Pusher auth
    console.log('Setting up Pusher with:', {
      userId: session.user.id,
      username,
      verificationLevel: session.user.verification_level
    })
    sessionStorage.setItem('user_id', session.user.id)

    // Force reconnect with current auth state
    pusherClient.disconnect()

    // Subscribe to both chat and presence channels
    const chatChannel = pusherClient.subscribe(CHANNELS.CHAT)
    const presenceChannel = pusherClient.subscribe(CHANNELS.PRESENCE) as PresenceChannel
    presenceChannelRef.current = presenceChannel

    // Handle presence events
    presenceChannel.bind('pusher:subscription_succeeded', (members: any) => {
      console.log('✅ Presence subscription succeeded:', members)
      setConnectedUsers(members.count)
    })
    
    presenceChannel.bind('pusher:subscription_error', (error: any) => {
      console.error('❌ Presence subscription error:', {
        error: JSON.stringify(error, null, 2),
        session: {
          id: session?.user?.id,
          verification_level: session?.user?.verification_level
        },
        channel: presenceChannel.name,
        state: pusherClient.connection.state
      })
    })

    presenceChannel.bind('pusher:member_added', (member: any) => {
      console.log('Member added:', member)
      setConnectedUsers(prev => prev + 1)
    })

    presenceChannel.bind('pusher:member_removed', (member: any) => {
      console.log('Member removed:', member)
      setConnectedUsers(prev => Math.max(1, prev - 1))
    })

    // Handle chat messages
    chatChannel.bind(EVENTS.MESSAGE, (data: Message) => {
      setMessages((prev) => [...prev, data])
    })

    // Handle split joins
    chatChannel.bind(EVENTS.SPLIT_JOIN, (data: { userId: string, messageTimestamp: string }) => {
      setMessages(prev => prev.map(msg => {
        if (msg.timestamp === data.messageTimestamp && msg.receipt) {
          return {
            ...msg,
            receipt: {
              ...msg.receipt,
              participants: msg.receipt.participants.map(p => 
                p.userId === data.userId 
                  ? { ...p, hasPaid: false }
                  : p
              )
            }
          }
        }
        return msg
      }))
    })

    // Handle split payments
    chatChannel.bind(EVENTS.SPLIT_PAY, (data: { userId: string, messageTimestamp: string }) => {
      setMessages(prev => prev.map(msg => {
        if (msg.timestamp === data.messageTimestamp && msg.receipt) {
          return {
            ...msg,
            receipt: {
              ...msg.receipt,
              participants: msg.receipt.participants.map(p => 
                p.userId === data.userId 
                  ? { ...p, hasPaid: true }
                  : p
              )
            }
          }
        }
        return msg
      }))
    })

    // Connect after binding
    pusherClient.connect()

    // Cleanup on unmount
    return () => {
      chatChannel.unbind_all()
      presenceChannel.unbind_all()
      pusherClient.unsubscribe(CHANNELS.CHAT)
      pusherClient.unsubscribe(CHANNELS.PRESENCE)
      pusherClient.disconnect()
    }
  }, [session?.user?.id, username, session?.user?.verification_level])

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

  // Get current members from presence channel
  const members = presenceChannelRef.current ? 
    Array.from((presenceChannelRef.current.members as any).members as Map<string, PresenceMember>).map(([id, member]) => ({
      userId: id,
      username: usernames[id] || 'Unknown',
      verification: member.info.verification_level,
      hasPaid: false
    })) : []

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
            const input = e.currentTarget.querySelector('input') as HTMLInputElement
            const newUsername = input?.value || ''
            if (newUsername.trim()) {
              setUsername(newUsername.trim())
            }
          }} className="flex flex-col items-center gap-4">
            <input
              type="text"
              placeholder="Enter display name"
              className="input-primary w-64"
              autoFocus
              minLength={2}
            />
            <button 
              type="submit"
              className="btn-primary"
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
              const input = e.currentTarget.querySelector('input') as HTMLInputElement
              const newUsername = input?.value || ''
              if (newUsername.trim()) {
                setUsername(newUsername.trim())
                setIsEditingName(false)
              }
            }} className="flex items-center gap-2 max-w-full">
              <input
                type="text"
                defaultValue={username}
                placeholder="Enter display name"
                className="input-primary text-sm w-[140px] max-w-[50vw]"
                autoFocus
                minLength={2}
                style={{
                  maxHeight: '35px'
                }}
              />
              <button 
                type="submit"
                className="text-xs btn-secondary"
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
                  msg.receipt ? 'bg-white' : isCurrentUser
                    ? 'bg-[#00A7B7] text-white'
                    : 'bg-gray-100 text-gray-900'
                }`}
              >
                {!isCurrentUser && !msg.receipt && (
                  <p className="text-xs font-medium mb-1 flex items-center gap-1">
                    {getDisplayName(msg)}
                    {msg.verification_level === 'orb' ? (
                      <span title="Orb Verified" className="text-[#00A7B7]">⦿</span>
                    ) : (
                      <span title="Phone Verified" className="text-[#00A7B7]">☎</span>
                    )}
                  </p>
                )}
                {msg.receipt ? (
                  <ReceiptCard
                    receipt={msg.receipt.data}
                    participants={msg.receipt.participants}
                    connectedUsers={msg.receipt.participants.length}
                    splitAmount={msg.receipt.data.total / msg.receipt.participants.length}
                    isMessage={true}
                    currentUserId={session.user.id}
                    initiatorId={msg.userId}
                    onJoin={async () => {
                      try {
                        await fetch('/api/pusher/message', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ 
                            type: EVENTS.SPLIT_JOIN,
                            userId: session.user.id,
                            messageTimestamp: msg.timestamp
                          }),
                        })
                      } catch (error) {
                        console.error('Error joining split:', error)
                      }
                    }}
                    onPay={async () => {
                      try {
                        await fetch('/api/pusher/message', {
                          method: 'POST',
                          headers: { 'Content-Type': 'application/json' },
                          body: JSON.stringify({ 
                            type: EVENTS.SPLIT_PAY,
                            userId: session.user.id,
                            messageTimestamp: msg.timestamp
                          }),
                        })
                      } catch (error) {
                        console.error('Error paying split:', error)
                      }
                    }}
                  />
                ) : (
                  <p className="break-words text-[15px] leading-[1.3]">{msg.message}</p>
                )}
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
          <ScanButton 
            onClick={() => setIsScanModalOpen(true)}
          />
          <input
            type="text"
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            placeholder="Type your message..."
            className="input-primary flex-1 text-[15px]"
          />
          <button
            type="submit"
            disabled={!newMessage.trim()}
            className="btn-primary text-[15px]"
          >
            Send
          </button>
        </form>
      </div>
      
      {/* Scan Modal */}
      <ScanModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        connectedUsers={connectedUsers}
        participants={members}
        username={username}
        onScanComplete={async () => {
          try {
            // If only 1 user (myself), just show receipt without split
            if (connectedUsers <= 1) {
              await fetch('/api/pusher/message', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ 
                  message: `📋 Receipt total: ${MOCK_RECEIPT.currency} ${MOCK_RECEIPT.total}`,
                  username,
                  receipt: {
                    data: MOCK_RECEIPT,
                    participants: [] // Empty participants for single user
                  }
                }),
              })
              setIsScanModalOpen(false) // Close modal after sending
              return
            }

            // Send receipt with all participants
            await fetch('/api/pusher/message', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                message: `📋 Receipt total: ${MOCK_RECEIPT.currency} ${MOCK_RECEIPT.total}\n💰 Split ${connectedUsers} ways: ${MOCK_RECEIPT.currency} ${(MOCK_RECEIPT.total / connectedUsers).toFixed(2)} each`,
                username,
                receipt: {
                  data: MOCK_RECEIPT,
                  participants: members
                }
              }),
            })
            setIsScanModalOpen(false) // Close modal after sending
          } catch (error) {
            console.error('Error sending split command:', error)
          }
        }}
      />
    </div>
  )
} 