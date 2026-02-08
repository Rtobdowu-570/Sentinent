// Utility functions for exporting research data

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

/**
 * Export research data as JSON file
 */
export function exportAsJSON(research: Research): void {
  const dataStr = JSON.stringify(research, null, 2)
  const dataBlob = new Blob([dataStr], { type: 'application/json' })
  const url = URL.createObjectURL(dataBlob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `${sanitizeFilename(research.companyName)}_research_${formatDateForFilename(research.generatedAt)}.json`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Export research data as CSV file
 */
export function exportAsCSV(research: Research): void {
  const csvRows: string[] = []
  
  // Header row
  csvRows.push('Field,Value')
  
  // Basic fields
  csvRows.push(`Company Name,${escapeCsvValue(research.companyName)}`)
  csvRows.push(`Company URL,${escapeCsvValue(research.companyUrl)}`)
  csvRows.push(`Email Subject,${escapeCsvValue(research.emailSubject)}`)
  csvRows.push(`Email Body,${escapeCsvValue(research.emailBody)}`)
  csvRows.push(`Generated At,${escapeCsvValue(research.generatedAt)}`)
  csvRows.push(`Is Favorite,${research.isFavorite}`)
  csvRows.push(`Tags,${escapeCsvValue(research.tags.join('; '))}`)
  
  // Scraped data
  if (research.scrapedData) {
    csvRows.push(`Scraped Description,${escapeCsvValue(research.scrapedData.description || '')}`)
    csvRows.push(`Industry,${escapeCsvValue(research.scrapedData.industry || '')}`)
    csvRows.push(`Company Size,${escapeCsvValue(research.scrapedData.size || '')}`)
    csvRows.push(`Location,${escapeCsvValue(research.scrapedData.location || '')}`)
  }
  
  // News articles
  if (research.newsArticles && Array.isArray(research.newsArticles)) {
    research.newsArticles.forEach((article: any, index: number) => {
      csvRows.push(`News Article ${index + 1} Title,${escapeCsvValue(article.title || '')}`)
      csvRows.push(`News Article ${index + 1} URL,${escapeCsvValue(article.url || '')}`)
      csvRows.push(`News Article ${index + 1} Summary,${escapeCsvValue(article.summary || '')}`)
    })
  }
  
  // Insights
  if (research.insights && Array.isArray(research.insights)) {
    research.insights.forEach((insight: string, index: number) => {
      csvRows.push(`Insight ${index + 1},${escapeCsvValue(insight)}`)
    })
  }
  
  const csvContent = csvRows.join('\n')
  const dataBlob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' })
  const url = URL.createObjectURL(dataBlob)
  
  const link = document.createElement('a')
  link.href = url
  link.download = `${sanitizeFilename(research.companyName)}_research_${formatDateForFilename(research.generatedAt)}.csv`
  document.body.appendChild(link)
  link.click()
  document.body.removeChild(link)
  URL.revokeObjectURL(url)
}

/**
 * Escape CSV values to handle commas, quotes, and newlines
 */
function escapeCsvValue(value: string): string {
  if (value === null || value === undefined) {
    return ''
  }
  
  const stringValue = String(value)
  
  // If value contains comma, quote, or newline, wrap in quotes and escape existing quotes
  if (stringValue.includes(',') || stringValue.includes('"') || stringValue.includes('\n')) {
    return `"${stringValue.replace(/"/g, '""')}"`
  }
  
  return stringValue
}

/**
 * Sanitize filename to remove invalid characters
 */
function sanitizeFilename(filename: string): string {
  return filename
    .replace(/[^a-z0-9]/gi, '_')
    .replace(/_+/g, '_')
    .toLowerCase()
}

/**
 * Format date for filename (YYYY-MM-DD)
 */
function formatDateForFilename(dateString: string): string {
  const date = new Date(dateString)
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}
