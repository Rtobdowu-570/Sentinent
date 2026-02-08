/**
 * Tests for AnalysisService
 */

import { AnalysisService, NewsArticle, ScrapedData } from '../analysis.service';

describe('AnalysisService', () => {
  let service: AnalysisService;

  beforeEach(() => {
    service = new AnalysisService();
  });

  describe('searchNews', () => {
    it('should return empty array when no API keys are configured', async () => {
      // Save original env vars
      const originalTavily = process.env.TAVILY_API_KEY;
      const originalPerplexity = process.env.PERPLEXITY_API_KEY;

      // Clear API keys
      delete process.env.TAVILY_API_KEY;
      delete process.env.PERPLEXITY_API_KEY;

      const serviceWithoutKeys = new AnalysisService();
      const articles = await serviceWithoutKeys.searchNews('Test Company', 90);

      expect(articles).toEqual([]);

      // Restore env vars
      if (originalTavily) process.env.TAVILY_API_KEY = originalTavily;
      if (originalPerplexity) process.env.PERPLEXITY_API_KEY = originalPerplexity;
    });

    it('should handle errors gracefully', async () => {
      const articles = await service.searchNews('', 90);
      expect(Array.isArray(articles)).toBe(true);
    });
  });

  describe('searchLinkedIn', () => {
    it('should return null as LinkedIn API is not available', async () => {
      const result = await service.searchLinkedIn('Test Company');
      expect(result).toBeNull();
    });
  });

  describe('extractInsights', () => {
    it('should extract insights from scraped data', () => {
      const scrapedData: ScrapedData = {
        companyName: 'Test Company',
        description: 'A test company',
        industry: 'Technology',
        size: '50-100 employees',
        location: 'San Francisco, CA',
        rawHtml: '<html></html>',
        metadata: {},
      };

      const insights = service.extractInsights(scrapedData, []);

      expect(insights).toContain('Company operates in the Technology industry');
      expect(insights).toContain('Company size: 50-100 employees');
      expect(insights).toContain('Located in San Francisco, CA');
      expect(insights).toContain('No recent news articles found');
    });

    it('should extract insights from news articles', () => {
      const scrapedData: ScrapedData = {
        companyName: 'Test Company',
        description: 'A test company',
        rawHtml: '<html></html>',
        metadata: {},
      };

      const news: NewsArticle[] = [
        {
          title: 'Company raises $10M in Series A funding',
          url: 'https://example.com/news1',
          publishedDate: new Date(),
          summary: 'The company announced a $10M Series A funding round',
          source: 'example.com',
        },
        {
          title: 'Company launches new product',
          url: 'https://example.com/news2',
          publishedDate: new Date(),
          summary: 'The company unveiled a new product today',
          source: 'example.com',
        },
      ];

      const insights = service.extractInsights(scrapedData, news);

      expect(insights).toContain('Found 2 recent news articles');
      expect(insights.some(i => i.includes('funding'))).toBe(true);
      expect(insights.some(i => i.includes('product'))).toBe(true);
    });

    it('should categorize funding news', () => {
      const scrapedData: ScrapedData = {
        companyName: 'Test Company',
        description: 'A test company',
        rawHtml: '<html></html>',
        metadata: {},
      };

      const news: NewsArticle[] = [
        {
          title: 'Company raises $10M in Series A funding',
          url: 'https://example.com/news1',
          publishedDate: new Date(),
          summary: 'Investment round completed',
          source: 'example.com',
        },
      ];

      const insights = service.extractInsights(scrapedData, news);

      expect(insights.some(i => i.includes('Recent funding activity'))).toBe(true);
    });

    it('should categorize product launch news', () => {
      const scrapedData: ScrapedData = {
        companyName: 'Test Company',
        description: 'A test company',
        rawHtml: '<html></html>',
        metadata: {},
      };

      const news: NewsArticle[] = [
        {
          title: 'Company launches revolutionary new platform',
          url: 'https://example.com/news1',
          publishedDate: new Date(),
          summary: 'New product announced today',
          source: 'example.com',
        },
      ];

      const insights = service.extractInsights(scrapedData, news);

      expect(insights.some(i => i.includes('Recent product news'))).toBe(true);
    });

    it('should categorize partnership news', () => {
      const scrapedData: ScrapedData = {
        companyName: 'Test Company',
        description: 'A test company',
        rawHtml: '<html></html>',
        metadata: {},
      };

      const news: NewsArticle[] = [
        {
          title: 'Company partners with major tech firm',
          url: 'https://example.com/news1',
          publishedDate: new Date(),
          summary: 'Strategic partnership announced',
          source: 'example.com',
        },
      ];

      const insights = service.extractInsights(scrapedData, news);

      expect(insights.some(i => i.includes('Recent partnership'))).toBe(true);
    });

    it('should handle news without specific categories', () => {
      const scrapedData: ScrapedData = {
        companyName: 'Test Company',
        description: 'A test company',
        rawHtml: '<html></html>',
        metadata: {},
      };

      const news: NewsArticle[] = [
        {
          title: 'Company updates their website',
          url: 'https://example.com/news1',
          publishedDate: new Date(),
          summary: 'Minor website update',
          source: 'example.com',
        },
      ];

      const insights = service.extractInsights(scrapedData, news);

      expect(insights.some(i => i.includes('Latest news'))).toBe(true);
    });
  });
});
