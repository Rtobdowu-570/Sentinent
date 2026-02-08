import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'

/**
 * GET /api/researches/[id]
 * Get a single research by ID
 * 
 * Requirements: 6.4
 */
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get authenticated user
    const { userId } = await import('@clerk/nextjs/server').then(m => m.auth())
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Fetch research
    const research = await prisma.research.findUnique({
      where: { id },
    })

    // Check if research exists
    if (!research) {
      return NextResponse.json(
        { success: false, error: 'Research not found' },
        { status: 404 }
      )
    }

    // Check ownership
    if (research.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Forbidden. You do not own this research.' },
        { status: 403 }
      )
    }

    return NextResponse.json({
      success: true,
      research,
    })
  } catch (error) {
    console.error('Error fetching research:', error)
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

/**
 * PATCH /api/researches/[id]
 * Update a research entry
 * 
 * Requirements: 7.1, 7.2, 7.5, 10.4
 */
export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get authenticated user
    const { userId } = await import('@clerk/nextjs/server').then(m => m.auth())
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      )
    }

    const { id } = await params
    const body = await request.json()

    // Validate allowed fields
    const allowedFields = ['emailSubject', 'emailBody', 'isFavorite', 'tags']
    const updateData: any = {}

    for (const field of allowedFields) {
      if (field in body) {
        updateData[field] = body[field]
      }
    }

    // Check if there's anything to update
    if (Object.keys(updateData).length === 0) {
      return NextResponse.json(
        { success: false, error: 'No valid fields to update' },
        { status: 400 }
      )
    }

    // Fetch research to check ownership
    const existingResearch = await prisma.research.findUnique({
      where: { id },
    })

    if (!existingResearch) {
      return NextResponse.json(
        { success: false, error: 'Research not found' },
        { status: 404 }
      )
    }

    // Check ownership
    if (existingResearch.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Forbidden. You do not own this research.' },
        { status: 403 }
      )
    }

    // Update research
    const research = await prisma.research.update({
      where: { id },
      data: updateData,
    })

    return NextResponse.json({
      success: true,
      research,
    })
  } catch (error) {
    console.error('Error updating research:', error)
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

/**
 * DELETE /api/researches/[id]
 * Delete a research entry
 * 
 * Requirements: 6.5
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    // Get authenticated user
    const { userId } = await import('@clerk/nextjs/server').then(m => m.auth())
    
    if (!userId) {
      return NextResponse.json(
        { success: false, error: 'Unauthorized. Please sign in.' },
        { status: 401 }
      )
    }

    const { id } = await params

    // Fetch research to check ownership
    const existingResearch = await prisma.research.findUnique({
      where: { id },
    })

    if (!existingResearch) {
      return NextResponse.json(
        { success: false, error: 'Research not found' },
        { status: 404 }
      )
    }

    // Check ownership
    if (existingResearch.userId !== userId) {
      return NextResponse.json(
        { success: false, error: 'Forbidden. You do not own this research.' },
        { status: 403 }
      )
    }

    // Delete research
    await prisma.research.delete({
      where: { id },
    })

    return NextResponse.json({
      success: true,
      message: 'Research deleted successfully',
    })
  } catch (error) {
    console.error('Error deleting research:', error)
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
