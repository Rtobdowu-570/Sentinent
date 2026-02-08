'use client'

import { useState, memo } from 'react'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Tag, X, Check } from 'lucide-react'
import { toast } from 'sonner'

interface TagManagerProps {
  tags: string[]
  onUpdateTags: (tags: string[]) => Promise<void>
}

const TagManager = memo(function TagManager({ tags, onUpdateTags }: TagManagerProps) {
  const [isAddingTag, setIsAddingTag] = useState(false)
  const [newTag, setNewTag] = useState('')
  const [isUpdating, setIsUpdating] = useState(false)

  const handleAddTag = async () => {
    if (!newTag.trim()) {
      toast.error('Tag cannot be empty')
      return
    }

    const trimmedTag = newTag.trim()
    
    if (tags.includes(trimmedTag)) {
      toast.error('Tag already exists')
      return
    }

    setIsUpdating(true)
    try {
      await onUpdateTags([...tags, trimmedTag])
      setNewTag('')
      setIsAddingTag(false)
      toast.success('Tag added successfully!')
    } catch (error) {
      toast.error('Failed to add tag')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleRemoveTag = async (tagToRemove: string) => {
    setIsUpdating(true)
    try {
      await onUpdateTags(tags.filter((t) => t !== tagToRemove))
      toast.success('Tag removed successfully!')
    } catch (error) {
      toast.error('Failed to remove tag')
    } finally {
      setIsUpdating(false)
    }
  }

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Enter') {
      e.preventDefault()
      handleAddTag()
    } else if (e.key === 'Escape') {
      setIsAddingTag(false)
      setNewTag('')
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center gap-2 flex-wrap">
        {tags.map((tag) => (
          <Badge key={tag} variant="secondary" className="gap-1">
            {tag}
            <button
              type="button"
              onClick={() => handleRemoveTag(tag)}
              disabled={isUpdating}
              className="ml-1 hover:text-destructive disabled:opacity-50"
              aria-label={`Remove tag ${tag}`}
            >
              <X className="h-3 w-3" />
            </button>
          </Badge>
        ))}
        
        {!isAddingTag && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setIsAddingTag(true)}
            disabled={isUpdating}
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
            onKeyDown={handleKeyDown}
            disabled={isUpdating}
            autoFocus
            className="max-w-xs"
          />
          <Button 
            size="icon" 
            onClick={handleAddTag}
            disabled={isUpdating || !newTag.trim()}
          >
            <Check className="h-4 w-4" />
          </Button>
          <Button
            size="icon"
            variant="outline"
            onClick={() => {
              setIsAddingTag(false)
              setNewTag('')
            }}
            disabled={isUpdating}
          >
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
})

export default TagManager
