import { EmailGenerationService } from '../email-generation.service'
import { EmailContext } from '@/lib/types'

// Mock the Google Generative AI
jest.mock('@google/generative-ai', () => {
  return {
    GoogleGenerativeAI: jest.fn().mockImplementation(() => ({
      getGenerativeModel: jest.fn().mockReturnValue({
        generateContent: jest.fn().mockResolvedValue({
          response: {
            text: jest.fn().mockReturnValue(
              'SUBJECT: Exciting partnership opportunity\n\nBODY:\nHello,\n\nI noticed your recent product launch and would love to discuss potential collaboration opportunities.\n\nBest regards'
            )
          }
        })
      })
    }))
  }
})

describe('EmailGenerationService', () => {
  let service: EmailGenerationService
  
  beforeEach(() => {
    // Set required environment variable
    process.env.GEMINI_API_KEY = 'test-api-key'
    service = new EmailGenerationService()
  })

  afterEach(() => {
    jest.clearAllMocks()
  })

  describe('buildPrompt', () => {
    it('should build a prompt with company information', () => {
      const context: EmailContext = {
        companyName: 'Acme Corp',
        description: 'A leading technology company',
        newsArticles: [],
        insights: [],
        scrapedData: {}
      }

      const prompt = service.buildPrompt(context)

      expect(prompt).toContain('Acme Corp')
      expect(prompt).toContain('A leading technology company')
      expect(prompt).toContain('COMPANY INFORMATION')
    })

    it('should include news articles in the prompt', () => {
      const context: EmailContext = {
        companyName: 'Acme Corp',
        description: 'A leading technology company',
        newsArticles: [
          {
            title: 'Acme Corp launches new product',
            url: 'https://example.com/news',
            publishedDate: new Date('2024-01-15'),
            summary: 'Company announces innovative solution',
            source: 'TechNews'
          }
        ],
        insights: [],
        scrapedData: {}
      }

      const prompt = service.buildPrompt(context)

      expect(prompt).toContain('RECENT NEWS & UPDATES')
      expect(prompt).toContain('Acme Corp launches new product')
      expect(prompt).toContain('Company announces innovative solution')
    })

    it('should include insights in the prompt', () => {
      const context: EmailContext = {
        companyName: 'Acme Corp',
        description: 'A leading technology company',
        newsArticles: [],
        insights: ['Recently raised Series A funding', 'Expanding into new markets'],
        scrapedData: {}
      }

      const prompt = service.buildPrompt(context)

      expect(prompt).toContain('KEY INSIGHTS')
      expect(prompt).toContain('Recently raised Series A funding')
      expect(prompt).toContain('Expanding into new markets')
    })

    it('should include optional company details when available', () => {
      const context: EmailContext = {
        companyName: 'Acme Corp',
        description: 'A leading technology company',
        newsArticles: [],
        insights: [],
        scrapedData: {
          industry: 'Technology',
          size: '100-500 employees',
          location: 'San Francisco, CA'
        }
      }

      const prompt = service.buildPrompt(context)

      expect(prompt).toContain('Industry: Technology')
      expect(prompt).toContain('Company Size: 100-500 employees')
      expect(prompt).toContain('Location: San Francisco, CA')
    })
  })

  describe('generateEmail', () => {
    it('should generate an email with subject and body', async () => {
      const context: EmailContext = {
        companyName: 'Acme Corp',
        description: 'A leading technology company',
        newsArticles: [],
        insights: [],
        scrapedData: {}
      }

      const result = await service.generateEmail(context)

      expect(result).toHaveProperty('subject')
      expect(result).toHaveProperty('body')
      expect(result.subject).toBeTruthy()
      expect(result.body).toBeTruthy()
    })

    it('should throw an error if generation fails', async () => {
      const context: EmailContext = {
        companyName: 'Acme Corp',
        description: 'A leading technology company',
        newsArticles: [],
        insights: [],
        scrapedData: {}
      }

      // Mock a failure
      const mockModel = {
        generateContent: jest.fn().mockRejectedValue(new Error('API Error'))
      }
      
      ;(service as any).model = mockModel

      await expect(service.generateEmail(context)).rejects.toThrow('Email generation failed')
    })
  })
})
