import { NextResponse } from 'next/server'
import { getServerSession } from 'next-auth'
import { authOptions } from '@/app/api/auth/[...nextauth]/auth'
import { pusher } from '@/lib/pusher'

export async function POST(req: Request) {
  try {
    console.log('🔑 Auth request received')
    
    // Get session first to fail fast
    console.log('🔍 Getting session...')
    const session = await getServerSession(authOptions)
    console.log('👤 Session:', { 
      exists: !!session,
      userId: session?.user?.id,
      verificationLevel: session?.user?.verification_level,
      headers: Object.fromEntries(req.headers)
    })

    if (!session?.user?.id) {
      console.error('❌ No session or user ID')
      return NextResponse.json({ 
        error: 'Unauthorized', 
        details: 'No valid session found',
        session 
      }, { status: 401 })
    }

    // Parse request body
    const data = await req.json().catch(e => {
      console.error('❌ JSON parse error:', e)
      return null
    })
    
    if (!data) {
      return NextResponse.json({ error: 'Invalid request body' }, { status: 400 })
    }
    console.log('📦 Request data:', data)

    const { socket_id, channel_name } = data
    if (!socket_id || !channel_name) {
      console.error('❌ Missing fields:', { socket_id, channel_name })
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    // Only authorize presence channels
    if (!channel_name.startsWith('presence-')) {
      console.error('❌ Invalid channel:', channel_name)
      return NextResponse.json({ error: 'Not a presence channel' }, { status: 403 })
    }

    const presenceData = {
      user_id: session.user.id,
      user_info: {
        verification_level: session.user.verification_level || 'unknown'
      }
    }
    console.log('📝 Presence data:', presenceData)

    try {
      console.log('🔐 Authorizing channel...')
      const authResponse = pusher.authorizeChannel(socket_id, channel_name, presenceData)
      console.log('✅ Auth success:', authResponse)
      return NextResponse.json(authResponse)
    } catch (e) {
      console.error('❌ Pusher authorize failed:', e)
      return NextResponse.json({ 
        error: 'Pusher authorization failed',
        details: e instanceof Error ? e.message : 'Unknown error',
        presenceData
      }, { status: 500 })
    }
  } catch (error) {
    console.error('❌ Auth error:', error)
    return NextResponse.json({ 
      error: 'Auth failed',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
} 