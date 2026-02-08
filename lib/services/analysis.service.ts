/**
 * AnalysisService - Handles news search and company analysis
 * 
 * This service integrates with Tavily and Perplexity APIs to search for
 * recent news articles and LinkedIn data about companies.
 */

export interface NewsArticle {
  title: string;
  url: string;
  publishedDate: Date;
  summary: string;
  source: string;
}

export interface LinkedInData {
  companyUrl: string;
  followers?: number;
  recentPosts?: string[];
  employees?: number;
}

export interface ScrapedData {
  companyName: string;
  description: string;
  industry?: string;
  size?: string;
  location?: string;
  rawHtml: string;
  metadata: Record<string, any>;
}

export class AnalysisService {
  private tavilyApiKey: string;
  private perplexityApiKey: string;

  constructor() {
    this.tavilyApiKey = process.env.TAVILY_API_KEY || '';
    this.perplexityApiKey = process.env.PERPLEXITY_API_KEY || '';
  }

  /**
   * Search for news articles about a company within a specified time window
   * @param companyName - Name of the company to search for
   * @param daysBack - Number of days to look back (default 90)
   * @returns Array of news articles
   */
  async searchNews(companyName: string, daysBack: number = 90): Promise<NewsArticle[]> {
    // Calculate the date threshold
    const dateThreshold = new Date();
    dateThreshold.setDate(dateThreshold.getDate() - daysBack);

    try {
      // Try Tavily first
      if (this.tavilyApiKey) {
        const articles = await this.searchWithTavily(companyName, dateThreshold);
        if (articles.length > 0) {
          return articles;
        }
      }

      // Fallback to Perplexity
      if (this.perplexityApiKey) {
        const articles = await this.searchWithPerplexity(companyName, dateThreshold);
        return articles;
      }

      console.warn('No news API keys configured');
      return [];
    } catch (error) {
      console.error('Error searching news:', error);
      return [];
    }
  }

  /**
   * Search for news using Tavily API
   */
  private async searchWithTavily(companyName: string, dateThreshold: Date): Promise<NewsArticle[]> {
    try {
      const response = await fetch('https://api.tavily.com/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          api_key: this.tavilyApiKey,
          query: `${companyName} news announcements funding product launch`,
          search_depth: 'advanced',
          include_domains: [],
          exclude_domains: [],
          max_results: 10,
        }),
      });

      if (!response.ok) {
        throw new Error(`Tavily API error: ${response.status}`);
      }

      const data = await response.json();
      const articles: NewsArticle[] = [];

      if (data.results && Array.isArray(data.results)) {
        for (const result of data.results) {
          // Parse published date if available
          let publishedDate = new Date();
          if (result.published_date) {
            publishedDate = new Date(result.published_date);
          }

          // Filter by date threshold
          if (publishedDate >= dateThreshold) {
            articles.push({
              title: result.title || '',
              url: result.url || '',
              publishedDate,
              summary: result.content || result.snippet || '',
              source: new URL(result.url).hostname,
            });
          }
        }
      }

      return articles;
    } catch (error) {
      console.error('Tavily search error:', error);
      throw error;
    }
  }

  /**
   * Search for news using Perplexity API
   */
  private async searchWithPerplexity(companyName: string, dateThreshold: Date): Promise<NewsArticle[]> {
    try {
      const response = await fetch('https://api.perplexity.ai/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.perplexityApiKey}`,
        },
        body: JSON.stringify({
          model: 'llama-3.1-sonar-small-128k-online',
          messages: [
            {
              role: 'system',
              content: 'You are a helpful assistant that finds recent news articles about companies. Return results in JSON format.',
            },
            {
              role: 'user',
              content: `Find recent news articles (within the last 90 days) about ${companyName}. Focus on announcements, funding rounds, product launches, and partnerships. Return a JSON array with fields: title, url, publishedDate (ISO format), summary, source.`,
            },
          ],
        }),
      });

      if (!response.ok) {
        throw new Error(`Perplexity API error: ${response.status}`);
      }

      const data = await response.json();
      const articles: NewsArticle[] = [];

      if (data.choices && data.choices[0]?.message?.content) {
        try {
          // Try to parse JSON from the response
          const content = data.choices[0].message.content;
          const jsonMatch = content.match(/\[[\s\S]*\]/);
          
          if (jsonMatch) {
            const parsedArticles = JSON.parse(jsonMatch[0]);
            
            for (const article of parsedArticles) {
              const publishedDate = new Date(article.publishedDate || article.published_date || Date.now());
              
              // Filter by date threshold
              if (publishedDate >= dateThreshold) {
                articles.push({
                  title: article.title || '',
                  url: article.url || '',
                  publishedDate,
                  summary: article.summary || article.content || '',
                  source: article.source || (article.url ? new URL(article.url).hostname : 'Unknown'),
                });
              }
            }
          }
        } catch (parseError) {
          console.error('Error parsing Perplexity response:', parseError);
        }
      }

      return articles;
    } catch (error) {
      console.error('Perplexity search error:', error);
      throw error;
    }
  }

  /**
   * Search for LinkedIn data about a company
   * Note: This is a placeholder implementation as LinkedIn API access is restricted
   * @param companyName - Name of the company
   * @returns LinkedIn data or null if unavailable
   */
  async searchLinkedIn(companyName: string): Promise<LinkedInData | null> {
    // LinkedIn API access is restricted and requires special partnership
    // This is a placeholder that returns null
    // In a production environment, you would either:
    // 1. Use LinkedIn's official API (requires partnership)
    // 2. Use a third-party service that provides LinkedIn data
    // 3. Use web scraping (against LinkedIn's ToS)
    
    console.log(`LinkedIn search for ${companyName} - not implemented (API access restricted)`);
    return null;
  }

  /**
   * Extract insights from scraped data and news articles
   * @param scrapedData - Data scraped from company website
   * @param news - Array of news articles
   * @returns Array of insight strings
   */
  extractInsights(scrapedData: ScrapedData, news: NewsArticle[]): string[] {
    const insights: string[] = [];

    // Extract insights from company data
    if (scrapedData.industry) {
      insights.push(`Company operates in the ${scrapedData.industry} industry`);
    }

    if (scrapedData.size) {
      insights.push(`Company size: ${scrapedData.size}`);
    }

    if (scrapedData.location) {
      insights.push(`Located in ${scrapedData.location}`);
    }

    // Extract insights from news articles
    if (news.length > 0) {
      insights.push(`Found ${news.length} recent news article${news.length > 1 ? 's' : ''}`);

      // Categorize news by keywords
      const fundingArticles = news.filter(article => 
        /funding|investment|raised|series|round/i.test(article.title + ' ' + article.summary)
      );
      
      const productArticles = news.filter(article =>
        /launch|release|announce|unveil|introduce/i.test(article.title + ' ' + article.summary)
      );
      
      const partnershipArticles = news.filter(article =>
        /partner|collaboration|alliance|agreement/i.test(article.title + ' ' + article.summary)
      );

      if (fundingArticles.length > 0) {
        insights.push(`Recent funding activity: ${fundingArticles[0].title}`);
      }

      if (productArticles.length > 0) {
        insights.push(`Recent product news: ${productArticles[0].title}`);
      }

      if (partnershipArticles.length > 0) {
        insights.push(`Recent partnership: ${partnershipArticles[0].title}`);
      }

      // Add most recent article as a general insight
      if (news.length > 0 && !fundingArticles.length && !productArticles.length && !partnershipArticles.length) {
        insights.push(`Latest news: ${news[0].title}`);
      }
    } else {
      insights.push('No recent news articles found');
    }

    return insights;
  }
}

// Export singleton instance
export const analysisService = new AnalysisService();
