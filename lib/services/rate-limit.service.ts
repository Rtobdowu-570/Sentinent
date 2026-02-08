import { prisma } from '@/lib/prisma'
import { Prisma } from '@prisma/client'

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  limit: number
  resetDate: Date
  currentUsage: number
}

export interface SubscriptionPlan {
  plan: 'free' | 'pro' | 'enterprise'
  limit: number
}

const PLAN_LIMITS: Record<string, number> = {
  free: 5,
  pro: 100,
  enterprise: 999999, // Effectively unlimited
}

/**
 * RateLimitService - Database-based rate limiting using Subscription table
 * 
 * This service manages user rate limits by tracking monthly usage in the database.
 * It provides methods to check limits, increment usage, and reset monthly counters.
 */
export class RateLimitService {
  /**
   * Check if user has remaining quota for the current month
   * Creates user and subscription record if they don't exist
   * 
   * @param clerkUserId - The Clerk user's ID
   * @returns RateLimitResult with allowed status and usage info
   */
  async checkLimit(clerkUserId: string): Promise<RateLimitResult> {
    // Ensure user exists in database first
    const user = await this.ensureUserExists(clerkUserId)
    
    // Get or create subscription
    let subscription = await prisma.subscription.findUnique({
      where: { userId: user.id },
    })

    // Create subscription if it doesn't exist
    if (!subscription) {
      subscription = await this.createSubscription(user.id)
    }

    // Check if we need to reset monthly usage
    const now = new Date()
    if (now >= subscription.resetDate) {
      subscription = await this.resetMonthlyUsage(user.id)
    }

    const allowed = subscription.monthlyUsage < subscription.monthlyLimit
    const remaining = Math.max(0, subscription.monthlyLimit - subscription.monthlyUsage)

    return {
      allowed,
      remaining,
      limit: subscription.monthlyLimit,
      resetDate: subscription.resetDate,
      currentUsage: subscription.monthlyUsage,
    }
  }

  /**
   * Ensure user exists in database, create if doesn't exist
   * 
   * @param clerkUserId - The Clerk user's ID
   * @returns User record
   */
  private async ensureUserExists(clerkUserId: string) {
    const { clerkClient } = await import('@clerk/nextjs/server')
    
    // Try to find user by clerkId
    let user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
    })

    if (!user) {
      // Get user info from Clerk
      const clerk = await clerkClient()
      const clerkUser = await clerk.users.getUser(clerkUserId)
      
      // Create user using upsert to handle race conditions
      user = await prisma.user.upsert({
        where: { clerkId: clerkUserId },
        update: {},
        create: {
          clerkId: clerkUserId,
          email: clerkUser.emailAddresses[0]?.emailAddress || '',
          name: clerkUser.firstName && clerkUser.lastName 
            ? `${clerkUser.firstName} ${clerkUser.lastName}`
            : clerkUser.username || null,
          imageUrl: clerkUser.imageUrl || null,
        },
      })
    }

    return user
  }

  /**
   * Increment user's monthly usage counter
   * Should be called after successful research creation
   * 
   * @param clerkUserId - The Clerk user's ID
   * @throws Error if subscription not found
   */
  async incrementUsage(clerkUserId: string): Promise<void> {
    // Get the Prisma user ID
    const user = await prisma.user.findUnique({
      where: { clerkId: clerkUserId },
      select: { id: true },
    })

    if (!user) {
      throw new Error('User not found')
    }

    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const subscription = await tx.subscription.findUnique({
        where: { userId: user.id },
      })

      if (!subscription) {
        throw new Error('Subscription not found')
      }

      await tx.subscription.update({
        where: { userId: user.id },
        data: {
          monthlyUsage: subscription.monthlyUsage + 1,
        },
      })
    })
  }

  /**
   * Reset monthly usage counter to zero and set next reset date
   * Called automatically when reset date is reached
   * 
   * @param userId - The user's ID
   * @returns Updated subscription
   */
  async resetMonthlyUsage(userId: string) {
    const nextResetDate = this.getNextResetDate()

    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      return await tx.subscription.update({
        where: { userId },
        data: {
          monthlyUsage: 0,
          resetDate: nextResetDate,
        },
      })
    })
  }

  /**
   * Create a new subscription for a user with default free plan
   * 
   * @param userId - The user's ID
   * @param plan - The subscription plan (default: 'free')
   * @returns Created subscription
   */
  async createSubscription(userId: string, plan: string = 'free') {
    const limit = PLAN_LIMITS[plan] || PLAN_LIMITS.free
    const resetDate = this.getNextResetDate()

    return await prisma.subscription.create({
      data: {
        userId,
        plan,
        monthlyLimit: limit,
        monthlyUsage: 0,
        resetDate,
      },
    })
  }

  /**
   * Update user's subscription plan and limit
   * 
   * @param userId - The user's ID
   * @param plan - The new subscription plan
   * @returns Updated subscription
   */
  async updatePlan(userId: string, plan: string) {
    const limit = PLAN_LIMITS[plan] || PLAN_LIMITS.free

    return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      return await tx.subscription.update({
        where: { userId },
        data: {
          plan,
          monthlyLimit: limit,
        },
      })
    })
  }

  /**
   * Get user's current subscription info
   * 
   * @param userId - The user's ID
   * @returns Subscription or null if not found
   */
  async getSubscription(userId: string) {
    return await prisma.subscription.findUnique({
      where: { userId },
    })
  }

  /**
   * Calculate the next reset date (first day of next month)
   * 
   * @returns Date object for the first day of next month at midnight UTC
   */
  private getNextResetDate(): Date {
    const now = new Date()
    const nextMonth = new Date(now.getFullYear(), now.getMonth() + 1, 1)
    return nextMonth
  }

  /**
   * Get remaining days until reset
   * 
   * @param resetDate - The reset date
   * @returns Number of days until reset
   */
  getDaysUntilReset(resetDate: Date): number {
    const now = new Date()
    const diff = resetDate.getTime() - now.getTime()
    return Math.ceil(diff / (1000 * 60 * 60 * 24))
  }
}

// Export singleton instance
export const rateLimitService = new RateLimitService()
