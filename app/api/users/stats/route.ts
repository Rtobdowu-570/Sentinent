import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/users/stats
 * Get user statistics including research counts, usage, and recent entries
 * 
 * Requirements: 9.1, 9.2, 9.3, 9.4, 9.5
 */
export const GET = withAuth(async (clerkUserId: string) => {
  try {
    // Get Prisma user ID from Clerk user ID
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
      select: { id: true },
    })

    if (!user) {
      return NextResponse.json(
        {
          success: false,
          error: 'User not found in database',
        },
        { status: 404 }
      )
    }

    // Calculate total research count (Requirement 9.1)
    const totalResearches = await prisma.research.count({
      where: { userId: user.id },
    })

    // Get subscription data for usage and limit (Requirements 9.2)
    let subscription = await prisma.subscription.findUnique({
      where: { userId: user.id },
    })

    // If no subscription exists, create a default free tier subscription
    if (!subscription) {
      const resetDate = new Date()
      resetDate.setMonth(resetDate.getMonth() + 1)
      resetDate.setDate(1)
      resetDate.setHours(0, 0, 0, 0)

      subscription = await prisma.subscription.create({
        data: {
          userId: user.id,
          plan: 'free',
          monthlyUsage: 0,
          monthlyLimit: 5,
          resetDate,
        },
      })
    }

    // Count favorites (Requirement 9.4)
    const favoritesCount = await prisma.research.count({
      where: {
        userId: user.id,
        isFavorite: true,
      },
    })

    // Calculate usage percentage (Requirement 9.5)
    const usagePercentage = subscription.monthlyLimit > 0
      ? Math.round((subscription.monthlyUsage / subscription.monthlyLimit) * 100)
      : 0

    // Fetch recent research entries (Requirement 9.3)
    const recentResearches = await prisma.research.findMany({
      where: { userId: user.id },
      orderBy: { generatedAt: 'desc' },
      take: 5,
      select: {
        id: true,
        companyName: true,
        companyUrl: true,
        generatedAt: true,
        isFavorite: true,
        tags: true,
        emailSubject: true,
      },
    })

    return NextResponse.json({
      success: true,
      stats: {
        totalResearches,
        monthlyUsage: subscription.monthlyUsage,
        monthlyLimit: subscription.monthlyLimit,
        favoritesCount,
        usagePercentage,
        recentResearches,
        plan: subscription.plan,
        resetDate: subscription.resetDate,
      },
    })
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
})
