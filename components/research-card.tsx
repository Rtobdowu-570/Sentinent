'use client'

import { useState, memo } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Heart, Eye, Edit2, Trash2, ChevronDown, ChevronUp, Download } from 'lucide-react'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import TagManager from './tag-manager'
import EmailEditor from './email-editor'
import { exportAsJSON, exportAsCSV } from '@/lib/export-utils'
import { toast } from 'sonner'

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

interface ResearchCardProps {
  research: Research
  onUpdate: (updates: Partial<Research>) => Promise<void>
  onDelete: () => Promise<void>
}

const ResearchCard = memo(function ResearchCard({ research, onUpdate, onDelete }: ResearchCardProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [showDeleteDialog, setShowDeleteDialog] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
    })
  }

  const formatTime = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleTimeString('en-US', {
      hour: 'numeric',
      minute: '2-digit',
    })
  }

  const handleToggleFavorite = async () => {
    await onUpdate({ isFavorite: !research.isFavorite })
  }

  const handleDelete = async () => {
    setIsDeleting(true)
    try {
      await onDelete()
      setShowDeleteDialog(false)
    } catch (error) {
      setIsDeleting(false)
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
    <>
      <Card>
        <CardHeader>
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-1">
                <CardTitle className="truncate">{research.companyName}</CardTitle>
                {research.isFavorite && (
                  <Heart className="h-4 w-4 fill-red-500 text-red-500 flex-shrink-0" />
                )}
              </div>
              <CardDescription className="truncate">{research.companyUrl}</CardDescription>
              <div className="flex items-center gap-2 mt-2 text-xs text-muted-foreground">
                <span>
                  {formatDate(research.generatedAt)} at {formatTime(research.generatedAt)}
                </span>
              </div>
            </div>
            <div className="flex gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="icon"
                onClick={handleToggleFavorite}
                title={research.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
                aria-label={research.isFavorite ? 'Remove from favorites' : 'Add to favorites'}
              >
                <Heart className={`h-4 w-4 ${research.isFavorite ? 'fill-red-500 text-red-500' : ''}`} aria-hidden="true" />
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsExpanded(!isExpanded)}
                title={isExpanded ? 'Collapse' : 'Expand'}
                aria-label={isExpanded ? 'Collapse details' : 'Expand details'}
                aria-expanded={isExpanded}
              >
                {isExpanded ? <ChevronUp className="h-4 w-4" aria-hidden="true" /> : <Eye className="h-4 w-4" aria-hidden="true" />}
              </Button>
              <Button
                variant="outline"
                size="icon"
                onClick={() => setIsEditing(!isEditing)}
                title="Edit email"
                aria-label="Edit email"
              >
                <Edit2 className="h-4 w-4" aria-hidden="true" />
              </Button>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant="outline"
                    size="icon"
                    title="Export research"
                    aria-label="Export research"
                  >
                    <Download className="h-4 w-4" aria-hidden="true" />
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
              <Button
                variant="outline"
                size="icon"
                onClick={() => setShowDeleteDialog(true)}
                title="Delete research"
                aria-label="Delete research"
              >
                <Trash2 className="h-4 w-4" aria-hidden="true" />
              </Button>
            </div>
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          {/* Tags */}
          <TagManager
            tags={research.tags}
            onUpdateTags={(tags: string[]) => onUpdate({ tags })}
          />

          {/* Email Preview */}
          {!isExpanded && (
            <div className="space-y-2">
              <p className="text-sm font-medium">Email Subject:</p>
              <p className="text-sm text-muted-foreground truncate">{research.emailSubject}</p>
            </div>
          )}

          {/* Expanded View */}
          {isExpanded && !isEditing && (
            <div className="space-y-4">
              <div className="space-y-2">
                <p className="text-sm font-medium">Email Subject:</p>
                <p className="text-sm p-3 bg-muted rounded-md">{research.emailSubject}</p>
              </div>
              <div className="space-y-2">
                <p className="text-sm font-medium">Email Body:</p>
                <div className="text-sm p-3 bg-muted rounded-md whitespace-pre-wrap max-h-96 overflow-y-auto">
                  {research.emailBody}
                </div>
              </div>
            </div>
          )}

          {/* Edit Mode */}
          {isEditing && (
            <EmailEditor
              emailSubject={research.emailSubject}
              emailBody={research.emailBody}
              onSave={async (subject: string, body: string) => {
                await onUpdate({ emailSubject: subject, emailBody: body })
                setIsEditing(false)
              }}
              onCancel={() => setIsEditing(false)}
            />
          )}
        </CardContent>
      </Card>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Research</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete the research for {research.companyName}? This action
              cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={isDeleting}>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? 'Deleting...' : 'Delete'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  )
})

export default ResearchCard
