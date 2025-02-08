import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth'
import { pusher, CHANNELS, EVENTS } from '@/lib/pusher'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user?.id) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    const { message, username, type, messageTimestamp, userId } = data

    // Handle split events
    if (type === EVENTS.SPLIT_JOIN || type === EVENTS.SPLIT_PAY) {
      await pusher.trigger(CHANNELS.CHAT, type, {
        userId,
        messageTimestamp
      })
      return NextResponse.json({ success: true })
    }

    // Handle regular chat messages
    const messageData = {
      message,
      userId: session.user.id,
      username,
      verification_level: session.user.verification_level,
      timestamp: new Date().toISOString(),
      ...data.receipt && { receipt: data.receipt }
    }

    await pusher.trigger(CHANNELS.CHAT, EVENTS.MESSAGE, messageData)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in message API:', error)
    return NextResponse.json({ error: 'Failed to send message' }, { status: 500 })
  }
} 