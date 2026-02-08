/**
 * @jest-environment node
 */

import { GET } from '../route'
import { prisma } from '@/lib/prisma'
import { auth } from '@clerk/nextjs/server'

// Mock dependencies
jest.mock('@clerk/nextjs/server', () => ({
  auth: jest.fn(),
}))

jest.mock('@/lib/prisma', () => ({
  prisma: {
    research: {
      count: jest.fn(),
      findMany: jest.fn(),
    },
    subscription: {
      findUnique: jest.fn(),
      create: jest.fn(),
    },
  },
}))

describe('GET /api/users/stats', () => {
  const mockUserId = 'user_123'

  // Create a mock request object
  const createMockRequest = () => ({
    url: 'http://localhost:3000/api/users/stats',
    method: 'GET',
    headers: new Headers(),
  })

  beforeEach(() => {
    jest.clearAllMocks()
    ;(auth as unknown as jest.Mock).mockResolvedValue({ userId: mockUserId })
  })

  it('should return user statistics with all required fields', async () => {
    // Mock data
    const mockSubscription = {
      id: 'sub_123',
      userId: mockUserId,
      plan: 'free',
      monthlyUsage: 3,
      monthlyLimit: 5,
      resetDate: new Date('2026-03-01'),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    const mockRecentResearches = [
      {
        id: 'research_1',
        companyName: 'Company A',
        companyUrl: 'https://companya.com',
        generatedAt: new Date('2026-02-08T00:00:00.000Z'),
        isFavorite: true,
        tags: ['tech', 'startup'],
        emailSubject: 'Subject A',
      },
      {
        id: 'research_2',
        companyName: 'Company B',
        companyUrl: 'https://companyb.com',
        generatedAt: new Date('2026-02-07T00:00:00.000Z'),
        isFavorite: false,
        tags: ['finance'],
        emailSubject: 'Subject B',
      },
    ]

    // Setup mocks
    ;(prisma.research.count as jest.Mock)
      .mockResolvedValueOnce(10) // totalResearches
      .mockResolvedValueOnce(4) // favoritesCount
    
    ;(prisma.subscription.findUnique as jest.Mock).mockResolvedValue(mockSubscription)
    ;(prisma.research.findMany as jest.Mock).mockResolvedValue(mockRecentResearches)

    // Execute
    const mockRequest = createMockRequest()
    const response = await GET(mockRequest as any)
    const data = await response.json()

    // Verify
    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.stats).toMatchObject({
      totalResearches: 10,
      monthlyUsage: 3,
      monthlyLimit: 5,
      favoritesCount: 4,
      usagePercentage: 60,
      plan: 'free',
    })
    expect(data.stats.recentResearches).toHaveLength(2)
    expect(data.stats.recentResearches[0].companyName).toBe('Company A')
    expect(data.stats.recentResearches[1].companyName).toBe('Company B')
  })

  it('should create default subscription if none exists', async () => {
    const mockNewSubscription = {
      id: 'sub_new',
      userId: mockUserId,
      plan: 'free',
      monthlyUsage: 0,
      monthlyLimit: 5,
      resetDate: new Date('2026-03-01'),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    // Setup mocks - no existing subscription
    ;(prisma.research.count as jest.Mock)
      .mockResolvedValueOnce(0)
      .mockResolvedValueOnce(0)
    
    ;(prisma.subscription.findUnique as jest.Mock).mockResolvedValue(null)
    ;(prisma.subscription.create as jest.Mock).mockResolvedValue(mockNewSubscription)
    ;(prisma.research.findMany as jest.Mock).mockResolvedValue([])

    // Execute
    const mockRequest = createMockRequest()
    const response = await GET(mockRequest as any)
    const data = await response.json()

    // Verify subscription was created
    expect(prisma.subscription.create).toHaveBeenCalledWith({
      data: expect.objectContaining({
        userId: mockUserId,
        plan: 'free',
        monthlyUsage: 0,
        monthlyLimit: 5,
      }),
    })

    expect(response.status).toBe(200)
    expect(data.success).toBe(true)
    expect(data.stats.totalResearches).toBe(0)
    expect(data.stats.monthlyUsage).toBe(0)
    expect(data.stats.monthlyLimit).toBe(5)
  })

  it('should calculate usage percentage correctly', async () => {
    const mockSubscription = {
      id: 'sub_123',
      userId: mockUserId,
      plan: 'pro',
      monthlyUsage: 75,
      monthlyLimit: 100,
      resetDate: new Date('2026-03-01'),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    ;(prisma.research.count as jest.Mock)
      .mockResolvedValueOnce(150)
      .mockResolvedValueOnce(20)
    
    ;(prisma.subscription.findUnique as jest.Mock).mockResolvedValue(mockSubscription)
    ;(prisma.research.findMany as jest.Mock).mockResolvedValue([])

    const mockRequest = createMockRequest()
    const response = await GET(mockRequest as any)
    const data = await response.json()

    expect(data.stats.usagePercentage).toBe(75)
  })

  it('should return 401 if user is not authenticated', async () => {
    ;(auth as unknown as jest.Mock).mockResolvedValue({ userId: null })

    const mockRequest = createMockRequest()
    const response = await GET(mockRequest as any)
    const data = await response.json()

    expect(response.status).toBe(401)
    expect(data.success).toBe(false)
    expect(data.error).toBe('Unauthorized. Please sign in.')
  })

  it('should handle errors gracefully', async () => {
    ;(prisma.research.count as jest.Mock).mockRejectedValue(new Error('Database error'))

    const mockRequest = createMockRequest()
    const response = await GET(mockRequest as any)
    const data = await response.json()

    expect(response.status).toBe(500)
    expect(data.success).toBe(false)
    expect(data.error).toBe('An unexpected error occurred')
  })

  it('should fetch recent researches with correct limit', async () => {
    const mockSubscription = {
      id: 'sub_123',
      userId: mockUserId,
      plan: 'free',
      monthlyUsage: 2,
      monthlyLimit: 5,
      resetDate: new Date('2026-03-01'),
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    ;(prisma.research.count as jest.Mock)
      .mockResolvedValueOnce(10)
      .mockResolvedValueOnce(3)
    
    ;(prisma.subscription.findUnique as jest.Mock).mockResolvedValue(mockSubscription)
    ;(prisma.research.findMany as jest.Mock).mockResolvedValue([])

    const mockRequest = createMockRequest()
    await GET(mockRequest as any)

    // Verify findMany was called with correct parameters
    expect(prisma.research.findMany).toHaveBeenCalledWith({
      where: { userId: mockUserId },
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
  })
})
