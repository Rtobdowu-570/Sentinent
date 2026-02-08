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
   * Creates subscription record if it doesn't exist
   * 
   * @param userId - The user's ID
   * @returns RateLimitResult with allowed status and usage info
   */
  async checkLimit(userId: string): Promise<RateLimitResult> {
    // Get or create subscription
    let subscription = await prisma.subscription.findUnique({
      where: { userId },
    })

    // Create subscription if it doesn't exist
    if (!subscription) {
      subscription = await this.createSubscription(userId)
    }

    // Check if we need to reset monthly usage
    const now = new Date()
    if (now >= subscription.resetDate) {
      subscription = await this.resetMonthlyUsage(userId)
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
   * Increment user's monthly usage counter
   * Should be called after successful research creation
   * 
   * @param userId - The user's ID
   * @throws Error if subscription not found
   */
  async incrementUsage(userId: string): Promise<void> {
    await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      const subscription = await tx.subscription.findUnique({
        where: { userId },
      })

      if (!subscription) {
        throw new Error('Subscription not found')
      }

      await tx.subscription.update({
        where: { userId },
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
