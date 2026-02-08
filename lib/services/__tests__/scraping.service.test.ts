import { ScrapingService } from '../scraping.service';

// Mock cheerio to avoid ESM issues in Jest
jest.mock('cheerio', () => ({
  load: jest.fn((html: string) => {
    // Simple mock implementation
    return {
      text: jest.fn(() => 'Acme Corp - Leading Innovation'),
      first: jest.fn(() => ({
        text: jest.fn(() => 'Acme Corp '),
        attr: jest.fn(() => undefined),
      })),
      attr: jest.fn((attr: string) => {
        if (attr === 'content') {
          return 'Acme Corp is a leading technology company focused on innovation and excellence in software development.';
        }
        return undefined;
      }),
    };
  }),
}));

// Mock playwright to avoid initialization issues in Jest
jest.mock('playwright', () => ({
  chromium: {
    launch: jest.fn(),
  },
}));

describe('ScrapingService', () => {
  let service: ScrapingService;

  beforeEach(() => {
    service = new ScrapingService();
    jest.clearAllMocks();
  });

  describe('scrapeUrl', () => {
    it('should throw error for invalid URL format', async () => {
      await expect(service.scrapeUrl('not-a-valid-url'))
        .rejects
        .toThrow('Invalid URL format');
    });

    it('should throw error when all scraping methods fail', async () => {
      // Mock all methods to fail
      jest.spyOn(service, 'scrapeWithCheerio').mockRejectedValue(new Error('Cheerio failed'));
      jest.spyOn(service, 'scrapeWithPlaywright').mockRejectedValue(new Error('Playwright failed'));
      jest.spyOn(service, 'scrapeWithJina').mockRejectedValue(new Error('Jina failed'));

      await expect(service.scrapeUrl('https://example.com'))
        .rejects
        .toThrow('All scraping methods failed');
    });
  });

  describe('scrapeWithCheerio', () => {
    it('should throw error for network failures', async () => {
      // Mock fetch to simulate network error
      global.fetch = jest.fn().mockRejectedValue(new Error('Network error'));

      await expect(service.scrapeWithCheerio('https://invalid-url-that-does-not-exist.com'))
        .rejects
        .toThrow('Cheerio scraping failed');
    });
  });
});
