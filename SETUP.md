# Setup Guide

This guide will help you set up the Agentic Outreach Researcher application from scratch.

## Prerequisites

Before you begin, ensure you have the following installed:

- **Node.js 18+** or **Bun**
- **pnpm** (recommended) - Install with: `npm install -g pnpm`
- **Git**

## Step 1: Clone and Install

```bash
# Clone the repository
git clone <repository-url>
cd agentic-outreach-researcher

# Install dependencies
pnpm install
```

## Step 2: Set Up External Services

You'll need to create accounts and get API keys for the following services:

### Required Services

1. **Vercel Postgres** (Database)
   - Sign up at [vercel.com](https://vercel.com)
   - Create a new Postgres database
   - Copy the connection string

2. **Clerk** (Authentication)
   - Sign up at [clerk.com](https://clerk.com)
   - Create a new application
   - Enable Email, Google, and GitHub authentication
   - Copy the publishable key and secret key

3. **Google Gemini API** (AI Email Generation)
   - Visit [makersuite.google.com](https://makersuite.google.com/app/apikey)
   - Create an API key

4. **Upstash Redis** (Rate Limiting)
   - Sign up at [upstash.com](https://upstash.com)
   - Create a new Redis database
   - Copy the REST URL and token

### Optional Services (Recommended)

5. **Tavily API** (News Search)
   - Sign up at [tavily.com](https://tavily.com)
   - Get your API key

6. **Perplexity API** (Alternative News Search)
   - Sign up at [perplexity.ai](https://www.perplexity.ai)
   - Get your API key

7. **Jina AI Reader** (Web Scraping Fallback)
   - Sign up at [jina.ai](https://jina.ai)
   - Get your API key

## Step 3: Configure Environment Variables

```bash
# Copy the example environment file
cp .env.example .env

# Edit .env and add your API keys
nano .env  # or use your preferred editor
```

Update the following variables in `.env`:

```env
# Database
DATABASE_URL="your-vercel-postgres-connection-string"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."

# Gemini API
GEMINI_API_KEY="your-gemini-api-key"

# Upstash Redis
UPSTASH_REDIS_REST_URL="your-redis-url"
UPSTASH_REDIS_REST_TOKEN="your-redis-token"

# Optional: News Search APIs
TAVILY_API_KEY="your-tavily-key"
PERPLEXITY_API_KEY="your-perplexity-key"

# Optional: Jina AI
JINA_API_KEY="your-jina-key"
```

## Step 4: Set Up Database

```bash
# Generate Prisma client
pnpm db:generate

# Push schema to database (for development)
pnpm db:push

# Or run migrations (for production)
pnpm db:migrate
```

## Step 5: Install Playwright Browsers

```bash
# Install Chromium for web scraping
pnpm exec playwright install chromium
```

## Step 6: Verify Setup

```bash
# Run the verification script
pnpm verify
```

This will check if all required environment variables are configured correctly.

## Step 7: Start Development Server

```bash
# Start the development server
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Step 8: Test the Application

```bash
# Run tests
pnpm test:ci

# Run tests with coverage
pnpm test:coverage
```

## Troubleshooting

### Database Connection Issues

If you're having trouble connecting to the database:

1. Verify your `DATABASE_URL` is correct
2. Ensure your IP is whitelisted in Vercel Postgres settings
3. Try using `prisma db push` instead of migrations for development

### Clerk Authentication Issues

If authentication isn't working:

1. Verify your Clerk keys are correct
2. Check that the redirect URLs match in Clerk dashboard
3. Ensure middleware.ts is properly configured

### Build Errors

If you encounter build errors:

1. Clear Next.js cache: `rm -rf .next`
2. Reinstall dependencies: `rm -rf node_modules && pnpm install`
3. Regenerate Prisma client: `pnpm db:generate`

### Playwright Issues

If web scraping isn't working:

1. Reinstall browsers: `pnpm exec playwright install chromium`
2. Check system dependencies: `pnpm exec playwright install-deps`

## Development Workflow

1. **Create a new feature branch**
   ```bash
   git checkout -b feature/your-feature-name
   ```

2. **Make your changes**
   - Write code
   - Add tests
   - Update documentation

3. **Run tests**
   ```bash
   pnpm test:ci
   ```

4. **Check for type errors**
   ```bash
   pnpm build
   ```

5. **Commit and push**
   ```bash
   git add .
   git commit -m "feat: your feature description"
   git push origin feature/your-feature-name
   ```

## Useful Commands

```bash
# Development
pnpm dev              # Start dev server
pnpm build            # Build for production
pnpm start            # Start production server

# Database
pnpm db:generate      # Generate Prisma client
pnpm db:push          # Push schema to database
pnpm db:migrate       # Run migrations
pnpm db:studio        # Open Prisma Studio

# Testing
pnpm test             # Run tests in watch mode
pnpm test:ci          # Run tests once
pnpm test:coverage    # Run tests with coverage

# Utilities
pnpm verify           # Verify setup
pnpm lint             # Run ESLint
```

## Next Steps

Once your setup is complete:

1. Review the [README.md](./README.md) for project overview
2. Check the [design document](./.kiro/specs/agentic-outreach-researcher/design.md) for architecture details
3. Review the [tasks list](./.kiro/specs/agentic-outreach-researcher/tasks.md) for implementation plan
4. Start implementing features following the task order

## Getting Help

If you encounter issues:

1. Check this setup guide
2. Review the troubleshooting section
3. Check the project documentation
4. Open an issue on GitHub

## Security Notes

- Never commit `.env` files to version control
- Keep your API keys secure
- Use environment variables for all sensitive data
- Rotate API keys regularly
- Use different keys for development and production
