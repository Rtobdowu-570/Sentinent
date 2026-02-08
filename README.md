# Agentic Outreach Researcher

An AI-powered application that transforms company URLs into hyper-personalized outreach emails within 30 seconds. The system combines intelligent web scraping, news analysis, LinkedIn integration, and AI-powered email generation.

## 🚀 Quick Deploy to Vercel

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

**Ready to deploy?** See [VERCEL-QUICK-START.md](./VERCEL-QUICK-START.md) for a 5-minute deployment guide!

## Features

- 🔐 Secure authentication with Clerk (Email, Google, GitHub)
- 🌐 Multi-strategy web scraping (Cheerio, Playwright, Jina AI)
- 📰 Real-time news analysis (Tavily/Perplexity API)
- 🤖 AI-powered email generation (Gemini API)
- 💾 Research history with search, filtering, and tagging
- ⭐ Favorites and tag management
- 📊 Usage tracking and rate limiting
- 🎨 Responsive design with dark mode
- ⚡ Built with Next.js 14, TypeScript, and Tailwind CSS

## Tech Stack

- **Framework**: Next.js 14 (App Router)
- **Language**: TypeScript
- **Styling**: Tailwind CSS + shadcn/ui
- **Database**: Vercel Postgres + Prisma ORM
- **Authentication**: Clerk
- **AI/ML**: Google Gemini API
- **Web Scraping**: Cheerio, Playwright, Jina AI Reader
- **News Search**: Tavily/Perplexity API
- **Rate Limiting**: Upstash Redis
- **Testing**: Jest, fast-check (property-based testing)
- **Animations**: Framer Motion

## Prerequisites

- Node.js 18+ or Bun
- pnpm (recommended) or npm
- PostgreSQL database (Vercel Postgres recommended)
- API keys for external services (see Environment Variables)

## Getting Started

### 1. Clone the repository

```bash
git clone <repository-url>
cd agentic-outreach-researcher
```

### 2. Install dependencies

```bash
pnpm install
```

### 3. Set up environment variables

Copy the `.env.example` file to `.env` and fill in your API keys:

```bash
cp .env.example .env
```

Required environment variables:
- `DATABASE_URL`: PostgreSQL connection string
- `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: Clerk publishable key
- `CLERK_SECRET_KEY`: Clerk secret key
- `GEMINI_API_KEY`: Google Gemini API key
- `TAVILY_API_KEY` or `PERPLEXITY_API_KEY`: News search API
- `JINA_API_KEY`: Jina AI Reader API key
- `UPSTASH_REDIS_REST_URL`: Upstash Redis URL
- `UPSTASH_REDIS_REST_TOKEN`: Upstash Redis token

### 4. Set up the database

Generate Prisma client:

```bash
pnpm db:generate
```

Push the schema to your database:

```bash
pnpm db:push
```

Or run migrations (for production):

```bash
pnpm db:migrate
```

### 5. Run the development server

```bash
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## Available Scripts

- `pnpm dev` - Start development server
- `pnpm build` - Build for production
- `pnpm start` - Start production server
- `pnpm lint` - Run ESLint
- `pnpm test` - Run tests in watch mode
- `pnpm test:ci` - Run tests once (CI mode)
- `pnpm test:coverage` - Run tests with coverage
- `pnpm db:generate` - Generate Prisma client
- `pnpm db:push` - Push schema to database
- `pnpm db:migrate` - Run database migrations
- `pnpm db:studio` - Open Prisma Studio

## Project Structure

```
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── dashboard/         # Dashboard page
│   ├── research/          # Research interface
│   ├── history/           # Research history
│   └── settings/          # User settings
├── components/            # React components
│   ├── ui/               # shadcn/ui components
│   └── ...               # Custom components
├── lib/                   # Utility functions and services
│   ├── prisma.ts         # Prisma client
│   └── services/         # Business logic services
├── prisma/               # Prisma schema and migrations
├── tests/                # Test files
│   ├── unit/            # Unit tests
│   ├── properties/      # Property-based tests
│   └── integration/     # Integration tests
└── public/              # Static assets
```

## API Services

### Scraping Service
Extracts company information using multiple strategies:
1. Cheerio (fast, lightweight HTML parsing)
2. Playwright (JavaScript-rendered content)
3. Jina AI Reader (fallback for blocked requests)

### Analysis Service
Searches for recent news and LinkedIn data:
- News articles from the last 90 days
- LinkedIn company updates and insights
- Structured insights extraction

### Email Generation Service
Creates personalized emails using Gemini API:
- Context-aware prompts
- Professional tone
- References to recent news and company info

### Rate Limiting Service
Tracks usage and enforces limits:
- Free tier: 5 researches/month
- Pro tier: 100 researches/month
- Monthly usage reset

## Testing

The project uses a dual testing approach:

### Unit Tests
Test specific examples and edge cases:
```bash
pnpm test
```

### Property-Based Tests
Test universal properties with fast-check:
```bash
pnpm test:ci
```

All 39 correctness properties are implemented as property tests, ensuring comprehensive coverage of business logic and data integrity.

## Deployment

### Vercel (Recommended)

For detailed deployment instructions, see [DEPLOYMENT.md](./DEPLOYMENT.md).

Quick steps:
1. Push your code to GitHub
2. Import the project in Vercel
3. Add environment variables in Vercel dashboard
4. Set up database schema with `npx prisma db push`
5. Deploy

### Other Platforms

Ensure you:
1. Set all environment variables
2. Run database migrations: `npx prisma db push`
3. Build the project: `pnpm build`
4. Start the server: `pnpm start`

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Write tests
5. Submit a pull request

## License

MIT

## Support

For issues and questions, please open an issue on GitHub.
# Sentinent
