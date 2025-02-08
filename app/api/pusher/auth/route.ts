import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth'
import { pusher } from '@/lib/pusher'

export async function POST(req: Request) {
  try {
    console.log('Starting Pusher auth...')
    const session = await getServerSession(authOptions)
    console.log('Session:', {
      exists: !!session,
      user: session?.user,
      hasId: !!session?.user?.id,
      hasVerification: !!session?.user?.verification_level
    })
    if (!session?.user) {
      console.log('Auth failed: No session')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    console.log('Auth request:', {
      socketId: data.socket_id,
      channel: data.channel_name,
      userId: session.user.id,
      username: data.username,
      verification_level: session.user.verification_level
    })

    const socketId = data.socket_id
    const channel = data.channel_name

    // Auth for presence channel
    const presenceData = {
      user_id: session.user.id,
      user_info: {
        verification_level: session.user.verification_level,
        username: session.user.id.slice(-4) // Default to ID slice
      }
    }

    console.log('Presence data:', presenceData)

    const authResponse = pusher.authorizeChannel(socketId, channel, presenceData)
    console.log('Auth success:', authResponse)
    return NextResponse.json(authResponse)
  } catch (error) {
    console.error('Error in Pusher auth:', error)
    // Log more error details
    if (error instanceof Error) {
      console.error('Error name:', error.name)
      console.error('Error message:', error.message)
      console.error('Error stack:', error.stack)
    }
    return NextResponse.json({ error: 'Auth failed' }, { status: 500 })
  }
} 