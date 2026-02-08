# 🤖 Agentic Outreach Researcher

> AI-powered agent that transforms company URLs into hyper-personalized outreach emails in 30 seconds.

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![Next.js](https://img.shields.io/badge/Next.js-14+-black)
![TypeScript](https://img.shields.io/badge/TypeScript-5.0+-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4+-38bdf8)

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Demo](#demo)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Environment Variables](#environment-variables)
- [Usage](#usage)
- [API Routes](#api-routes)
- [Components](#components)
- [Deployment](#deployment)
- [Contributing](#contributing)
- [License](#license)

## 🎯 Overview

**The Agentic Outreach Researcher** is an intelligent agent that:

1. **Scrapes** company information from any URL
2. **Analyzes** recent news, LinkedIn updates, and company data
3. **Generates** hyper-personalized emails or LinkedIn DMs using AI
4. **Saves** your research history for future reference
5. **Delivers** results in 30 seconds with a stunning UI

Perfect for:
- Sales teams doing cold outreach
- Recruiters personalizing job offers
- Business development professionals
- Partnership managers
- Anyone who needs to research companies quickly

## ✨ Features

### Core Functionality
- 🔍 **Intelligent Web Scraping** - Extracts relevant company information
- 📰 **News Analysis** - Finds recent company updates and announcements
- 💼 **LinkedIn Integration** - Pulls professional context and updates
- ✍️ **AI-Powered Writing** - Generates contextual, personalized messages
- ⚡ **Lightning Fast** - Complete analysis in under 30 seconds

### User Management & History
- 🔐 **Secure Authentication** - Email, Google, and GitHub sign-in via Clerk
- 📊 **Dashboard Analytics** - Track usage, success rates, and statistics
- 📝 **Research History** - Access all past generated emails and insights
- ⭐ **Favorites System** - Save and organize your best researches
- 🔖 **Tagging & Search** - Categorize and quickly find past work
- 📈 **Usage Tracking** - Monitor monthly limits and upgrade options

### UI/UX Features
- 🎨 **Complex Animations** - Framer Motion powered transitions
- 🌊 **Interactive Landing Page** - Eye-catching hero sections and effects
- 📊 **Real-time Progress** - Live status updates during processing
- 📋 **One-Click Copy** - Easy message copying and editing
- 🌓 **Dark Mode** - Beautiful UI in light and dark themes
- 📱 **Responsive Design** - Works on all devices

## 🎥 Demo

![Demo GIF](./public/demo.gif)

**Live Demo**: [https://agentic-outreach.vercel.app](https://agentic-outreach.vercel.app)

## 🛠 Tech Stack

### Frontend
- **Framework**: [Next.js 14+](https://nextjs.org/) (App Router)
- **Language**: [TypeScript](https://www.typescriptlang.org/)
- **Styling**: [Tailwind CSS](https://tailwindcss.com/)
- **UI Components**: 
  - [shadcn/ui](https://ui.shadcn.com/) - Core components
  - [Sera UI](https://seraui.com/) - Animated landing page components
- **Animations**: [Framer Motion](https://www.framer.com/motion/)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Form Handling**: [React Hook Form](https://react-hook-form.com/)
- **Validation**: [Zod](https://zod.dev/)

### Backend
- **Runtime**: Node.js 18+
- **API Routes**: Next.js API Routes
- **Authentication**: [Clerk](https://clerk.com/) - User management & auth
- **Database**: [Vercel Postgres](https://vercel.com/storage/postgres) - Serverless PostgreSQL
- **ORM**: [Prisma](https://www.prisma.io/) - Type-safe database access
- **Web Scraping**: 
  - [Cheerio](https://cheerio.js.org/) - HTML parsing
  - [Playwright](https://playwright.dev/) - Dynamic content scraping
  - [Jina AI Reader](https://jina.ai/reader/) - Alternative scraper
- **Search API**: [Tavily API](https://tavily.com/) or [Perplexity API](https://www.perplexity.ai/)
- **AI/LLM**: 
  - [OpenAI GPT-4](https://openai.com/) or
  - [Anthropic Claude](https://www.anthropic.com/)
- **Rate Limiting**: [Upstash Redis](https://upstash.com/)
- **Caching**: Next.js Cache / Upstash Redis

### DevOps
- **Hosting**: [Vercel](https://vercel.com/)
- **Analytics**: [Vercel Analytics](https://vercel.com/analytics)
- **Error Tracking**: [Sentry](https://sentry.io/) (optional)

## 🚀 Getting Started

### Quick Start (TL;DR)

```bash
# Clone and install
git clone https://github.com/yourusername/agentic-outreach-researcher.git
cd agentic-outreach-researcher
npm install

# Set up environment variables
cp .env.example .env.local
# Add your API keys to .env.local

# Set up Clerk
npm install @clerk/nextjs
# Get keys from https://dashboard.clerk.com

# Set up database
npm install prisma @prisma/client
npx prisma init
# Update schema, then run:
npx prisma migrate dev --name init
npx prisma generate

# Install UI components
npx shadcn@latest init
npx shadcn@latest add button input card toast form tabs badge

# Run development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) 🎉

### Detailed Setup

### Prerequisites

- Node.js 18+ and npm/yarn/pnpm
- API keys for:
  - OpenAI or Anthropic
  - Tavily API (or Perplexity API)
  - Clerk (for authentication)
  - Vercel Postgres (or your preferred database)
  - Upstash Redis (optional, for rate limiting)

### Installation

1. **Clone the repository**

```bash
git clone https://github.com/yourusername/agentic-outreach-researcher.git
cd agentic-outreach-researcher
```

2. **Install dependencies**

```bash
npm install
# or
yarn install
# or
pnpm install
```

3. **Set up environment variables**

Create a `.env.local` file in the root directory:

```bash
cp .env.example .env.local
```

Then edit `.env.local` with your API keys (see [Environment Variables](#environment-variables))

4. **Install shadcn/ui components**

```bash
npx shadcn@latest init
```

Follow the prompts to configure shadcn/ui, then install required components:

```bash
npx shadcn@latest add button input card toast form tabs badge
```

5. **Add Sera UI components**

Copy the required Sera UI components from [seraui.com](https://seraui.com/):

```bash
# Create Sera UI components directory
mkdir -p components/sera-ui

# Copy components manually from Sera UI docs:
# - Hero Section (/docs/hero)
# - Text Reveal (/docs/textreveal)
# - Shimmer Button (/docs/shimmer)
# - Loading Spinners (/docs/loaders)
# - Orbiting Circles (/docs/orbits)
# - Number Ticker (/docs/ticker)
```

6. **Set up authentication with Clerk**

```bash
npm install @clerk/nextjs
```

Create a Clerk application at [clerk.com](https://clerk.com) and get your API keys.

7. **Set up Prisma and database**

```bash
npm install prisma @prisma/client
npx prisma init
```

This creates a `prisma` directory with a `schema.prisma` file.

Update your `prisma/schema.prisma` with the database schema (see [Database Schema](#database-schema) section below).

8. **Run database migrations**

```bash
npx prisma migrate dev --name init
npx prisma generate
```

9. **Run the development server**

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

## 📁 Project Structure

```
agentic-outreach-researcher/
├── app/
│   ├── (landing)/
│   │   └── page.tsx              # Landing page with animations
│   ├── (auth)/
│   │   ├── sign-in/
│   │   │   └── [[...sign-in]]/
│   │   │       └── page.tsx      # Clerk sign-in page
│   │   └── sign-up/
│   │       └── [[...sign-up]]/
│   │           └── page.tsx      # Clerk sign-up page
│   ├── dashboard/
│   │   ├── page.tsx              # Main dashboard
│   │   ├── history/
│   │   │   ├── page.tsx          # Research history list
│   │   │   └── [id]/
│   │   │       └── page.tsx      # Single research view
│   │   ├── settings/
│   │   │   └── page.tsx          # User settings
│   │   └── layout.tsx            # Dashboard layout with sidebar
│   ├── demo/
│   │   └── page.tsx              # Main demo interface
│   ├── api/
│   │   ├── researches/
│   │   │   ├── route.ts          # List/create researches
│   │   │   └── [id]/
│   │   │       └── route.ts      # Get/update/delete research
│   │   ├── users/
│   │   │   └── stats/
│   │   │       └── route.ts      # User statistics
│   │   ├── scrape/
│   │   │   └── route.ts          # Web scraping endpoint
│   │   ├── analyze/
│   │   │   └── route.ts          # News/LinkedIn analysis
│   │   └── generate/
│   │       └── route.ts          # Email generation endpoint
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/
│   ├── ui/                       # shadcn/ui components
│   │   ├── button.tsx
│   │   ├── input.tsx
│   │   ├── card.tsx
│   │   ├── tabs.tsx
│   │   ├── badge.tsx
│   │   └── ...
│   ├── sera-ui/                  # Sera UI components
│   │   ├── hero.tsx
│   │   ├── text-reveal.tsx
│   │   ├── shimmer-button.tsx
│   │   ├── number-ticker.tsx
│   │   └── ...
│   ├── landing/                  # Landing page sections
│   │   ├── Hero.tsx
│   │   ├── Features.tsx
│   │   ├── HowItWorks.tsx
│   │   └── CTA.tsx
│   ├── dashboard/                # Dashboard components
│   │   ├── Stats.tsx
│   │   ├── RecentResearch.tsx
│   │   ├── ResearchList.tsx
│   │   ├── ResearchListItem.tsx
│   │   └── QuickActions.tsx
│   ├── demo/                     # Demo interface components
│   │   ├── URLInput.tsx
│   │   ├── ProcessingStatus.tsx
│   │   ├── ResultsDisplay.tsx
│   │   └── EmailPreview.tsx
│   └── shared/                   # Shared components
│       ├── Navigation.tsx
│       ├── Footer.tsx
│       └── UserButton.tsx
├── lib/
│   ├── db.ts                     # Prisma client instance
│   ├── queries/                  # Database queries
│   │   ├── researches.ts
│   │   └── users.ts
│   ├── scraper.ts                # Web scraping utilities
│   ├── analyzer.ts               # Data analysis logic
│   ├── generator.ts              # Email generation logic
│   ├── rate-limit.ts             # Usage limiting logic
│   ├── api-client.ts             # API client utilities
│   └── utils.ts                  # Helper functions
├── prisma/
│   ├── schema.prisma             # Database schema
│   └── migrations/               # Database migrations
├── types/
│   └── index.ts                  # TypeScript type definitions
├── public/
│   ├── demo.gif
│   └── ...
├── middleware.ts                 # Auth middleware
├── .env.example                  # Example environment variables
├── .env.local                    # Your environment variables (gitignored)
├── next.config.js                # Next.js configuration
├── tailwind.config.ts            # Tailwind CSS configuration
├── tsconfig.json                 # TypeScript configuration
├── package.json
└── README.md
```

## UI INSPIRATION

# Full Website Inspiration

Web Design: curated.design | godly.website
Landing Pages: landing.love | onepagelove.com | landingly.co
SaaS Specific: saaspo.com
Dark Mode: dark.design

# Specific UI Components
Hero Sections: supahero.io
Navigation Bars: navbar.gallery
CTA (Call to Action): cta.gallery
Bento Grids: bentogrids.com
Footers: footer.design
Design Systems: component.gallery

# Assets & Branding
Branding: rebrand.gallery
Icons: hugeicons.com
Fonts: fontshare.com
Decorations/Shapes: coolshap.es


## 🔐 Environment Variables

Create a `.env.local` file with the following variables:

```bash
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/dashboard
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/dashboard

# Database (Vercel Postgres)
POSTGRES_URL="postgres://..."
POSTGRES_PRISMA_URL="postgres://..."
POSTGRES_URL_NON_POOLING="postgres://..."
POSTGRES_USER="..."
POSTGRES_HOST="..."
POSTGRES_PASSWORD="..."
POSTGRES_DATABASE="..."

# AI/LLM API (choose one)
GEMINI_API_KEY=sk-...                    # GEMINI API key

# Web Search/Scraping
TAVILY_API_KEY=tvly-...                  # Tavily API key for web search
# OR
PERPLEXITY_API_KEY=pplx-...              # Perplexity API key (alternative)

# Jina AI Reader (optional, for better scraping)
JINA_API_KEY=jina_...

# Rate Limiting (optional but recommended)
UPSTASH_REDIS_REST_URL=https://...       # Upstash Redis URL
UPSTASH_REDIS_REST_TOKEN=...             # Upstash Redis token

# Application
NEXT_PUBLIC_APP_URL=http://localhost:3000
NODE_ENV=development

# Analytics (optional)
NEXT_PUBLIC_VERCEL_ANALYTICS_ID=...      # Vercel Analytics
```

### Getting API Keys

1. **Clerk**: https://dashboard.clerk.com/ → Create application → Copy API keys
2. **Vercel Postgres**: https://vercel.com/dashboard → Storage → Create Database
3. **OpenAI**: https://platform.openai.com/api-keys
4. **Anthropic**: https://console.anthropic.com/
5. **Tavily**: https://app.tavily.com/
6. **Perplexity**: https://www.perplexity.ai/settings/api
7. **Jina AI**: https://jina.ai/reader/
8. **Upstash Redis**: https://console.upstash.com/

## 🗄️ Database Schema

Add this schema to your `prisma/schema.prisma` file:

```prisma
// prisma/schema.prisma

generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("POSTGRES_PRISMA_URL")
  directUrl = env("POSTGRES_URL_NON_POOLING")
}

model User {
  id            String    @id @default(cuid())
  email         String    @unique
  name          String?
  clerkId       String    @unique
  imageUrl      String?
  createdAt     DateTime  @default(now())
  updatedAt     DateTime  @updatedAt
  
  researches    Research[]
  subscription  Subscription?
  
  @@map("users")
}

model Research {
  id              String          @id @default(cuid())
  userId          String
  companyUrl      String
  companyName     String?
  
  // Scraped data (stored as JSON)
  scrapedData     Json?
  newsArticles    Json?
  linkedinData    Json?
  
  // Generated content
  emailSubject    String?
  emailBody       String?         @db.Text
  insights        Json?
  
  // Metadata
  status          ResearchStatus  @default(PROCESSING)
  generatedAt     DateTime        @default(now())
  lastViewedAt    DateTime?
  isFavorite      Boolean         @default(false)
  tags            String[]
  
  // Relations
  user            User            @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@index([userId])
  @@index([generatedAt])
  @@index([status])
  @@map("researches")
}

enum ResearchStatus {
  PROCESSING
  COMPLETED
  FAILED
}

model Subscription {
  id                    String    @id @default(cuid())
  userId                String    @unique
  plan                  Plan      @default(FREE)
  
  // Usage tracking
  monthlyUsage          Int       @default(0)
  monthlyLimit          Int       @default(5)
  resetDate             DateTime
  
  // Payment info (for future monetization)
  stripeCustomerId      String?   @unique
  stripeSubscriptionId  String?   @unique
  stripePriceId         String?
  
  createdAt             DateTime  @default(now())
  updatedAt             DateTime  @updatedAt
  
  user                  User      @relation(fields: [userId], references: [id], onDelete: Cascade)
  
  @@map("subscriptions")
}

enum Plan {
  FREE
  PRO
  ENTERPRISE
}
```

After adding the schema, run:

```bash
npx prisma generate
npx prisma migrate dev --name init
```

## 💻 Usage

### User Journey

1. **Visit Landing Page**
   - See product features and animations
   - Click "Sign Up" or "Try Demo"

2. **Create Account**
   - Sign up with email, Google, or GitHub via Clerk
   - Automatically redirected to dashboard

3. **Dashboard Overview**
   - View usage statistics (researches used/remaining)
   - See recent research history
   - Click "New Research" to start

4. **Generate Research**
   ```
   Enter company URL: https://www.stripe.com
   Click "Generate"
   ```

5. **Agent Processing** (30 seconds)
   - Scrapes company website
   - Searches recent news and updates
   - Analyzes LinkedIn presence
   - Identifies key talking points
   - Generates personalized email
   - **Automatically saves to your history**

6. **View Results**
   - Read generated email
   - Copy to clipboard
   - Edit if needed
   - Add tags for organization
   - Mark as favorite

7. **Access History**
   - Navigate to History page
   - Search and filter past researches
   - Re-use or refine previous emails
   - Track your outreach progress

### Example Input/Output

**Input:**
```
https://www.stripe.com
```

**Output:**
```
Subject: Impressed by Stripe's Recent Tax Revenue API Launch

Hi [Name],

I noticed Stripe just launched its Tax Revenue API this week—
congratulations on making tax compliance simpler for platforms. 
As someone who follows fintech innovation, the 40-country 
coverage is impressive.

I'm reaching out because [your value proposition here]...

Would you be open to a brief call next week?

Best,
[Your Name]
```

### Dashboard Features

**Stats Overview:**
- Total researches generated
- Monthly usage (with limit tracking)
- Success rate
- Favorite count

**Recent Activity:**
- Last 5 researches
- Quick access to view/copy
- Status indicators

**Quick Actions:**
- New Research button
- View all history
- Account settings
- Upgrade plan (if on free tier)

### Advanced Features

**Custom Prompts:**
```typescript
// Modify lib/generator.ts to customize email style
const SYSTEM_PROMPT = `
  You are a professional business writer...
  Tone: Professional but warm
  Length: 3-4 paragraphs
  ...
`;
```

**Rate Limiting:**
```typescript
// lib/rate-limit.ts
export async function checkUsageLimit(userId: string) {
  const subscription = await prisma.subscription.findUnique({
    where: { userId }
  })
  
  if (subscription.monthlyUsage >= subscription.monthlyLimit) {
    throw new Error('Monthly limit reached')
  }
  
  // Increment usage
  await prisma.subscription.update({
    where: { userId },
    data: { monthlyUsage: { increment: 1 } }
  })
}
```

**Webhook Integration (Clerk):**
```typescript
// app/api/webhooks/clerk/route.ts
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { prisma } from '@/lib/db'

export async function POST(req: Request) {
  const webhook = new Webhook(process.env.CLERK_WEBHOOK_SECRET!)
  const payload = await req.json()
  
  // Verify webhook
  const verified = webhook.verify(payload, headers())
  
  // Handle user.created event
  if (verified.type === 'user.created') {
    await prisma.user.create({
      data: {
        clerkId: verified.data.id,
        email: verified.data.email_addresses[0].email_address,
        name: verified.data.first_name,
        subscription: {
          create: {
            plan: 'FREE',
            monthlyLimit: 5,
            resetDate: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)
          }
        }
      }
    })
  }
  
  return Response.json({ success: true })
}
```

**Search & Filter:**
```typescript
// lib/queries/researches.ts
export async function searchResearches(
  userId: string,
  query: string,
  filters: {
    status?: ResearchStatus
    favorite?: boolean
    tags?: string[]
  }
) {
  return prisma.research.findMany({
    where: {
      userId,
      ...(query && {
        OR: [
          { companyName: { contains: query, mode: 'insensitive' } },
          { companyUrl: { contains: query } },
          { emailSubject: { contains: query, mode: 'insensitive' } }
        ]
      }),
      ...(filters.status && { status: filters.status }),
      ...(filters.favorite !== undefined && { isFavorite: filters.favorite }),
      ...(filters.tags && { tags: { hasSome: filters.tags } })
    },
    orderBy: { generatedAt: 'desc' }
  })
}
```

## 🔌 API Routes

### Authentication (Protected)

All routes except public landing page require authentication via Clerk.

### GET `/api/researches`

Get all researches for the authenticated user.

**Query Parameters:**
- `limit` (optional): Number of results (default: 10)
- `offset` (optional): Pagination offset
- `favorite` (optional): Filter by favorites (true/false)
- `status` (optional): Filter by status (PROCESSING, COMPLETED, FAILED)

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "clx...",
      "companyName": "Stripe",
      "companyUrl": "https://stripe.com",
      "emailSubject": "...",
      "status": "COMPLETED",
      "generatedAt": "2024-02-07T10:30:00Z",
      "isFavorite": false,
      "tags": ["sales", "fintech"]
    }
  ],
  "total": 42,
  "hasMore": true
}
```

### POST `/api/researches`

Create a new research.

**Request:**
```json
{
  "companyUrl": "https://www.stripe.com",
  "tags": ["sales"]
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "status": "PROCESSING"
  }
}
```

### GET `/api/researches/[id]`

Get a specific research by ID.

**Response:**
```json
{
  "success": true,
  "data": {
    "id": "clx...",
    "companyName": "Stripe",
    "companyUrl": "https://stripe.com",
    "scrapedData": {...},
    "newsArticles": [...],
    "emailSubject": "...",
    "emailBody": "...",
    "insights": {...},
    "status": "COMPLETED",
    "generatedAt": "2024-02-07T10:30:00Z"
  }
}
```

### PATCH `/api/researches/[id]`

Update a research (favorite, tags, etc.).

**Request:**
```json
{
  "isFavorite": true,
  "tags": ["sales", "fintech", "priority"]
}
```

### DELETE `/api/researches/[id]`

Delete a research.

**Response:**
```json
{
  "success": true,
  "message": "Research deleted successfully"
}
```

### GET `/api/users/stats`

Get statistics for the authenticated user.

**Response:**
```json
{
  "success": true,
  "data": {
    "totalResearches": 42,
    "monthlyUsage": 8,
    "monthlyLimit": 10,
    "successRate": 95.2,
    "favorites": 12,
    "plan": "PRO"
  }
}
```

### POST `/api/scrape`

Scrapes company information from a URL.

**Request:**
```json
{
  "url": "https://www.stripe.com"
}
```

**Response:**
```json
{
  "success": true,
  "data": {
    "companyName": "Stripe",
    "description": "...",
    "recentNews": [...],
    "linkedinData": {...}
  }
}
```

### POST `/api/analyze`

Analyzes scraped data for key insights.

**Request:**
```json
{
  "scrapedData": {...}
}
```

**Response:**
```json
{
  "success": true,
  "insights": {
    "keyTopics": [...],
    "recentAchievements": [...],
    "talkingPoints": [...]
  }
}
```

### POST `/api/generate`

Generates personalized email from insights.

**Request:**
```json
{
  "insights": {...},
  "recipientName": "John Doe",
  "senderName": "Jane Smith",
  "context": "sales outreach"
}
```

**Response:**
```json
{
  "success": true,
  "email": {
    "subject": "...",
    "body": "..."
  }
}
```

## 🎨 Components

### Landing Page Components (Sera UI)

- **Hero Section** - Animated hero with orbiting circles
- **Features Grid** - Bento grid layout showcasing features
- **How It Works** - Step-by-step process visualization
- **Testimonials** - Social proof section
- **CTA Section** - Call-to-action with shimmer button

### Authentication Components (Clerk + Sera UI)

- **SignIn Page** - Clerk-powered sign-in with custom styling
- **SignUp Page** - Clerk-powered sign-up with custom styling
- **UserButton** - Profile dropdown menu

### Dashboard Components (shadcn/ui + Sera UI)

- **DashboardStats** - Usage statistics with animated number tickers
- **RecentResearch** - Card grid of recent researches
- **QuickActions** - Action buttons for common tasks
- **ResearchList** - Filterable list of all researches
- **ResearchListItem** - Individual research card with actions
- **DashboardLayout** - Sidebar navigation with user menu

### Demo Interface Components (shadcn/ui)

- **URLInput** - Form with validation
- **ProcessingStatus** - Real-time progress indicator
- **ResultsDisplay** - Tabbed view of scraped data
- **EmailPreview** - Formatted email display with copy button

### Shared Components

- **Navigation** - Responsive navbar with auth state
- **Footer** - Site footer with links
- **Toast** - Notification system
- **ProtectedRoute** - Auth guard wrapper

## 🚢 Deployment

### Deploy to Vercel (Recommended)

1. **Push to GitHub**

```bash
git add .
git commit -m "Initial commit"
git push origin main
```

2. **Create Vercel Postgres Database**

- Go to [Vercel Dashboard](https://vercel.com/dashboard)
- Navigate to Storage tab
- Create a new Postgres database
- Copy the environment variables

3. **Deploy to Vercel**

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new)

4. **Add Environment Variables**

Go to your Vercel project settings → Environment Variables and add all variables from `.env.local`:

- Clerk keys (NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY, CLERK_SECRET_KEY)
- Database URLs (automatically added if using Vercel Postgres)
- AI API keys (OpenAI or Anthropic)
- Search API keys (Tavily or Perplexity)
- Optional: Redis, Jina AI

5. **Run Database Migrations**

After first deployment, run migrations:

```bash
# Install Vercel CLI
npm i -g vercel

# Link your project
vercel link

# Run migrations on production database
vercel env pull .env.production
npx prisma migrate deploy
```

6. **Deploy**

Vercel will automatically deploy your app. Future pushes to `main` will trigger new deployments.

### Post-Deployment Setup

1. **Configure Clerk URLs**
   - Go to Clerk Dashboard
   - Update authorized domains to include your Vercel URL
   - Update redirect URLs

2. **Test Authentication**
   - Visit your deployed site
   - Try signing up/in
   - Verify redirects work correctly

3. **Verify Database Connection**
   - Check Vercel logs for any database errors
   - Test creating a research
   - Verify data persists

### Manual Deployment

```bash
# Build the application
npm run build

# Run database migrations
npx prisma migrate deploy

# Start production server
npm start
```

## 🚀 Future Enhancements

### Planned Features

- [ ] **LinkedIn Direct Integration** - Send DMs directly from the app
- [ ] **Email Sending** - Integrate with Gmail/Outlook APIs
- [ ] **Team Collaboration** - Share researches with team members
- [ ] **Templates** - Create reusable email templates
- [ ] **A/B Testing** - Test different email variations
- [ ] **Analytics Dashboard** - Track email performance metrics
- [ ] **Chrome Extension** - Research companies from any webpage
- [ ] **Mobile App** - iOS and Android native apps
- [ ] **Bulk Processing** - Upload CSV of companies to research
- [ ] **CRM Integration** - Sync with Salesforce, HubSpot, etc.
- [ ] **Multi-language Support** - Generate emails in different languages
- [ ] **API Access** - RESTful API for enterprise customers

### Monetization Options

**Free Tier:**
- 5 researches per month
- Basic email templates
- 7-day history retention

**Pro Tier ($19/month):**
- 100 researches per month
- Advanced templates
- Unlimited history
- Priority support
- Custom branding

**Enterprise Tier ($99/month):**
- Unlimited researches
- Team collaboration
- API access
- CRM integration
- Dedicated support
- Custom AI training

## 🤝 Contributing

Contributions are welcome! Please follow these steps:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

### Development Guidelines

- Use TypeScript for type safety
- Follow the existing code style
- Write meaningful commit messages
- Add tests for new features
- Update documentation as needed

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [shadcn/ui](https://ui.shadcn.com/) - For beautiful, accessible components
- [Sera UI](https://seraui.com/) - For stunning animated components
- [Next.js](https://nextjs.org/) - For the amazing React framework
- [Clerk](https://clerk.com/) - For seamless authentication
- [Prisma](https://www.prisma.io/) - For type-safe database access
- [Vercel](https://vercel.com/) - For seamless deployment and database hosting
- [Tavily](https://tavily.com/) - For web search API
- [OpenAI](https://openai.com/) / [Anthropic](https://anthropic.com/) - For AI capabilities

## 📧 Contact

**Your Name** - [@yourtwitter](https://twitter.com/yourtwitter)

**Project Link**: [https://github.com/yourusername/agentic-outreach-researcher](https://github.com/yourusername/agentic-outreach-researcher)

---
