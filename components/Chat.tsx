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
  const [isPayModalOpen, setIsPayModalOpen] = useState(false)
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
    <div className="fixed inset-0 flex flex-col bg-gradient-to-b from-white to-gray-50 dark:from-gray-900 dark:to-gray-800 overscroll-none touch-manipulation" style={{ touchAction: 'none' }}>
      {/* Header */}
      <div className="flex items-center justify-between px-4 py-3 border-b bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky top-0 z-10 select-none">
        {/* Left side: Title and user count */}
        <div className="flex items-center gap-2 touch-manipulation">
          <h1 className="text-lg font-bold bg-gradient-to-r from-[#00A7B7] to-blue-600 text-transparent bg-clip-text select-none">Chat</h1>
          <div className="px-2 py-0.5 text-sm bg-[#00A7B7]/10 text-[#00A7B7] rounded-full font-medium select-none">
            {connectedUsers} online
          </div>
        </div>

        {/* Right side: Username and Sign out */}
        <div className="flex items-center gap-2 min-w-0 touch-manipulation">
          {isEditingName ? (
            <form onSubmit={(e) => {
              e.preventDefault()
              const input = e.currentTarget.querySelector('input') as HTMLInputElement
              const newUsername = input?.value || ''
              if (newUsername.trim()) {
                setUsername(newUsername.trim())
                setIsEditingName(false)
              }
            }} className="flex items-center gap-1.5 max-w-full">
              <input
                type="text"
                defaultValue={username}
                placeholder="Name"
                className="input-primary text-sm w-[120px] max-w-[40vw] bg-gray-50 dark:bg-gray-800"
                autoFocus
                minLength={2}
                autoComplete="off"
                autoCorrect="off"
                style={{
                  maxHeight: '32px',
                  WebkitTapHighlightColor: 'transparent'
                }}
              />
              <button 
                type="submit"
                className="px-2.5 py-1 text-xs bg-[#00A7B7] text-white rounded-full hover:bg-[#008999] transition-colors select-none"
                style={{ WebkitTapHighlightColor: 'transparent' }}
              >
                Save
              </button>
            </form>
          ) : (
            <button 
              onClick={() => setIsEditingName(true)}
              className="flex items-center gap-1 text-gray-600 dark:text-gray-300 hover:text-[#00A7B7] dark:hover:text-[#00A7B7] transition-colors px-2.5 py-1.5 rounded-full hover:bg-[#00A7B7]/10 select-none"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              <span className="truncate max-w-[100px]">{username}</span>
              <span className="text-xs">✎</span>
            </button>
          )}
          <div className="flex items-center">
            <button
              onClick={() => signOut()}
              className="px-2.5 py-1.5 text-sm text-gray-600 dark:text-gray-300 hover:text-gray-900 dark:hover:text-white transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 select-none"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              Sign out
            </button>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-3 py-4 space-y-3 overscroll-none -webkit-overflow-scrolling-touch bg-transparent" style={{ touchAction: 'pan-y' }}>
        {messages.map((msg, i) => {
          const isCurrentUser = msg.userId === session.user.id
          return (
            <div
              key={msg.timestamp + i}
              className={`flex ${isCurrentUser ? 'justify-end' : 'justify-start'} animate-fade-in select-none`}
            >
              <div
                className={`rounded-2xl px-3.5 py-2 max-w-[90%] shadow-sm ${
                  msg.receipt ? 'bg-white dark:bg-gray-800 border border-gray-100 dark:border-gray-700' : 
                  isCurrentUser
                    ? 'bg-gradient-to-r from-[#00A7B7] to-[#008999] text-white'
                    : 'bg-white dark:bg-gray-800 text-gray-900 dark:text-white'
                }`}
              >
                {!isCurrentUser && !msg.receipt && (
                  <p className="text-xs font-medium mb-1 flex items-center gap-1.5">
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
                    onModalStateChange={setIsPayModalOpen}
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
                  <p className="break-words text-[15px] leading-[1.4]">{msg.message}</p>
                )}
                <span className="text-xs opacity-75 mt-1.5 block">
                  {new Date(msg.timestamp).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                </span>
              </div>
            </div>
          )
        })}
        <div ref={messagesEndRef} className="h-4" />
      </div>

      {/* Input */}
      {!isPayModalOpen && (
        <div className="px-3 py-3 bg-white/80 dark:bg-gray-900/80 backdrop-blur-sm sticky bottom-0 pb-safe border-t border-gray-100 dark:border-gray-800 z-50">
          <form onSubmit={sendMessage} className="flex gap-2 items-center touch-manipulation">
            <ScanButton 
              onClick={() => setIsScanModalOpen(true)}
            />
            <input
              type="text"
              value={newMessage}
              onChange={(e) => setNewMessage(e.target.value)}
              placeholder="Type your message..."
              className="input-primary flex-1 text-[15px] bg-gray-50 dark:bg-gray-800 border-gray-200 dark:border-gray-700 placeholder-gray-400 dark:placeholder-gray-500"
              autoComplete="off"
              autoCorrect="off"
              style={{
                minHeight: '40px',
                WebkitTapHighlightColor: 'transparent'
              }}
            />
            <button
              type="submit"
              disabled={!newMessage.trim()}
              className="btn-primary text-[15px] bg-gradient-to-r from-[#00A7B7] to-[#008999] hover:from-[#008999] hover:to-[#007A8A] disabled:from-gray-400 disabled:to-gray-400 min-w-[70px] h-[40px] transition-all duration-200 ease-out transform active:scale-[0.97] select-none"
              style={{ WebkitTapHighlightColor: 'transparent' }}
            >
              Send
            </button>
          </form>
        </div>
      )}
      
      {/* Scan Modal */}
      <ScanModal
        isOpen={isScanModalOpen}
        onClose={() => setIsScanModalOpen(false)}
        connectedUsers={connectedUsers}
        participants={members}
        username={username}
        onScanComplete={async () => {
          try {
            const presenceMembers = presenceChannelRef.current?.members
            console.log('Current members:', {
              presenceMembers,
              members,
              connectedUsers
            })

            // Get all members from the presence channel's members object
            const allParticipants = Object.entries(presenceMembers?.members || {})
              .map(([id, member]: [string, any]) => {
                console.log('Processing member:', { id, member })
                return {
                  userId: id,
                  username: id === session?.user?.id ? username : (usernames[id] || member?.info?.username || 'Unknown'),
                  verification: member?.info?.verification_level || 'phone',
                  hasPaid: false
                }
              })

            console.log('Participants being sent:', {
              allParticipants,
              connectedUsers,
              presenceMembers
            })

            // Send receipt with all participants
            await fetch('/api/pusher/message', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ 
                message: `📋 Receipt total: ${MOCK_RECEIPT.currency} ${MOCK_RECEIPT.total}\n💰 Split ${allParticipants.length} ways: ${MOCK_RECEIPT.currency} ${(MOCK_RECEIPT.total / allParticipants.length).toFixed(2)} each`,
                username,
                receipt: {
                  data: MOCK_RECEIPT,
                  participants: allParticipants
                }
              }),
            })
            setIsScanModalOpen(false)
          } catch (error) {
            console.error('Error sending split command:', error)
          }
        }}
      />
    </div>
  )
} 