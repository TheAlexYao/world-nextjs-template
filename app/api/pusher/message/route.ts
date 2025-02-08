import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { pusher, CHANNELS, EVENTS } from '@/lib/pusher'

export async function POST(req: Request) {
  try {
    const session = await getServerSession()
    if (!session) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      )
    }

    const body = await req.json()
    const { message } = body

    // Trigger the message event on the chat channel
    await pusher.trigger(CHANNELS.CHAT, EVENTS.MESSAGE, {
      message,
      userId: session.user.id,
      verification_level: session.user.verification_level,
      timestamp: new Date().toISOString(),
    })

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error in Pusher message route:', error)
    return NextResponse.json(
      { error: 'Error processing message' },
      { status: 500 }
    )
  }
} 