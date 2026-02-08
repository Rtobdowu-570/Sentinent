import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth'
import { ScrapingService } from '@/lib/services/scraping.service'

/**
 * POST /api/scrape
 * 
 * Scrapes company information from a provided URL
 * Requires authentication
 * 
 * Request body:
 * - url: string (required) - The company website URL to scrape
 * 
 * Response:
 * - success: boolean
 * - data: ScrapedData object with company information
 * - error: string (if failed)
 */
export const POST = withAuth(async (userId: string, request: Request) => {
  try {
    // Parse request body
    const body = await request.json()
    const { url } = body

    // Validate URL is provided
    if (!url || typeof url !== 'string') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'URL is required and must be a string' 
        },
        { status: 400 }
      )
    }

    // Validate URL format
    try {
      new URL(url)
    } catch {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Invalid URL format. Please provide a valid HTTP or HTTPS URL.' 
        },
        { status: 400 }
      )
    }

    // Create scraping service instance
    const scrapingService = new ScrapingService()

    // Scrape the URL
    const scrapedData = await scrapingService.scrapeUrl(url)

    // Return successful response
    return NextResponse.json({
      success: true,
      data: scrapedData,
    })

  } catch (error) {
    console.error('Scraping error:', error)

    // Handle specific error types
    if (error instanceof Error) {
      // Check if it's a scraping failure
      if (error.message.includes('All scraping methods failed')) {
        return NextResponse.json(
          { 
            success: false, 
            error: error.message 
          },
          { status: 422 }
        )
      }

      // Check if it's a timeout or network error
      if (error.message.includes('timeout') || error.message.includes('network')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Request timeout or network error. Please try again or use a different URL.' 
          },
          { status: 504 }
        )
      }
    }

    // Generic error response
    return NextResponse.json(
      { 
        success: false, 
        error: 'Failed to scrape the provided URL. Please try again or contact support.' 
      },
      { status: 500 }
    )
  }
})
