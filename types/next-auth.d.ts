import 'next-auth'

declare module 'next-auth' {
  interface Session {
    user: {
      /** The user's World ID (from profile.sub) */
      id: string
      /** World ID verification level (orb/phone) */
      verification_level: string
    }
  }
  
  interface User {
    /** The user's World ID (from profile.sub) */
    id: string
    /** World ID verification level (orb/phone) */
    verification_level: string
  }
} 