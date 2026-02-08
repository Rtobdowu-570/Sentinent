# Implementation Plan: Agentic Outreach Researcher

## Overview

This implementation plan breaks down the Agentic Outreach Researcher application into discrete, incremental coding tasks. The approach follows a bottom-up strategy: setting up infrastructure first, then building core services, followed by API routes, and finally the frontend. Each task builds on previous work, with testing integrated throughout to catch errors early.

## Tasks

- [x] 1. Project setup and infrastructure
  - Initialize Next.js 14 project with TypeScript and App Router
  - Configure Tailwind CSS and install shadcn/ui components
  - Set up Prisma with Vercel Postgres connection
  - Configure environment variables for all external services
  - Install dependencies: Clerk, Cheerio, Playwright, fast-check, Framer Motion
  - _Requirements: All requirements depend on proper setup_

- [x] 2. Database schema and migrations
  - [x] 2.1 Create Prisma schema with User, Research, and Subscription models
    - Define all fields, relations, and indexes as specified in design
    - _Requirements: 1.2, 6.1, 8.1, 14.1_
  
  - [x] 2.2 Generate and run initial migration
    - Create database tables and apply schema
    - _Requirements: 14.1_
  
  - [ ]* 2.3 Write property test for database schema integrity
    - **Property 36: Atomic Research Creation**
    - **Validates: Requirements 14.1**

- [x] 3. Authentication setup with Clerk
  - [x] 3.1 Configure Clerk authentication provider
    - Set up Clerk middleware for Next.js App Router
    - Configure sign-in options (email, Google, Username)
    - _Requirements: 1.1, 1.2, 1.3_
  
  - [x] 3.2 Create authentication middleware for API routes
    - Implement middleware to verify Clerk session tokens
    - Add user ID extraction from session
    - _Requirements: 1.5_
  
  - [ ]* 3.3 Write property tests for authentication flow
    - **Property 2: Authentication Redirects to Dashboard**
    - **Property 4: Protected Routes Require Authentication**
    - **Validates: Requirements 1.3, 1.5**

- [x] 4. Implement rate limiting service
  - [x] 4.1 Set up Upstash Redis connection
    - Configure Redis client with connection pooling
    - _Requirements: 8.1_
  
  - [x] 4.2 Create RateLimitService with usage tracking
    - Implement checkLimit() to verify user's monthly usage
    - Implement incrementUsage() to update counters
    - Implement resetMonthlyUsage() for monthly resets
    - _Requirements: 8.1, 8.2, 8.3, 8.4, 8.5, 8.6_
  
  - [ ]* 4.3 Write property tests for rate limiting
    - **Property 23: Rate Limit Enforcement**
    - **Property 24: Usage Counter Increment**
    - **Property 25: Monthly Usage Reset**
    - **Validates: Requirements 8.1, 8.4, 8.6, 8.5**

- [x] 5. Implement web scraping service
  - [x] 5.1 Create ScrapingService with Cheerio implementation
    - Implement scrapeWithCheerio() for static HTML parsing
    - Implement extractCompanyInfo() to parse company data
    - _Requirements: 3.1, 3.3_
  
  - [x] 5.2 Add Playwright browser automation
    - Implement scrapeWithPlaywright() for JavaScript-rendered content
    - Add headless browser configuration
    - _Requirements: 3.1, 3.2_
  
  - [x] 5.3 Add Jina AI Reader fallback
    - Implement scrapeWithJina() using Jina AI API
    - _Requirements: 3.4_
  
  - [x] 5.4 Implement scraping strategy orchestration
    - Create scrapeUrl() that tries methods in order: Cheerio → Playwright → Jina
    - Add error handling and fallback logic
    - _Requirements: 3.1, 3.4, 3.5_
  
  - [ ]* 5.5 Write property tests for scraping service
    - **Property 9: Scraper Extracts Required Fields**
    - **Property 10: Scraping Failure Returns Error**
    - **Validates: Requirements 3.1, 3.5**
  
  - [ ]* 5.6 Write unit tests for scraping edge cases
    - Test timeout handling
    - Test malformed HTML
    - Test blocked requests
    - _Requirements: 3.5_

- [x] 6. Implement news analysis service
  - [x] 6.1 Create AnalysisService with Tavily/Perplexity integration
    - Implement searchNews() to query news APIs
    - Filter results to last 90 days
    - _Requirements: 4.1_
  
  - [x] 6.2 Add LinkedIn data retrieval
    - Implement searchLinkedIn() to fetch company data
    - Handle cases where LinkedIn data is unavailable
    - _Requirements: 4.3_
  
  - [x] 6.3 Implement insights extraction
    - Create extractInsights() to structure analysis results
    - Parse news articles for key information
    - _Requirements: 4.2, 4.4_
  
  - [ ]* 6.4 Write property tests for analysis service
    - **Property 11: News Search Time Window**
    - **Property 12: LinkedIn Data Retrieval**
    - **Property 13: Analysis Produces Structured Output**
    - **Validates: Requirements 4.1, 4.3, 4.4**

- [x] 7. Implement email generation service
  - [x] 7.1 Create EmailGenerationService with Gemini API integration
    - Implement generateEmail() to call Gemini API
    - Build prompt template with company context and news
    - Parse API response to extract subject and body
    - _Requirements: 5.1, 5.2, 5.5_
  
  - [x] 7.2 Add prompt engineering for personalization
    - Create buildPrompt() to structure context for AI
    - Include company info, news, and insights in prompt
    - _Requirements: 5.3, 5.4_
  
  - [ ]* 7.3 Write property tests for email generation
    - **Property 14: Email Generation Completeness**
    - **Validates: Requirements 5.2, 5.5**
  
  - [ ]* 7.4 Write unit tests for email generation edge cases
    - Test with minimal company data
    - Test with no news articles
    - Test API error handling
    - _Requirements: 5.5_

- [x] 8. Checkpoint - Ensure all service tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 9. Implement research API routes
  - [x] 9.1 Create POST /api/researches endpoint
    - Validate authentication and rate limits
    - Orchestrate scraping → analysis → generation pipeline
    - Save research to database
    - Increment usage counter
    - Return complete research object
    - _Requirements: 2.1, 2.2, 2.3, 2.4, 2.5, 2.7, 8.6_
  
  - [x] 9.2 Create GET /api/researches endpoint
    - Validate authentication
    - Support pagination, search, and filtering (favorites, tags)
    - Return user's research history
    - _Requirements: 6.2, 6.3, 7.3, 7.4_
  
  - [x] 9.3 Create GET /api/researches/[id] endpoint
    - Validate authentication and ownership
    - Return single research with all fields
    - _Requirements: 6.4_
  
  - [x] 9.4 Create PATCH /api/researches/[id] endpoint
    - Validate authentication and ownership
    - Support updating emailSubject, emailBody, isFavorite, tags
    - Persist changes to database
    - _Requirements: 7.1, 7.2, 7.5, 10.4_
  
  - [x] 9.5 Create DELETE /api/researches/[id] endpoint
    - Validate authentication and ownership
    - Delete research from database
    - _Requirements: 6.5_
  
  - [ ]* 9.6 Write property tests for research API routes
    - **Property 5: Valid URLs Initiate Research**
    - **Property 6: Research Pipeline Completeness**
    - **Property 7: Research Persistence**
    - **Property 8: Invalid URL Error Handling**
    - **Property 15: History Retrieval Completeness and Ordering**
    - **Property 16: History Search Filtering**
    - **Property 17: Research Retrieval Completeness**
    - **Property 18: Research Deletion**
    - **Property 19: Favorite Toggle Persistence**
    - **Property 20: Tag Management Round Trip**
    - **Property 21: Favorite Filtering**
    - **Property 22: Tag Filtering**
    - **Property 28: Edit Persistence**
    - **Validates: Requirements 2.1, 2.2-2.5, 2.7, 2.8, 6.2, 6.3, 6.4, 6.5, 7.1, 7.2, 7.3, 7.4, 7.5, 10.4**

- [x] 10. Implement user statistics API route
  - [x] 10.1 Create GET /api/users/stats endpoint
    - Calculate total research count
    - Get current month usage and limit
    - Count favorites
    - Calculate usage percentage
    - Fetch recent research entries
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [ ]* 10.2 Write property tests for statistics calculation
    - **Property 26: Dashboard Statistics Accuracy**
    - **Validates: Requirements 9.1, 9.2, 9.4, 9.5**

- [x] 11. Implement processing API routes
  - [x] 11.1 Create POST /api/scrape endpoint
    - Call ScrapingService.scrapeUrl()
    - Return scraped company data
    - Handle errors gracefully
    - _Requirements: 3.1, 3.5_
  
  - [x] 11.2 Create POST /api/analyze endpoint
    - Call AnalysisService methods
    - Return news articles and insights
    - _Requirements: 4.1, 4.3, 4.4_
  
  - [x] 11.3 Create POST /api/generate endpoint
    - Call EmailGenerationService.generateEmail()
    - Return subject and body
    - _Requirements: 5.2, 5.5_

- [x] 12. Checkpoint - Ensure all API tests pass
  - Ensure all tests pass, ask the user if questions arise.

- [x] 13. Create landing page with animations
  - [x] 13.1 Build landing page layout
    - Create app/page.tsx with hero section
    - Add Sera UI animated components
    - Implement Framer Motion animations
    - Add sign-in buttons linking to Clerk
    - _Requirements: 1.1_
  
  - [x] 13.2 Add responsive design and dark mode
    - Implement responsive breakpoints for mobile/tablet/desktop
    - Add dark mode toggle and theme persistence
    - _Requirements: 12.1, 12.2, 12.3, 12.4, 12.5_
  
  - [ ]* 13.3 Write property tests for theme persistence
    - **Property 31: Theme Persistence**
    - **Property 32: Dark Mode Application**
    - **Validates: Requirements 12.4, 12.5**

- [x] 14. Create dashboard page
  - [x] 14.1 Build dashboard layout and stats widgets
    - Create app/dashboard/page.tsx
    - Implement StatsWidget component to display usage, limits, counts
    - Fetch data from GET /api/users/stats
    - Display recent research entries
    - _Requirements: 9.1, 9.2, 9.3, 9.4, 9.5_
  
  - [x] 14.2 Add navigation and layout components
    - Create shared layout with navigation menu
    - Add user profile dropdown with sign-out
    - _Requirements: 1.4_

- [x] 15. Create research interface
  - [x] 15.1 Build ResearchForm component
    - Create URL input field with validation
    - Add submit button
    - Implement form submission to POST /api/researches
    - _Requirements: 2.1_
  
  - [x] 15.2 Build ProgressIndicator component
    - Display real-time progress messages during research
    - Show stages: scraping → analyzing → generating
    - Update progress based on API responses
    - _Requirements: 11.1, 11.2, 11.3, 11.4, 11.5_
  
  - [ ]* 15.3 Write property tests for progress indicator
    - **Property 30: Progress Indicator Updates**
    - **Validates: Requirements 11.5**
  
  - [x] 15.4 Build ResearchResults component
    - Display generated email subject and body
    - Add copy, edit, favorite, and tag buttons
    - Implement clipboard copy functionality
    - _Requirements: 10.1, 10.2_
  
  - [ ]* 15.5 Write property tests for clipboard functionality
    - **Property 27: Clipboard Copy Functionality**
    - **Validates: Requirements 10.2**
  
  - [x] 15.6 Create app/research/page.tsx
    - Integrate ResearchForm, ProgressIndicator, and ResearchResults
    - Handle research creation workflow
    - Display errors and success messages
    - _Requirements: 2.1, 2.6, 2.8, 13.1, 13.5_
  
  - [ ]* 15.7 Write property tests for error messaging
    - **Property 33: API Error Messaging**
    - **Property 34: Scraping Error Messaging**
    - **Property 35: Success Confirmation**
    - **Validates: Requirements 13.1, 13.3, 13.5**

- [x] 16. Create history page
  - [x] 16.1 Build HistoryTable component
    - Display research entries in table/card format
    - Add search input for filtering
    - Add filter buttons for favorites and tags
    - Implement pagination
    - _Requirements: 6.2, 6.3, 7.3, 7.4_
  
  - [x] 16.2 Build ResearchCard component
    - Display company name, URL, generation date
    - Show favorite status and tags
    - Add view, edit, and delete buttons
    - _Requirements: 6.4, 10.1_
  
  - [x] 16.3 Build TagManager component
    - Allow adding new tags to research
    - Allow removing existing tags
    - Update research via PATCH /api/researches/[id]
    - _Requirements: 7.2, 7.5_
  
  - [x] 16.4 Build EmailEditor component
    - Allow editing email subject and body
    - Add save button to persist changes
    - _Requirements: 10.3, 10.4_
  
  - [x] 16.5 Create app/history/page.tsx
    - Integrate HistoryTable and related components
    - Fetch data from GET /api/researches
    - Handle search, filtering, and pagination
    - _Requirements: 6.2, 6.3, 6.4, 6.5_

- [x] 17. Create settings page
  - [x] 17.1 Build settings page layout
    - Create app/settings/page.tsx
    - Display user profile information
    - Show subscription plan and usage limits
    - Add theme preference toggle
    - _Requirements: 8.2, 8.3, 12.5_

- [x] 18. Implement error handling and user feedback
  - [x] 18.1 Create error boundary components
    - Add global error boundary for unexpected errors
    - Add route-specific error boundaries
    - _Requirements: 13.1_
  
  - [x] 18.2 Add toast notification system
    - Install and configure toast library (e.g., sonner)
    - Display success messages for operations
    - Display error messages with actionable information
    - _Requirements: 13.1, 13.2, 13.3, 13.4, 13.5_
  
  - [x] 18.3 Implement rate limit error handling
    - Display upgrade message when limit exceeded
    - Show remaining usage in UI
    - _Requirements: 8.4, 13.2_

- [x] 19. Implement data integrity and transactions
  - [x] 19.1 Add database transaction support
    - Wrap multi-step operations in Prisma transactions
    - Implement rollback on failures
    - _Requirements: 14.1, 14.2_
  
  - [ ]* 19.2 Write property tests for data integrity
    - **Property 37: Transaction Rollback**
    - **Property 38: Subscription Update Integrity**
    - **Property 39: Cascade Deletion**
    - **Validates: Requirements 14.2, 14.3, 14.5**

- [x] 20. Add export functionality
  - [x] 20.1 Implement research export
    - Add export button to research details
    - Format research data as JSON or CSV
    - Trigger download in browser
    - _Requirements: 10.5_
  
  - [ ]* 20.2 Write property tests for export formatting
    - **Property 29: Export Formatting**
    - **Validates: Requirements 10.5**

- [x] 21. Final integration and polish
  - [x] 21.1 Add loading states and skeletons
    - Implement skeleton loaders for async operations
    - Add loading spinners where appropriate
    - _Requirements: 11.1, 11.2, 11.3, 11.4_
  
  - [x] 21.2 Optimize performance
    - Add React.memo to expensive components
    - Implement debouncing for search inputs
    - Add caching for frequently accessed data
    - _Requirements: All requirements benefit from performance_
  
  - [x] 21.3 Add accessibility features
    - Ensure keyboard navigation works
    - Add ARIA labels to interactive elements
    - Test with screen readers
    - _Requirements: All requirements benefit from accessibility_
  
  - [x] 21.4 Final responsive design review
    - Test on mobile, tablet, and desktop
    - Fix any layout issues
    - Ensure dark mode works across all pages
    - _Requirements: 12.1, 12.2, 12.3, 12.4_

- [x] 22. Final checkpoint - Comprehensive testing
  - Run all unit tests and property tests
  - Verify all 39 correctness properties pass
  - Test complete user workflows end-to-end
  - Ensure all tests pass, ask the user if questions arise.

## Notes

- Tasks marked with `*` are optional and can be skipped for faster MVP
- Each task references specific requirements for traceability
- Checkpoints ensure incremental validation
- Property tests validate universal correctness properties (39 total)
- Unit tests validate specific examples and edge cases
- The implementation follows a bottom-up approach: infrastructure → services → API → frontend
- All external service calls should be mocked in tests for reliability and speed
