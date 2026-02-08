// Shared TypeScript types for the application

export interface ScrapedData {
  companyName: string
  description: string
  industry?: string
  size?: string
  location?: string
  rawHtml: string
  metadata: Record<string, any>
}

export interface NewsArticle {
  title: string
  url: string
  publishedDate: Date
  summary: string
  source: string
}

export interface LinkedInData {
  companyUrl: string
  followers?: number
  recentPosts?: string[]
  employees?: number
}

export interface EmailContext {
  companyName: string
  description: string
  newsArticles: NewsArticle[]
  insights: string[]
  scrapedData: Record<string, any>
}

export interface GeneratedEmail {
  subject: string
  body: string
}

export interface RateLimitResult {
  allowed: boolean
  remaining: number
  limit: number
  resetDate: Date
}

export interface CompanyInfo {
  companyName: string
  description: string
  industry?: string
  size?: string
  location?: string
}
