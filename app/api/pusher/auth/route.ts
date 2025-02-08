import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth'
import { pusher } from '@/lib/pusher'

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session?.user) {
      console.log('Auth failed: No session')
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const data = await req.json()
    console.log('Auth request:', {
      socketId: data.socket_id,
      channel: data.channel_name,
      userId: session.user.id,
      username: data.username
    })

    const socketId = data.socket_id
    const channel = data.channel_name

    // Auth for presence channel
    const presenceData = {
      user_id: session.user.id,
      user_info: {
        verification_level: session.user.verification_level,
        username: data.username || session.user.id.slice(-4) // Fallback to ID slice if no username
      }
    }

    const authResponse = pusher.authorizeChannel(socketId, channel, presenceData)
    console.log('Auth success:', authResponse)
    return NextResponse.json(authResponse)
  } catch (error) {
    console.error('Error in Pusher auth:', error)
    return NextResponse.json({ error: 'Auth failed' }, { status: 500 })
  }
} 