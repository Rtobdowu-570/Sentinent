import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { BarChart3, FileText, Heart, TrendingUp } from 'lucide-react'
import Link from 'next/link'

interface UserStats {
  totalResearches: number
  monthlyUsage: number
  monthlyLimit: number
  favoritesCount: number
  usagePercentage: number
  plan: string
  resetDate: string
  recentResearches: Array<{
    id: string
    companyName: string
    companyUrl: string
    generatedAt: string
    isFavorite: boolean
    tags: string[]
    emailSubject: string
  }>
}

async function getUserStats(userId: string): Promise<UserStats | null> {
  try {
    // Import prisma dynamically to avoid issues
    const { prisma } = await import('@/lib/prisma')
    
    // Calculate total research count
    const totalResearches = await prisma.research.count({
      where: { userId },
    })

    // Get subscription data for usage and limit
    let subscription = await prisma.subscription.findUnique({
      where: { userId },
    })

    // If no subscription exists, create a default free tier subscription
    if (!subscription) {
      const resetDate = new Date()
      resetDate.setMonth(resetDate.getMonth() + 1)
      resetDate.setDate(1)
      resetDate.setHours(0, 0, 0, 0)

      subscription = await prisma.subscription.create({
        data: {
          userId,
          plan: 'free',
          monthlyUsage: 0,
          monthlyLimit: 5,
          resetDate,
        },
      })
    }

    // Count favorites
    const favoritesCount = await prisma.research.count({
      where: {
        userId,
        isFavorite: true,
      },
    })

    // Calculate usage percentage
    const usagePercentage = subscription.monthlyLimit > 0
      ? Math.round((subscription.monthlyUsage / subscription.monthlyLimit) * 100)
      : 0

    // Fetch recent research entries
    const recentResearches = await prisma.research.findMany({
      where: { userId },
      orderBy: { generatedAt: 'desc' },
      take: 5,
      select: {
        id: true,
        companyName: true,
        companyUrl: true,
        generatedAt: true,
        isFavorite: true,
        tags: true,
        emailSubject: true,
      },
    })

    return {
      totalResearches,
      monthlyUsage: subscription.monthlyUsage,
      monthlyLimit: subscription.monthlyLimit,
      favoritesCount,
      usagePercentage,
      recentResearches: recentResearches.map((r: any) => ({
        ...r,
        generatedAt: r.generatedAt.toISOString(),
      })),
      plan: subscription.plan,
      resetDate: subscription.resetDate.toISOString(),
    }
  } catch (error) {
    console.error('Error fetching user stats:', error)
    return null
  }
}

export default async function DashboardPage() {
  const { userId } = await auth()
  
  if (!userId) {
    redirect('/sign-in')
  }

  const stats = await getUserStats(userId)

  if (!stats) {
    return (
      <div className="container mx-auto px-4 py-8">
        <h1 className="text-4xl font-bold mb-8">Dashboard</h1>
        <Card>
          <CardContent className="pt-6">
            <p className="text-muted-foreground">Unable to load dashboard statistics. Please try again later.</p>
          </CardContent>
        </Card>
      </div>
    )
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Dashboard</h1>
        <p className="text-muted-foreground">Track your research activity and usage statistics</p>
      </div>

        {/* Stats Grid */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4 mb-8">
          {/* Total Research Count */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Total Research</CardTitle>
              <FileText className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.totalResearches}</div>
              <p className="text-xs text-muted-foreground">All-time research count</p>
            </CardContent>
          </Card>

          {/* Monthly Usage */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Monthly Usage</CardTitle>
              <TrendingUp className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">
                {stats.monthlyUsage} / {stats.monthlyLimit}
              </div>
              <div className="mt-2">
                <div className="w-full bg-secondary rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all ${
                      stats.usagePercentage >= 90
                        ? 'bg-destructive'
                        : stats.usagePercentage >= 70
                        ? 'bg-yellow-500'
                        : 'bg-primary'
                    }`}
                    style={{ width: `${Math.min(stats.usagePercentage, 100)}%` }}
                  />
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  {stats.usagePercentage}% used • Resets {formatDate(stats.resetDate)}
                </p>
                {stats.usagePercentage >= 90 && (
                  <p className="text-xs text-destructive mt-1 font-medium">
                    ⚠️ Low usage remaining
                  </p>
                )}
              </div>
            </CardContent>
          </Card>

          {/* Favorites Count */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Favorites</CardTitle>
              <Heart className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold">{stats.favoritesCount}</div>
              <p className="text-xs text-muted-foreground">Saved research entries</p>
            </CardContent>
          </Card>

          {/* Current Plan */}
          <Card>
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">Current Plan</CardTitle>
              <BarChart3 className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold capitalize">{stats.plan}</div>
              <p className="text-xs text-muted-foreground">
                {stats.monthlyLimit} researches per month
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Recent Research */}
        <Card>
          <CardHeader>
            <CardTitle>Recent Research</CardTitle>
            <CardDescription>Your most recent research entries</CardDescription>
          </CardHeader>
          <CardContent>
            {stats.recentResearches.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-muted-foreground mb-4">No research entries yet</p>
                <Link
                  href="/research"
                  className="text-sm text-primary hover:underline"
                >
                  Create your first research →
                </Link>
              </div>
            ) : (
              <div className="space-y-4">
                {stats.recentResearches.map((research) => (
                  <div
                    key={research.id}
                    className="flex items-start justify-between border-b border-border pb-4 last:border-0 last:pb-0"
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2 mb-1">
                        <h3 className="font-semibold truncate">{research.companyName}</h3>
                        {research.isFavorite && (
                          <Heart className="h-4 w-4 fill-red-500 text-red-500 flex-shrink-0" />
                        )}
                      </div>
                      <p className="text-sm text-muted-foreground truncate mb-2">
                        {research.emailSubject}
                      </p>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="text-xs text-muted-foreground">
                          {formatDate(research.generatedAt)} at {formatTime(research.generatedAt)}
                        </span>
                        {research.tags.length > 0 && (
                          <div className="flex gap-1 flex-wrap">
                            {research.tags.slice(0, 3).map((tag) => (
                              <Badge key={tag} variant="secondary" className="text-xs">
                                {tag}
                              </Badge>
                            ))}
                            {research.tags.length > 3 && (
                              <Badge variant="secondary" className="text-xs">
                                +{research.tags.length - 3}
                              </Badge>
                            )}
                          </div>
                        )}
                      </div>
                    </div>
                    <Link
                      href={`/history?id=${research.id}`}
                      className="ml-4 text-sm text-primary hover:underline flex-shrink-0"
                    >
                      View
                    </Link>
                  </div>
                ))}
                <div className="pt-4">
                  <Link
                    href="/history"
                    className="text-sm text-primary hover:underline"
                  >
                    View all research →
                  </Link>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
  )
}
