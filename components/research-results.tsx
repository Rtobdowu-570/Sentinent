'use client'

import { useState, memo } from 'react'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'
import { Copy, Edit2, Heart, Tag, Check, X, Download } from 'lucide-react'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { toast } from 'sonner'
import { exportAsJSON, exportAsCSV } from '@/lib/export-utils'

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

interface ResearchResultsProps {
  research: Research
  onUpdate?: (updates: Partial<Research>) => Promise<void>
}

const ResearchResults = memo(function ResearchResults({ research, onUpdate }: ResearchResultsProps) {
  const [isEditing, setIsEditing] = useState(false)
  const [editedSubject, setEditedSubject] = useState(research.emailSubject)
  const [editedBody, setEditedBody] = useState(research.emailBody)
  const [isSaving, setIsSaving] = useState(false)
  const [isAddingTag, setIsAddingTag] = useState(false)
  const [newTag, setNewTag] = useState('')

  const handleCopy = async () => {
    const emailContent = `Subject: ${research.emailSubject}\n\n${research.emailBody}`
    try {
      await navigator.clipboard.writeText(emailContent)
      toast.success('Email copied to clipboard!')
    } catch (error) {
      toast.error('Failed to copy to clipboard')
    }
  }

  const handleSaveEdit = async () => {
    if (!onUpdate) return
    
    setIsSaving(true)
    try {
      await onUpdate({
        emailSubject: editedSubject,
        emailBody: editedBody
      })
      setIsEditing(false)
      toast.success('Email updated successfully!')
    } catch (error) {
      toast.error('Failed to update email')
    } finally {
      setIsSaving(false)
    }
  }

  const handleCancelEdit = () => {
    setEditedSubject(research.emailSubject)
    setEditedBody(research.emailBody)
    setIsEditing(false)
  }

  const handleToggleFavorite = async () => {
    if (!onUpdate) return
    
    try {
      await onUpdate({ isFavorite: !research.isFavorite })
      toast.success(research.isFavorite ? 'Removed from favorites' : 'Added to favorites')
    } catch (error) {
      toast.error('Failed to update favorite status')
    }
  }

  const handleAddTag = async () => {
    if (!onUpdate || !newTag.trim()) return
    
    const trimmedTag = newTag.trim()
    if (research.tags.includes(trimmedTag)) {
      toast.error('Tag already exists')
      return
    }

    try {
      await onUpdate({ tags: [...research.tags, trimmedTag] })
      setNewTag('')
      setIsAddingTag(false)
      toast.success('Tag added successfully!')
    } catch (error) {
      toast.error('Failed to add tag')
    }
  }

  const handleRemoveTag = async (tagToRemove: string) => {
    if (!onUpdate) return
    
    try {
      await onUpdate({ tags: research.tags.filter(t => t !== tagToRemove) })
      toast.success('Tag removed successfully!')
    } catch (error) {
      toast.error('Failed to remove tag')
    }
  }

  const handleExportJSON = () => {
    try {
      exportAsJSON(research)
      toast.success('Research exported as JSON!')
    } catch (error) {
      toast.error('Failed to export research')
    }
  }

  const handleExportCSV = () => {
    try {
      exportAsCSV(research)
      toast.success('Research exported as CSV!')
    } catch (error) {
      toast.error('Failed to export research')
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start justify-between">
          <div className="space-y-1">
            <CardTitle>{research.companyName}</CardTitle>
            <CardDescription>{research.companyUrl}</CardDescription>
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="icon"
              onClick={handleToggleFavorite}
              disabled={!onUpdate}
            >
              <Heart 
                className={`h-4 w-4 ${research.isFavorite ? 'fill-red-500 text-red-500' : ''}`} 
              />
            </Button>
            {!isEditing && (
              <>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => setIsEditing(true)}
                  disabled={!onUpdate}
                >
                  <Edit2 className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={handleCopy}
                >
                  <Copy className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                    >
                      <Download className="h-4 w-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleExportJSON}>
                      Export as JSON
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={handleExportCSV}>
                      Export as CSV
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </>
            )}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Tags Section */}
        <div className="space-y-2">
          <div className="flex items-center gap-2 flex-wrap">
            {research.tags.map((tag) => (
              <Badge key={tag} variant="secondary" className="gap-1">
                {tag}
                {onUpdate && (
                  <button
                    onClick={() => handleRemoveTag(tag)}
                    className="ml-1 hover:text-destructive"
                    aria-label={`Remove tag ${tag}`}
                  >
                    <X className="h-3 w-3" />
                  </button>
                )}
              </Badge>
            ))}
            {onUpdate && !isAddingTag && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => setIsAddingTag(true)}
              >
                <Tag className="h-3 w-3 mr-1" />
                Add Tag
              </Button>
            )}
          </div>
          {isAddingTag && (
            <div className="flex gap-2">
              <Input
                placeholder="Enter tag name"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleAddTag()
                  } else if (e.key === 'Escape') {
                    setIsAddingTag(false)
                    setNewTag('')
                  }
                }}
                autoFocus
              />
              <Button size="icon" onClick={handleAddTag}>
                <Check className="h-4 w-4" />
              </Button>
              <Button 
                size="icon" 
                variant="outline" 
                onClick={() => {
                  setIsAddingTag(false)
                  setNewTag('')
                }}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>

        {/* Email Content */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Subject</label>
            {isEditing ? (
              <Input
                value={editedSubject}
                onChange={(e) => setEditedSubject(e.target.value)}
              />
            ) : (
              <p className="text-sm p-3 bg-muted rounded-md">{research.emailSubject}</p>
            )}
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Body</label>
            {isEditing ? (
              <Textarea
                value={editedBody}
                onChange={(e) => setEditedBody(e.target.value)}
                rows={12}
              />
            ) : (
              <div className="text-sm p-3 bg-muted rounded-md whitespace-pre-wrap">
                {research.emailBody}
              </div>
            )}
          </div>
        </div>

        {/* Edit Actions */}
        {isEditing && (
          <div className="flex gap-2 justify-end">
            <Button
              variant="outline"
              onClick={handleCancelEdit}
              disabled={isSaving}
            >
              Cancel
            </Button>
            <Button
              onClick={handleSaveEdit}
              disabled={isSaving}
            >
              {isSaving ? 'Saving...' : 'Save Changes'}
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  )
})

export default ResearchResults
