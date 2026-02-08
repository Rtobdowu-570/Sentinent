'use client'

import { useState, useEffect } from 'react'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Search, Heart, Tag as TagIcon, ChevronLeft, ChevronRight } from 'lucide-react'
import ResearchCard from './research-card'
import { ResearchCardSkeleton } from './skeletons'
import { useDebounce } from '@/hooks/use-debounce'

interface Research {
  id: string
  companyName: string
  companyUrl: string
  emailSubject: string
  emailBody: string
  generatedAt: string
  isFavorite: boolean
  tags: string[]
  scrapedData: any
  newsArticles: any
  linkedinData: any
  insights: any
}

interface HistoryTableProps {
  researches: Research[]
  total: number
  page: number
  limit: number
  totalPages: number
  onSearch: (search: string) => void
  onFilterFavorites: (enabled: boolean) => void
  onFilterTag: (tag: string | null) => void
  onPageChange: (page: number) => void
  onUpdate: (id: string, updates: Partial<Research>) => Promise<void>
  onDelete: (id: string) => Promise<void>
  onView?: (id: string) => void
  isLoading?: boolean
}

export default function HistoryTable({
  researches,
  total,
  page,
  limit,
  totalPages,
  onSearch,
  onFilterFavorites,
  onFilterTag,
  onPageChange,
  onUpdate,
  onDelete,
  onView,
  isLoading = false,
}: HistoryTableProps) {
  const [searchInput, setSearchInput] = useState('')
  const [favoritesFilter, setFavoritesFilter] = useState(false)
  const [selectedTag, setSelectedTag] = useState<string | null>(null)
  
  // Debounce search input
  const debouncedSearch = useDebounce(searchInput, 500)

  // Trigger search when debounced value changes
  useEffect(() => {
    onSearch(debouncedSearch)
  }, [debouncedSearch, onSearch])

  // Extract all unique tags from researches
  const allTags = Array.from(
    new Set(researches.flatMap((r) => r.tags))
  ).sort()

  const handleToggleFavorites = () => {
    const newValue = !favoritesFilter
    setFavoritesFilter(newValue)
    onFilterFavorites(newValue)
  }

  const handleTagFilter = (tag: string) => {
    if (selectedTag === tag) {
      setSelectedTag(null)
      onFilterTag(null)
    } else {
      setSelectedTag(tag)
      onFilterTag(tag)
    }
  }

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="space-y-4">
        {/* Search Bar */}
        <div className="flex gap-2">
          <div className="relative flex-1">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" aria-hidden="true" />
            <label htmlFor="search-input" className="sr-only">
              Search research entries
            </label>
            <Input
              id="search-input"
              type="text"
              placeholder="Search by company name, URL, or tags..."
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              className="pl-10"
              disabled={isLoading}
              aria-label="Search by company name, URL, or tags"
            />
          </div>
        </div>

        {/* Filter Buttons */}
        <div className="flex flex-wrap gap-2" role="group" aria-label="Filter options">
          <Button
            variant={favoritesFilter ? 'default' : 'outline'}
            size="sm"
            onClick={handleToggleFavorites}
            disabled={isLoading}
            aria-pressed={favoritesFilter}
            aria-label={favoritesFilter ? 'Remove favorites filter' : 'Filter by favorites'}
          >
            <Heart className={`h-4 w-4 mr-2 ${favoritesFilter ? 'fill-current' : ''}`} aria-hidden="true" />
            Favorites
          </Button>

          {allTags.length > 0 && (
            <>
              <div className="flex items-center">
                <TagIcon className="h-4 w-4 text-muted-foreground mr-2" aria-hidden="true" />
                <span className="text-sm text-muted-foreground">Tags:</span>
              </div>
              {allTags.map((tag) => (
                <Badge
                  key={tag}
                  variant={selectedTag === tag ? 'default' : 'outline'}
                  className="cursor-pointer"
                  onClick={() => handleTagFilter(tag)}
                  role="button"
                  tabIndex={0}
                  onKeyDown={(e) => {
                    if (e.key === 'Enter' || e.key === ' ') {
                      e.preventDefault()
                      handleTagFilter(tag)
                    }
                  }}
                  aria-pressed={selectedTag === tag}
                  aria-label={`Filter by tag: ${tag}`}
                >
                  {tag}
                </Badge>
              ))}
            </>
          )}
        </div>
      </div>

      {/* Results Count */}
      <div className="text-sm text-muted-foreground" role="status" aria-live="polite">
        Showing {researches.length} of {total} research {total === 1 ? 'entry' : 'entries'}
      </div>

      {/* Research Cards */}
      {isLoading ? (
        <div className="space-y-4" role="status" aria-label="Loading research entries">
          {[...Array(3)].map((_, i) => (
            <ResearchCardSkeleton key={i} />
          ))}
        </div>
      ) : researches.length === 0 ? (
        <div className="text-center py-12" role="status">
          <p className="text-muted-foreground">No research entries found</p>
          {(searchInput || favoritesFilter || selectedTag) && (
            <Button
              variant="link"
              onClick={() => {
                setSearchInput('')
                setFavoritesFilter(false)
                setSelectedTag(null)
                onFilterFavorites(false)
                onFilterTag(null)
              }}
              className="mt-2"
            >
              Clear filters
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-4" role="list" aria-label="Research entries">
          {researches.map((research) => (
            <div key={research.id} role="listitem">
              <ResearchCard
                research={research}
                onUpdate={(updates) => onUpdate(research.id, updates)}
                onDelete={() => onDelete(research.id)}
              />
            </div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <nav className="flex items-center justify-between" aria-label="Pagination">
          <div className="text-sm text-muted-foreground" aria-live="polite">
            Page {page} of {totalPages}
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page - 1)}
              disabled={page === 1 || isLoading}
              aria-label="Go to previous page"
            >
              <ChevronLeft className="h-4 w-4 mr-1" aria-hidden="true" />
              Previous
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={() => onPageChange(page + 1)}
              disabled={page === totalPages || isLoading}
              aria-label="Go to next page"
            >
              Next
              <ChevronRight className="h-4 w-4 ml-1" aria-hidden="true" />
            </Button>
          </div>
        </nav>
      )}
    </div>
  )
}
