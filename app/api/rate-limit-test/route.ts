import { NextResponse } from 'next/server'
import { getAuthUser } from '@/lib/auth'
import { rateLimitService } from '@/lib/services/rate-limit.service'

/**
 * Test API route to demonstrate rate limiting
 * GET /api/rate-limit-test
 * 
 * This route checks the user's rate limit and returns their current status
 */
export async function GET() {
  const authUser = await getAuthUser()
  
  if (!authUser) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Please sign in.' },
      { status: 401 }
    )
  }

  try {
    const rateLimitResult = await rateLimitService.checkLimit(authUser.userId)

    return NextResponse.json({
      success: true,
      rateLimit: {
        allowed: rateLimitResult.allowed,
        currentUsage: rateLimitResult.currentUsage,
        limit: rateLimitResult.limit,
        remaining: rateLimitResult.remaining,
        resetDate: rateLimitResult.resetDate,
        daysUntilReset: rateLimitService.getDaysUntilReset(rateLimitResult.resetDate),
      },
    })
  } catch (error) {
    console.error('Rate limit check error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to check rate limit' },
      { status: 500 }
    )
  }
}

/**
 * Test incrementing usage
 * POST /api/rate-limit-test
 */
export async function POST() {
  const authUser = await getAuthUser()
  
  if (!authUser) {
    return NextResponse.json(
      { success: false, error: 'Unauthorized. Please sign in.' },
      { status: 401 }
    )
  }

  try {
    // Check if allowed first
    const rateLimitResult = await rateLimitService.checkLimit(authUser.userId)

    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Rate limit exceeded',
          rateLimit: {
            currentUsage: rateLimitResult.currentUsage,
            limit: rateLimitResult.limit,
            resetDate: rateLimitResult.resetDate,
          },
        },
        { status: 429 }
      )
    }

    // Increment usage
    await rateLimitService.incrementUsage(authUser.userId)

    // Get updated status
    const updatedResult = await rateLimitService.checkLimit(authUser.userId)

    return NextResponse.json({
      success: true,
      message: 'Usage incremented',
      rateLimit: {
        currentUsage: updatedResult.currentUsage,
        limit: updatedResult.limit,
        remaining: updatedResult.remaining,
        resetDate: updatedResult.resetDate,
      },
    })
  } catch (error) {
    console.error('Rate limit increment error:', error)
    return NextResponse.json(
      { success: false, error: 'Failed to increment usage' },
      { status: 500 }
    )
  }
}
