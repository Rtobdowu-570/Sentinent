import { NextResponse } from 'next/server'
import { withAuth } from '@/lib/auth'
import { EmailGenerationService } from '@/lib/services/email-generation.service'
import { EmailContext } from '@/lib/types'

/**
 * POST /api/generate
 * 
 * Generates a personalized outreach email using AI
 * Requires authentication
 * 
 * Request body:
 * - companyName: string (required) - The name of the company
 * - description: string (required) - Company description
 * - newsArticles: array (optional) - Recent news articles about the company
 * - insights: array (optional) - Extracted insights about the company
 * - scrapedData: object (optional) - Additional scraped data
 * 
 * Response:
 * - success: boolean
 * - data: Object containing subject and body
 * - error: string (if failed)
 */
export const POST = withAuth(async (userId: string, request: Request) => {
  try {
    // Parse request body
    const body = await request.json()
    const { companyName, description, newsArticles, insights, scrapedData } = body

    // Validate required fields
    if (!companyName || typeof companyName !== 'string') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Company name is required and must be a string' 
        },
        { status: 400 }
      )
    }

    if (!description || typeof description !== 'string') {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Company description is required and must be a string' 
        },
        { status: 400 }
      )
    }

    // Validate companyName and description are not empty
    if (companyName.trim().length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Company name cannot be empty' 
        },
        { status: 400 }
      )
    }

    if (description.trim().length === 0) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Company description cannot be empty' 
        },
        { status: 400 }
      )
    }

    // Build email context
    const emailContext: EmailContext = {
      companyName,
      description,
      newsArticles: newsArticles || [],
      insights: insights || [],
      scrapedData: scrapedData || {},
    }

    // Create email generation service instance
    const emailGenerationService = new EmailGenerationService()

    // Generate the email
    const generatedEmail = await emailGenerationService.generateEmail(emailContext)

    // Validate that we got both subject and body
    if (!generatedEmail.subject || !generatedEmail.body) {
      return NextResponse.json(
        { 
          success: false, 
          error: 'Failed to generate complete email. Please try again.' 
        },
        { status: 500 }
      )
    }

    // Return successful response
    return NextResponse.json({
      success: true,
      data: {
        subject: generatedEmail.subject,
        body: generatedEmail.body,
      },
    })

  } catch (error) {
    console.error('Email generation error:', error)

    // Handle specific error types
    if (error instanceof Error) {
      // Check if it's a Gemini API error
      if (error.message.includes('GEMINI_API_KEY')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Email generation service is not configured. Please contact support.' 
          },
          { status: 503 }
        )
      }

      // Check if it's an API error
      if (error.message.includes('API') || error.message.includes('generation failed')) {
        return NextResponse.json(
          { 
            success: false, 
            error: 'Failed to generate email. Please try again.' 
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
        error: 'Failed to generate email. Please try again or contact support.' 
      },
      { status: 500 }
    )
  }
})
