import { auth } from '@clerk/nextjs/server'
import { NextResponse } from 'next/server'

/**
 * Authentication middleware for API routes
 * Verifies Clerk session tokens and extracts user ID
 * 
 * @returns Object containing userId and user if authenticated, or null if not
 */
export async function getAuthUser() {
  const { userId, sessionClaims } = await auth()
  
  if (!userId) {
    return null
  }

  return {
    userId,
    user: sessionClaims,
  }
}

/**
 * Middleware wrapper for protected API routes
 * Returns 401 Unauthorized if user is not authenticated
 * 
 * @param handler - The API route handler function that receives userId
 * @returns NextResponse with error or the result of the handler
 */
export function withAuth(
  handler: (userId: string, request: Request) => Promise<NextResponse>
) {
  return async (request: Request) => {
    const authUser = await getAuthUser()
    
    if (!authUser) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      )
    }

    return handler(authUser.userId, request)
  }
}

/**
 * Check if user is authenticated
 * @returns boolean indicating if user is authenticated
 */
export async function isAuthenticated(): Promise<boolean> {
  const { userId } = await auth()
  return !!userId
}

/**
 * Get current user ID or throw error
 * Useful for server components and actions
 * @throws Error if user is not authenticated
 */
export async function requireAuth(): Promise<string> {
  const { userId } = await auth()
  
  if (!userId) {
    throw new Error('Unauthorized. Please sign in.')
  }
  
  return userId
}
