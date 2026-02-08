import { NextRequest, NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth'
import { prisma } from '@/lib/prisma'
import { ScrapingService } from '@/lib/services/scraping.service'
import { AnalysisService } from '@/lib/services/analysis.service'
import { EmailGenerationService } from '@/lib/services/email-generation.service'
import { rateLimitService } from '@/lib/services/rate-limit.service'
import { Prisma } from '@prisma/client'

/**
 * POST /api/researches
 * Create a new research by scraping, analyzing, and generating email
 * 
 * Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.7, 8.6
 */
export const POST = withAuth(async (userId: string, request: Request) => {
  try {
    const body = await request.json()
    const { companyUrl } = body

    // Validate input
    if (!companyUrl || typeof companyUrl !== 'string') {
      return NextResponse.json(
        { success: false, error: 'Company URL is required' },
        { status: 400 }
      )
    }

    // Check rate limits
    const rateLimitResult = await rateLimitService.checkLimit(userId)
    if (!rateLimitResult.allowed) {
      return NextResponse.json(
        {
          success: false,
          error: 'Monthly research limit exceeded',
          upgradeUrl: '/pricing',
          limit: rateLimitResult.limit,
          usage: rateLimitResult.currentUsage,
          resetDate: rateLimitResult.resetDate,
        },
        { status: 429 }
      )
    }

    // Initialize services
    const scrapingService = new ScrapingService()
    const analysisService = new AnalysisService()
    const emailService = new EmailGenerationService()

    // Step 1: Scrape company website
    let scrapedData
    try {
      scrapedData = await scrapingService.scrapeUrl(companyUrl)
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to scrape company website',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 400 }
      )
    }

    // Step 2: Search for news articles
    const newsArticles = await analysisService.searchNews(scrapedData.companyName, 90)

    // Step 3: Search for LinkedIn data (optional)
    const linkedinData = await analysisService.searchLinkedIn(scrapedData.companyName)

    // Step 4: Extract insights
    const insights = analysisService.extractInsights(scrapedData, newsArticles)

    // Step 5: Generate personalized email
    let generatedEmail
    try {
      generatedEmail = await emailService.generateEmail({
        companyName: scrapedData.companyName,
        description: scrapedData.description,
        newsArticles,
        insights,
        scrapedData: {
          industry: scrapedData.industry,
          size: scrapedData.size,
          location: scrapedData.location,
        },
      })
    } catch (error) {
      return NextResponse.json(
        {
          success: false,
          error: 'Failed to generate email',
          details: error instanceof Error ? error.message : 'Unknown error',
        },
        { status: 500 }
      )
    }

    // Step 6 & 7: Save research and increment usage in a transaction
    // This ensures atomicity - either both operations succeed or both fail
    const research = await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
      // Create research
      const newResearch = await tx.research.create({
        data: {
          userId,
          companyUrl,
          companyName: scrapedData.companyName,
          scrapedData: scrapedData as any,
          newsArticles: newsArticles as any,
          linkedinData: linkedinData as any,
          emailSubject: generatedEmail.subject,
          emailBody: generatedEmail.body,
          insights: insights as any,
          status: 'completed',
        },
      })

      // Increment usage counter
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

      return newResearch
    })

    // Return complete research object
    return NextResponse.json({
      success: true,
      research,
    })
  } catch (error) {
    console.error('Error creating research:', error)
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

/**
 * GET /api/researches
 * List all researches for authenticated user with pagination, search, and filtering
 * 
 * Requirements: 6.2, 6.3, 7.3, 7.4
 */
export async function GET(request: NextRequest) {
  try {
    // Get authenticated user
    const { userId } = await import('@clerk/nextjs/server').then(m => m.auth())
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      )
    }

    // Parse query parameters
    const searchParams = request.nextUrl.searchParams
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const search = searchParams.get('search') || ''
    const isFavorite = searchParams.get('favorite') === 'true'
    const tag = searchParams.get('tag') || ''

    // Build where clause
    const where: any = { userId }

    // Add search filter
    if (search) {
      where.OR = [
        { companyName: { contains: search, mode: 'insensitive' } },
        { companyUrl: { contains: search, mode: 'insensitive' } },
        { tags: { has: search } },
      ]
    }

    // Add favorite filter
    if (isFavorite) {
      where.isFavorite = true
    }

    // Add tag filter
    if (tag) {
      where.tags = { has: tag }
    }

    // Get total count
    const total = await prisma.research.count({ where })

    // Get paginated results
    const researches = await prisma.research.findMany({
      where,
      orderBy: { generatedAt: 'desc' },
      skip: (page - 1) * limit,
      take: limit,
    })

    return NextResponse.json({
      success: true,
      researches,
      total,
      page,
      limit,
      totalPages: Math.ceil(total / limit),
    })
  } catch (error) {
    console.error('Error fetching researches:', error)
    return NextResponse.json(
      {
        success: false,
        error: 'An unexpected error occurred',
        details: error instanceof Error ? error.message : 'Unknown error',
      },
      { status: 500 }
    )
  }
}
