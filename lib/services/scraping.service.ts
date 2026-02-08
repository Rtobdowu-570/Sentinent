import * as cheerio from 'cheerio';
import { chromium } from 'playwright';

export interface ScrapedData {
  companyName: string;
  description: string;
  industry?: string;
  size?: string;
  location?: string;
  rawHtml: string;
  metadata: Record<string, any>;
}

export interface CompanyInfo {
  companyName: string;
  description: string;
  industry?: string;
  size?: string;
  location?: string;
}

export class ScrapingService {
  /**
   * Main scraping method that orchestrates fallback strategies
   * Tries methods in order: Cheerio → Playwright → Jina AI Reader
   */
  async scrapeUrl(url: string): Promise<ScrapedData> {
    // Validate URL
    if (!this.isValidUrl(url)) {
      throw new Error('Invalid URL format');
    }

    const errors: string[] = [];

    // Strategy 1: Try Cheerio (fast, lightweight)
    try {
      console.log('Attempting to scrape with Cheerio...');
      const result = await this.scrapeWithCheerio(url);
      
      // Validate that we got meaningful data
      if (this.isValidScrapedData(result)) {
        console.log('Successfully scraped with Cheerio');
        return result;
      }
      
      errors.push('Cheerio: Insufficient data extracted');
    } catch (error) {
      errors.push(`Cheerio: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.log('Cheerio scraping failed, trying Playwright...');
    }

    // Strategy 2: Try Playwright (handles JavaScript)
    try {
      console.log('Attempting to scrape with Playwright...');
      const result = await this.scrapeWithPlaywright(url);
      
      // Validate that we got meaningful data
      if (this.isValidScrapedData(result)) {
        console.log('Successfully scraped with Playwright');
        return result;
      }
      
      errors.push('Playwright: Insufficient data extracted');
    } catch (error) {
      errors.push(`Playwright: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.log('Playwright scraping failed, trying Jina AI...');
    }

    // Strategy 3: Try Jina AI Reader (external service)
    try {
      console.log('Attempting to scrape with Jina AI...');
      const result = await this.scrapeWithJina(url);
      
      // Validate that we got meaningful data
      if (this.isValidScrapedData(result)) {
        console.log('Successfully scraped with Jina AI');
        return result;
      }
      
      errors.push('Jina AI: Insufficient data extracted');
    } catch (error) {
      errors.push(`Jina AI: ${error instanceof Error ? error.message : 'Unknown error'}`);
      console.log('Jina AI scraping failed');
    }

    // All strategies failed
    throw new Error(
      `All scraping methods failed for ${url}. Errors: ${errors.join('; ')}. ` +
      'Please try a different URL or check if the website is accessible.'
    );
  }

  /**
   * Validate URL format
   */
  private isValidUrl(url: string): boolean {
    try {
      const urlObj = new URL(url);
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:';
    } catch {
      return false;
    }
  }

  /**
   * Validate that scraped data contains meaningful information
   */
  private isValidScrapedData(data: ScrapedData): boolean {
    // Check that we have at least company name and description
    const hasCompanyName = Boolean(data.companyName && 
                          data.companyName !== 'Unknown Company' && 
                          data.companyName.length > 0);
    
    const hasDescription = Boolean(data.description && 
                          data.description !== 'No description available' && 
                          data.description.length > 20);

    return hasCompanyName && hasDescription;
  }

  /**
   * Scrape a URL using Jina AI Reader API
   */
  async scrapeWithJina(url: string): Promise<ScrapedData> {
    try {
      const jinaApiKey = process.env.JINA_API_KEY;
      
      if (!jinaApiKey) {
        throw new Error('JINA_API_KEY is not configured');
      }

      // Jina AI Reader API endpoint
      const jinaUrl = `https://r.jina.ai/${url}`;
      
      const response = await fetch(jinaUrl, {
        headers: {
          'Authorization': `Bearer ${jinaApiKey}`,
          'X-Return-Format': 'html',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();
      const companyInfo = this.extractCompanyInfo(html);

      return {
        ...companyInfo,
        rawHtml: html,
        metadata: {
          method: 'jina',
          url,
          scrapedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      throw new Error(`Jina AI scraping failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Scrape a URL using Playwright for JavaScript-rendered content
   */
  async scrapeWithPlaywright(url: string): Promise<ScrapedData> {
    let browser;
    try {
      browser = await chromium.launch({
        headless: true,
        args: ['--no-sandbox', '--disable-setuid-sandbox'],
      });

      const context = await browser.newContext({
        userAgent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
      });

      const page = await context.newPage();
      
      // Set timeout for navigation
      await page.goto(url, { 
        waitUntil: 'networkidle',
        timeout: 30000,
      });

      // Wait for content to load
      await page.waitForTimeout(2000);

      // Get the rendered HTML
      const html = await page.content();
      
      await browser.close();

      const companyInfo = this.extractCompanyInfo(html);

      return {
        ...companyInfo,
        rawHtml: html,
        metadata: {
          method: 'playwright',
          url,
          scrapedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      if (browser) {
        await browser.close();
      }
      throw new Error(`Playwright scraping failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Scrape a URL using Cheerio for static HTML parsing
   */
  async scrapeWithCheerio(url: string): Promise<ScrapedData> {
    try {
      const response = await fetch(url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36',
        },
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const html = await response.text();
      const companyInfo = this.extractCompanyInfo(html);

      return {
        ...companyInfo,
        rawHtml: html,
        metadata: {
          method: 'cheerio',
          url,
          scrapedAt: new Date().toISOString(),
        },
      };
    } catch (error) {
      throw new Error(`Cheerio scraping failed: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Extract company information from HTML using Cheerio
   */
  extractCompanyInfo(html: string): CompanyInfo {
    const $ = cheerio.load(html);

    // Extract company name from various possible locations
    const companyName = this.extractCompanyName($);
    
    // Extract description from meta tags and content
    const description = this.extractDescription($);
    
    // Extract optional fields
    const industry = this.extractIndustry($);
    const size = this.extractSize($);
    const location = this.extractLocation($);

    return {
      companyName,
      description,
      industry,
      size,
      location,
    };
  }

  private extractCompanyName($: cheerio.CheerioAPI): string {
    // Try multiple strategies to find company name
    const strategies = [
      // Meta tags
      () => $('meta[property="og:site_name"]').attr('content'),
      () => $('meta[name="application-name"]').attr('content'),
      () => $('meta[property="og:title"]').attr('content'),
      
      // Title tag
      () => $('title').text().split('|')[0].split('-')[0].trim(),
      
      // Common header selectors
      () => $('header h1').first().text().trim(),
      () => $('.logo').first().text().trim(),
      () => $('[class*="logo"]').first().text().trim(),
      () => $('h1').first().text().trim(),
    ];

    for (const strategy of strategies) {
      const result = strategy();
      if (result && result.length > 0 && result.length < 100) {
        return result;
      }
    }

    return 'Unknown Company';
  }

  private extractDescription($: cheerio.CheerioAPI): string {
    // Try multiple strategies to find description
    const strategies = [
      // Meta tags
      () => $('meta[name="description"]').attr('content'),
      () => $('meta[property="og:description"]').attr('content'),
      () => $('meta[name="twitter:description"]').attr('content'),
      
      // Common content selectors
      () => $('[class*="hero"] p').first().text().trim(),
      () => $('[class*="intro"] p').first().text().trim(),
      () => $('[class*="about"] p').first().text().trim(),
      () => $('main p').first().text().trim(),
      () => $('p').first().text().trim(),
    ];

    for (const strategy of strategies) {
      const result = strategy();
      if (result && result.length > 20 && result.length < 500) {
        return result;
      }
    }

    return 'No description available';
  }

  private extractIndustry($: cheerio.CheerioAPI): string | undefined {
    const strategies = [
      () => $('meta[property="og:type"]').attr('content'),
      () => $('[class*="industry"]').first().text().trim(),
      () => $('[itemprop="industry"]').text().trim(),
    ];

    for (const strategy of strategies) {
      const result = strategy();
      if (result && result.length > 0 && result.length < 100) {
        return result;
      }
    }

    return undefined;
  }

  private extractSize($: cheerio.CheerioAPI): string | undefined {
    const strategies = [
      () => $('[class*="company-size"]').first().text().trim(),
      () => $('[class*="employees"]').first().text().trim(),
      () => $('[itemprop="numberOfEmployees"]').text().trim(),
    ];

    for (const strategy of strategies) {
      const result = strategy();
      if (result && result.length > 0 && result.length < 100) {
        return result;
      }
    }

    return undefined;
  }

  private extractLocation($: cheerio.CheerioAPI): string | undefined {
    const strategies = [
      () => $('meta[property="og:locality"]').attr('content'),
      () => $('[class*="location"]').first().text().trim(),
      () => $('[itemprop="address"]').text().trim(),
      () => $('address').first().text().trim(),
    ];

    for (const strategy of strategies) {
      const result = strategy();
      if (result && result.length > 0 && result.length < 200) {
        return result;
      }
    }

    return undefined;
  }
}
