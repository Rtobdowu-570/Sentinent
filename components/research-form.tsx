'use client'

import { useState, memo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Loader2 } from 'lucide-react'

interface ResearchFormProps {
  onSubmit: (url: string) => Promise<void>
  isLoading: boolean
}

const ResearchForm = memo(function ResearchForm({ onSubmit, isLoading }: ResearchFormProps) {
  const [url, setUrl] = useState('')
  const [error, setError] = useState('')

  const validateUrl = (input: string): boolean => {
    try {
      const urlObj = new URL(input)
      return urlObj.protocol === 'http:' || urlObj.protocol === 'https:'
    } catch {
      return false
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')

    if (!url.trim()) {
      setError('Please enter a company URL')
      return
    }

    if (!validateUrl(url)) {
      setError('Please enter a valid URL (e.g., https://example.com)')
      return
    }

    await onSubmit(url)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Generate Outreach Email</CardTitle>
        <CardDescription>
          Enter a company URL to generate a personalized outreach email in seconds
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4" aria-label="Research generation form">
          <div className="space-y-2">
            <label htmlFor="company-url" className="sr-only">
              Company URL
            </label>
            <Input
              id="company-url"
              type="text"
              placeholder="https://example.com"
              value={url}
              onChange={(e) => {
                setUrl(e.target.value)
                setError('')
              }}
              disabled={isLoading}
              className={error ? 'border-destructive' : ''}
              aria-invalid={!!error}
              aria-describedby={error ? 'url-error' : undefined}
            />
            {error && (
              <p id="url-error" className="text-sm text-destructive" role="alert">
                {error}
              </p>
            )}
          </div>
          <Button 
            type="submit" 
            disabled={isLoading}
            className="w-full"
            aria-busy={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" aria-hidden="true" />
                Generating...
              </>
            ) : (
              'Generate Email'
            )}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
})

export default ResearchForm
