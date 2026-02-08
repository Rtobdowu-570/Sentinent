import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth'

/**
 * Test API route to verify authentication middleware
 * GET /api/test-auth
 * 
 * This is a protected route that requires authentication
 */
export const GET = withAuth(async (userId: string) => {
  return NextResponse.json({
    success: true,
    message: 'Authentication successful',
    userId,
  })
})
