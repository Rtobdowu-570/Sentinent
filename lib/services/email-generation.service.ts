import { GoogleGenerativeAI } from '@google/generative-ai'
import { EmailContext, GeneratedEmail } from '@/lib/types'

/**
 * EmailGenerationService
 * 
 * Handles AI-powered email generation using Google's Gemini API.
 * Creates personalized outreach emails based on company context and news.
 */
export class EmailGenerationService {
  private genAI: GoogleGenerativeAI
  private model: any

  constructor() {
    const apiKey = process.env.GEMINI_API_KEY
    
    if (!apiKey) {
      throw new Error('GEMINI_API_KEY environment variable is not set')
    }

    this.genAI = new GoogleGenerativeAI(apiKey)
    // Use gemini-2.5-flash for faster, cost-effective generation
    // Alternative: 'gemini-2.5-pro' for more advanced capabilities
    this.model = this.genAI.getGenerativeModel({ model: 'gemini-2.5-flash' })
  }

  /**
   * Build a structured prompt for the AI model
   * Includes company information, news articles, and insights
   */
  buildPrompt(context: EmailContext): string {
    const { companyName, description, newsArticles, insights, scrapedData } = context

    let prompt = `You are an expert sales professional writing a personalized outreach email.

COMPANY INFORMATION:
- Company Name: ${companyName}
- Description: ${description}`

    // Add optional company details
    if (scrapedData.industry) {
      prompt += `\n- Industry: ${scrapedData.industry}`
    }
    if (scrapedData.size) {
      prompt += `\n- Company Size: ${scrapedData.size}`
    }
    if (scrapedData.location) {
      prompt += `\n- Location: ${scrapedData.location}`
    }

    // Add news articles if available
    if (newsArticles && newsArticles.length > 0) {
      prompt += `\n\nRECENT NEWS & UPDATES:`
      newsArticles.slice(0, 5).forEach((article, index) => {
        prompt += `\n${index + 1}. ${article.title}`
        if (article.summary) {
          prompt += `\n   Summary: ${article.summary}`
        }
        prompt += `\n   Source: ${article.source} (${article.publishedDate})`
      })
    }

    // Add insights if available
    if (insights && insights.length > 0) {
      prompt += `\n\nKEY INSIGHTS:`
      insights.forEach((insight, index) => {
        prompt += `\n${index + 1}. ${insight}`
      })
    }

    prompt += `\n\nTASK:
Write a personalized outreach email to ${companyName}. The email should:
1. Reference specific recent news or company information
2. Be professional yet conversational in tone
3. Be concise (2-3 short paragraphs maximum)
4. Include a clear value proposition
5. End with a soft call-to-action

FORMAT YOUR RESPONSE EXACTLY AS:
SUBJECT: [Your subject line here]

BODY:
[Your email body here]

Do not include any other text, explanations, or formatting outside of this structure.`

    return prompt
  }

  /**
   * Generate a personalized email using Gemini API
   * Returns both subject line and email body
   */
  async generateEmail(context: EmailContext): Promise<GeneratedEmail> {
    try {
      // Build the prompt with all context
      const prompt = this.buildPrompt(context)

      // Call Gemini API
      const result = await this.model.generateContent(prompt)
      const response = await result.response
      const text = response.text()

      // Parse the response to extract subject and body
      const parsed = this.parseEmailResponse(text, context.companyName)

      // Validate that we got both subject and body
      if (!parsed.subject || !parsed.body) {
        throw new Error('Failed to generate complete email: missing subject or body')
      }

      return parsed
    } catch (error) {
      console.error('Error generating email:', error)
      throw new Error(
        `Email generation failed: ${error instanceof Error ? error.message : 'Unknown error'}`
      )
    }
  }

  /**
   * Parse the AI response to extract subject and body
   * Handles various response formats
   */
  private parseEmailResponse(text: string, companyName?: string): GeneratedEmail {
    // Try to extract subject line
    const subjectMatch = text.match(/SUBJECT:\s*(.+?)(?:\n|$)/i)
    const subject = subjectMatch ? subjectMatch[1].trim() : ''

    // Try to extract body
    const bodyMatch = text.match(/BODY:\s*([\s\S]+?)(?:\n\n---|\n\nNote:|$)/i)
    let body = bodyMatch ? bodyMatch[1].trim() : ''

    // If structured parsing fails, try alternative formats
    if (!subject || !body) {
      // Split by double newlines and look for patterns
      const lines = text.split('\n')
      let foundSubject = false
      let foundBody = false
      let bodyLines: string[] = []

      for (let i = 0; i < lines.length; i++) {
        const line = lines[i].trim()
        
        if (!foundSubject && line.toLowerCase().includes('subject:')) {
          const subjectText = line.replace(/subject:/i, '').trim()
          if (subjectText) {
            return {
              subject: subjectText,
              body: lines.slice(i + 1).join('\n').trim()
            }
          }
        }

        if (line.toLowerCase().includes('body:')) {
          foundBody = true
          continue
        }

        if (foundBody) {
          bodyLines.push(line)
        }
      }

      if (bodyLines.length > 0) {
        body = bodyLines.join('\n').trim()
      }
    }

    // Final fallback: use the entire text as body with a generic subject
    if (!body) {
      body = text.trim()
    }

    if (!subject) {
      // Generate a generic subject if parsing failed
      return {
        subject: companyName 
          ? `Exploring partnership opportunities with ${companyName}`
          : 'Exploring partnership opportunities',
        body
      }
    }

    return { subject, body }
  }
}

// Export a singleton instance
export const emailGenerationService = new EmailGenerationService()
