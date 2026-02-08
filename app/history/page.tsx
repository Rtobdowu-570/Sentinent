'use client'

import { useEffect, useState } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import HistoryTable from '@/components/history-table'
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
  scrapedData: any
  newsArticles: any
  linkedinData: any
  insights: any
}

interface ResearchesResponse {
  success: boolean
  researches: Research[]
  total: number
  page: number
  limit: number
  totalPages: number
  error?: string
}

export default function HistoryPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  
  const [researches, setResearches] = useState<Research[]>([])
  const [total, setTotal] = useState(0)
  const [page, setPage] = useState(1)
  const [limit] = useState(10)
  const [totalPages, setTotalPages] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  
  const [searchQuery, setSearchQuery] = useState('')
  const [favoriteFilter, setFavoriteFilter] = useState(false)
  const [tagFilter, setTagFilter] = useState<string | null>(null)

  const fetchResearches = async () => {
    setIsLoading(true)
    try {
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString(),
      })

      if (searchQuery) {
        params.append('search', searchQuery)
      }

      if (favoriteFilter) {
        params.append('favorite', 'true')
      }

      if (tagFilter) {
        params.append('tag', tagFilter)
      }

      const response = await fetch(`/api/researches?${params.toString()}`)
      const data: ResearchesResponse = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to fetch researches')
      }

      if (data.success) {
        setResearches(data.researches)
        setTotal(data.total)
        setTotalPages(data.totalPages)
      } else {
        throw new Error(data.error || 'Failed to fetch researches')
      }
    } catch (error) {
      console.error('Error fetching researches:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to load research history')
    } finally {
      setIsLoading(false)
    }
  }

  useEffect(() => {
    fetchResearches()
  }, [page, searchQuery, favoriteFilter, tagFilter])

  const handleSearch = (search: string) => {
    setSearchQuery(search)
    setPage(1) // Reset to first page on new search
  }

  const handleFilterFavorites = (enabled: boolean) => {
    setFavoriteFilter(enabled)
    setPage(1) // Reset to first page on filter change
  }

  const handleFilterTag = (tag: string | null) => {
    setTagFilter(tag)
    setPage(1) // Reset to first page on filter change
  }

  const handlePageChange = (newPage: number) => {
    setPage(newPage)
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }

  const handleUpdate = async (id: string, updates: Partial<Research>) => {
    try {
      const response = await fetch(`/api/researches/${id}`, {
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

      if (data.success) {
        // Update local state
        setResearches((prev) =>
          prev.map((r) => (r.id === id ? { ...r, ...updates } : r))
        )
      } else {
        throw new Error(data.error || 'Failed to update research')
      }
    } catch (error) {
      console.error('Error updating research:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to update research')
      throw error
    }
  }

  const handleDelete = async (id: string) => {
    try {
      const response = await fetch(`/api/researches/${id}`, {
        method: 'DELETE',
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || 'Failed to delete research')
      }

      if (data.success) {
        // Remove from local state
        setResearches((prev) => prev.filter((r) => r.id !== id))
        setTotal((prev) => prev - 1)
        toast.success('Research deleted successfully!')
        
        // Refetch if current page is now empty
        if (researches.length === 1 && page > 1) {
          setPage(page - 1)
        } else if (researches.length === 1) {
          fetchResearches()
        }
      } else {
        throw new Error(data.error || 'Failed to delete research')
      }
    } catch (error) {
      console.error('Error deleting research:', error)
      toast.error(error instanceof Error ? error.message : 'Failed to delete research')
      throw error
    }
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold mb-2">Research History</h1>
        <p className="text-muted-foreground">
          View, search, and manage all your generated research entries
        </p>
      </div>

      <HistoryTable
        researches={researches}
        total={total}
        page={page}
        limit={limit}
        totalPages={totalPages}
        onSearch={handleSearch}
        onFilterFavorites={handleFilterFavorites}
        onFilterTag={handleFilterTag}
        onPageChange={handlePageChange}
        onUpdate={handleUpdate}
        onDelete={handleDelete}
        isLoading={isLoading}
      />
    </div>
  )
}
