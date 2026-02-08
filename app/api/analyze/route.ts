import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth'
import { AnalysisService } from '@/lib/services/analysis.service'

/**
 * POST /api/analyze
 * 
 * Analyzes scraped company data by searching for news articles and LinkedIn data
 * Requires authentication
 * 
 * Request body:
 * - companyName: string (required) - The name of the company to analyze
 * - scrapedData: object (optional) - Additional scraped data for context
 * 
 * Response:
 * - success: boolean
 * - data: Object containing newsArticles, linkedinData, and insights
 * - error: string (if failed)
 */
export const POST = withAuth(async (userId: string, request: Request) => {
  try {
    // Parse request body
    const body = await request.json()
    const { companyName, scrapedData } = body

    // Validate companyName is provided
    if (!companyName || typeof companyName !== 'string') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Company name is required and must be a string' 
        },
        { status: 400 }
      )
    }

    // Validate companyName is not empty
    if (companyName.trim().length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Company name cannot be empty' 
        },
        { status: 400 }
      )
    }

    // Create analysis service instance
    const analysisService = new AnalysisService()

    // Search for news articles (last 90 days)
    const newsArticles = await analysisService.searchNews(companyName, 90)

    // Search for LinkedIn data
    const linkedinData = await analysisService.searchLinkedIn(companyName)

    // Extract insights from scraped data and news
    const insights = analysisService.extractInsights(
      scrapedData || { 
        companyName, 
        description: '', 
        rawHtml: '', 
        metadata: {} 
      },
      newsArticles
    )

    // Return successful response
    return NextResponse.json({
      success: true,
      data: {
        newsArticles,
        linkedinData,
        insights,
      },
    })

  } catch (error) {
    console.error('Analysis error:', error)

    // Handle specific error types
    if (error instanceof Error) {
      // Check if it's an API error
      if (error.message.includes('API error')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'External API error. Please try again later.' 
          },
          { status: 503 }
        )
      }

      // Check if it's a timeout error
      if (error.message.includes('timeout')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Request timeout. Please try again.' 
          },
          { status: 504 }
        )
      }
    }

    // Generic error response
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to analyze company data. Please try again or contact support.' 
      },
      { status: 500 }
    )
  }
})
