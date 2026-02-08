'use client'

import { useState, useEffect } from 'react'
import ResearchForm from '@/components/research-form'
import ProgressIndicator, { ProgressStage } from '@/components/progress-indicator'
import ResearchResults from '@/components/research-results'
import { toast } from 'sonner'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AlertCircle, TrendingUp } from 'lucide-react'
import Link from 'next/link'
import { StatsCardSkeleton } from '@/components/skeletons'

interface Research {
  id: string
  companyName: string
  companyUrl: string
  emailSubject: string
  emailBody: string
  generatedAt: string
  isFavorite: boolean
  tags: string[]
  scrapedData?: any
  newsArticles?: any
  linkedinData?: any
  insights?: any
}

interface UsageStats {
  monthlyUsage: number
  monthlyLimit: number
  remaining: number
  usagePercentage: number
  resetDate: string
}

export default function ResearchPage() {
  const [isLoading, setIsLoading] = useState(false)
  const [currentStage, setCurrentStage] = useState<ProgressStage>('scraping')
  const [research, setResearch] = useState<Research | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [usageStats, setUsageStats] = useState<UsageStats | null>(null)
  const [loadingStats, setLoadingStats] = useState(true)

  // Fetch usage stats on mount
  useEffect(() => {
    fetchUsageStats()
  }, [])

  const fetchUsageStats = async () => {
    setLoadingStats(true)
    try {
      const response = await fetch('/api/users/stats')
      const data = await response.json()

      if (response.ok && data.success) {
        const stats = data.stats
        setUsageStats({
          monthlyUsage: stats.monthlyUsage,
          monthlyLimit: stats.monthlyLimit,
          remaining: stats.monthlyLimit - stats.monthlyUsage,
          usagePercentage: stats.usagePercentage,
          resetDate: stats.resetDate,
        })
      }
    } catch (error) {
      console.error('Failed to fetch usage stats:', error)
    } finally {
      setLoadingStats(false)
    }
  }

  const handleSubmit = async (url: string) => {
    setIsLoading(true)
    setError(null)
    setResearch(null)
    setCurrentStage('scraping')

    try {
      // Simulate progress stages
      const progressInterval = setInterval(() => {
        setCurrentStage((prev) => {
          if (prev === 'scraping') return 'analyzing'
          if (prev === 'analyzing') return 'generating'
          return prev
        })
      }, 2000)

      const response = await fetch('/api/researches', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ companyUrl: url }),
      })

      clearInterval(progressInterval)

      const data = await response.json()

      if (!response.ok) {
        if (response.status === 429) {
          // Rate limit exceeded
          const resetDate = new Date(data.resetDate).toLocaleDateString()
          setError(
            `Monthly research limit exceeded. You've used ${data.usage} of ${data.limit} researches. ` +
            `Limit resets on ${resetDate}.`
          )
          toast.error('Rate limit exceeded', {
            description: `You've used all ${data.limit} researches this month. Resets on ${resetDate}.`,
            action: {
              label: 'Upgrade Plan',
              onClick: () => window.location.href = '/settings',
            },
          })
        } else if (response.status === 400) {
          // Scraping or validation error
          setError(data.error || 'Failed to process the company URL')
          toast.error('Scraping failed', {
            description: data.details || data.error || 'Unable to extract company information. Please try a different URL.',
          })
        } else {
          // Other errors
          setError(data.error || 'An unexpected error occurred')
          toast.error('Error', {
            description: data.error || 'An unexpected error occurred',
          })
        }
        setIsLoading(false)
        return
      }

      // Success
      setCurrentStage('complete')
      setResearch(data.research)
      
      // Update usage stats
      if (usageStats) {
        const newUsage = usageStats.monthlyUsage + 1
        const newRemaining = usageStats.monthlyLimit - newUsage
        const newPercentage = Math.round((newUsage / usageStats.monthlyLimit) * 100)
        
        setUsageStats({
          ...usageStats,
          monthlyUsage: newUsage,
          remaining: newRemaining,
          usagePercentage: newPercentage,
        })

        // Warn if usage is getting low
        if (newRemaining <= 2 && newRemaining > 0) {
          toast.warning('Low usage remaining', {
            description: `You have only ${newRemaining} research${newRemaining === 1 ? '' : 'es'} left this month.`,
            action: {
              label: 'Upgrade',
              onClick: () => window.location.href = '/settings',
            },
          })
        }
      }
      
      toast.success('Email generated successfully!', {
        description: `Personalized email created for ${data.research.companyName}`,
      })
    } catch (err) {
      setError('Network error. Please check your connection and try again.')
      toast.error('Network error', {
        description: 'Please check your connection and try again.',
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleUpdateResearch = async (updates: Partial<Research>) => {
    if (!research) return

    try {
      const response = await fetch(`/api/researches/${research.id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(updates),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to update research')
      }

      // Update local state
      setResearch(data.research)
    } catch (err) {
      throw err // Re-throw to let the component handle the error
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      <div className="space-y-6">
          {/* Header */}
          <div className="space-y-2">
            <h1 className="text-3xl font-bold tracking-tight">Generate Research</h1>
            <p className="text-muted-foreground">
              Enter a company URL to generate a personalized outreach email in seconds
            </p>
          </div>

          {/* Usage Stats Card */}
          {loadingStats ? (
            <StatsCardSkeleton />
          ) : usageStats && (
            <Card>
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <TrendingUp className="h-4 w-4 text-muted-foreground" />
                    <CardTitle className="text-base">Monthly Usage</CardTitle>
                  </div>
                  <CardDescription className="text-sm font-medium">
                    {usageStats.remaining} remaining
                  </CardDescription>
                </div>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {usageStats.monthlyUsage} / {usageStats.monthlyLimit} used
                    </span>
                    <span className="text-muted-foreground">
                      {usageStats.usagePercentage}%
                    </span>
                  </div>
                  <div className="w-full bg-secondary rounded-full h-2">
                    <div
                      className={`h-2 rounded-full transition-all ${
                        usageStats.usagePercentage >= 90
                          ? 'bg-destructive'
                          : usageStats.usagePercentage >= 70
                          ? 'bg-yellow-500'
                          : 'bg-primary'
                      }`}
                      style={{ width: `${Math.min(usageStats.usagePercentage, 100)}%` }}
                    />
                  </div>
                  <p className="text-xs text-muted-foreground">
                    Resets on {new Date(usageStats.resetDate).toLocaleDateString()}
                  </p>
                  {usageStats.remaining === 0 && (
                    <div className="pt-2">
                      <Button asChild size="sm" className="w-full">
                        <Link href="/settings">Upgrade Plan</Link>
                      </Button>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Research Form */}
          <ResearchForm onSubmit={handleSubmit} isLoading={isLoading} />

          {/* Error Message */}
          {error && (
            <Card className="border-destructive">
              <CardHeader className="pb-3">
                <div className="flex items-center gap-2">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                  <CardTitle className="text-base">Error</CardTitle>
                </div>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">{error}</p>
                {error.includes('Rate limit exceeded') && (
                  <div className="mt-4">
                    <Button asChild size="sm">
                      <Link href="/settings">Upgrade Plan</Link>
                    </Button>
                  </div>
                )}
              </CardContent>
            </Card>
          )}

          {/* Progress Indicator */}
          {isLoading && <ProgressIndicator currentStage={currentStage} />}

          {/* Research Results */}
          {research && !isLoading && (
            <ResearchResults research={research} onUpdate={handleUpdateResearch} />
          )}
        </div>
      </div>
  )
}
