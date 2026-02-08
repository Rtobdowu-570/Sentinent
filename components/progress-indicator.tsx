'use client'

import { memo } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { CheckCircle2, Circle, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'

export type ProgressStage = 'scraping' | 'analyzing' | 'generating' | 'complete'

interface ProgressIndicatorProps {
  currentStage: ProgressStage
}

interface Stage {
  id: ProgressStage
  label: string
  description: string
}

const stages: Stage[] = [
  {
    id: 'scraping',
    label: 'Scraping',
    description: 'Scraping company website...'
  },
  {
    id: 'analyzing',
    label: 'Analyzing',
    description: 'Analyzing recent news...'
  },
  {
    id: 'generating',
    label: 'Generating',
    description: 'Generating personalized email...'
  },
  {
    id: 'complete',
    label: 'Complete',
    description: 'Email generated successfully!'
  }
]

const ProgressIndicator = memo(function ProgressIndicator({ currentStage }: ProgressIndicatorProps) {
  const currentIndex = stages.findIndex(s => s.id === currentStage)

  const getStageStatus = (index: number): 'complete' | 'current' | 'pending' => {
    if (index < currentIndex) return 'complete'
    if (index === currentIndex) return 'current'
    return 'pending'
  }

  return (
    <Card>
      <CardContent className="pt-6">
        <div className="space-y-4">
          {stages.map((stage, index) => {
            const status = getStageStatus(index)
            const isLast = index === stages.length - 1

            return (
              <div key={stage.id}>
                <div className="flex items-start gap-3">
                  <div className="flex flex-col items-center">
                    {status === 'complete' ? (
                      <CheckCircle2 className="h-5 w-5 text-green-500" />
                    ) : status === 'current' ? (
                      <Loader2 className="h-5 w-5 text-primary animate-spin" />
                    ) : (
                      <Circle className="h-5 w-5 text-muted-foreground" />
                    )}
                    {!isLast && (
                      <div 
                        className={cn(
                          "w-0.5 h-8 mt-2",
                          status === 'complete' ? "bg-green-500" : "bg-muted"
                        )}
                      />
                    )}
                  </div>
                  <div className="flex-1 pb-4">
                    <p className={cn(
                      "font-medium",
                      status === 'current' && "text-primary",
                      status === 'complete' && "text-green-500",
                      status === 'pending' && "text-muted-foreground"
                    )}>
                      {stage.label}
                    </p>
                    <p className={cn(
                      "text-sm",
                      status === 'current' && "text-foreground",
                      status === 'complete' && "text-muted-foreground",
                      status === 'pending' && "text-muted-foreground"
                    )}>
                      {stage.description}
                    </p>
                  </div>
                </div>
              </div>
            )
          })}
        </div>
      </CardContent>
    </Card>
  )
})

export default ProgressIndicator
