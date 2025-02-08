import Pusher from 'pusher'
import PusherClient from 'pusher-js'

// Server-side Pusher instance
export const pusher = new Pusher({
  appId: process.env.PUSHER_APP_ID!,
  key: process.env.PUSHER_KEY!,
  secret: process.env.PUSHER_SECRET!,
  cluster: process.env.PUSHER_CLUSTER!,
  useTLS: true,
})

// Client-side Pusher instance
export const pusherClient = new PusherClient(
  process.env.NEXT_PUBLIC_PUSHER_KEY!,
  {
    cluster: process.env.NEXT_PUBLIC_PUSHER_CLUSTER!,
    enabledTransports: ['ws', 'wss'],
    authEndpoint: '/api/pusher/auth',
    auth: {
      params: {
        username: typeof window !== 'undefined' ? 
          localStorage.getItem(`username_${window.sessionStorage.getItem('user_id')}`) : undefined
      },
      headers: {
        'Content-Type': 'application/json',
      }
    },
    // Development-specific options
    ...(process.env.NODE_ENV === 'development' && {
      wsHost: process.env.NEXT_PUBLIC_WS_HOST || undefined,
      wsPort: process.env.NEXT_PUBLIC_WS_PORT ? parseInt(process.env.NEXT_PUBLIC_WS_PORT) : undefined,
      forceTLS: true,
      disableStats: true,
    }),
  }
)

// Channel names with environment prefix for isolation
const ENV_PREFIX = process.env.NODE_ENV === 'development' ? 'dev-' : 'prod-'

export const CHANNELS = {
  CHAT: `${ENV_PREFIX}chat-channel`,
  PRESENCE: `presence-${ENV_PREFIX}room`,
  PAYMENT: `${ENV_PREFIX}private-payments`,
} as const

export const EVENTS = {
  MESSAGE: 'message',
  USER_COUNT: 'user-count',
  PAYMENT_REQUEST: 'client-payment-request',
  PAYMENT_CONFIRM: 'client-payment-confirm',
} as const

// Utility function to get channel subscription count
export async function getChannelSubscriptionCount(channelName: string): Promise<number> {
  try {
    const response = await fetch(
      `https://api-${process.env.PUSHER_CLUSTER}.pusher.com/apps/${process.env.PUSHER_APP_ID}/channels/${channelName}/subscription_count`,
      {
        headers: {
          'Authorization': `Bearer ${process.env.PUSHER_KEY}:${process.env.PUSHER_SECRET}`,
        },
      }
    )
    const data = await response.json()
    return data.subscription_count || 0
  } catch (error) {
    console.error('Error getting subscription count:', error)
    return 0
  }
}

// Helper to check if we're in development
export const isDev = process.env.NODE_ENV === 'development'

// Helper to get the appropriate Pusher credentials
export function getPusherCredentials() {
  return {
    appId: process.env.PUSHER_APP_ID,
    key: process.env.PUSHER_KEY,
    secret: process.env.PUSHER_SECRET,
    cluster: process.env.PUSHER_CLUSTER,
  }
} 