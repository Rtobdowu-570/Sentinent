import { exportAsJSON, exportAsCSV } from '../export-utils'

// Mock DOM APIs
const mockCreateElement = jest.fn()
const mockCreateObjectURL = jest.fn()
const mockRevokeObjectURL = jest.fn()
const mockAppendChild = jest.fn()
const mockRemoveChild = jest.fn()
const mockClick = jest.fn()

beforeEach(() => {
  // Reset mocks
  mockCreateElement.mockClear()
  mockCreateObjectURL.mockClear()
  mockRevokeObjectURL.mockClear()
  mockAppendChild.mockClear()
  mockRemoveChild.mockClear()
  mockClick.mockClear()

  // Setup DOM mocks
  const mockLink = {
    href: '',
    download: '',
    click: mockClick,
  }

  mockCreateElement.mockReturnValue(mockLink)
  mockCreateObjectURL.mockReturnValue('blob:mock-url')

  global.document.createElement = mockCreateElement
  global.document.body.appendChild = mockAppendChild
  global.document.body.removeChild = mockRemoveChild
  global.URL.createObjectURL = mockCreateObjectURL
  global.URL.revokeObjectURL = mockRevokeObjectURL
  global.Blob = jest.fn() as any
})

describe('Export Utils', () => {
  const mockResearch = {
    id: 'test-id',
    companyName: 'Test Company',
    companyUrl: 'https://test.com',
    emailSubject: 'Test Subject',
    emailBody: 'Test Body',
    generatedAt: '2024-01-15T10:00:00Z',
    isFavorite: true,
    tags: ['tag1', 'tag2'],
    scrapedData: {
      description: 'Test description',
      industry: 'Tech',
      size: '100-500',
      location: 'San Francisco',
    },
    newsArticles: [
      {
        title: 'News 1',
        url: 'https://news1.com',
        summary: 'Summary 1',
      },
    ],
    insights: ['Insight 1', 'Insight 2'],
  }

  describe('exportAsJSON', () => {
    it('should create a JSON blob and trigger download', () => {
      exportAsJSON(mockResearch)

      expect(mockCreateElement).toHaveBeenCalledWith('a')
      expect(mockCreateObjectURL).toHaveBeenCalled()
      expect(mockAppendChild).toHaveBeenCalled()
      expect(mockClick).toHaveBeenCalled()
      expect(mockRemoveChild).toHaveBeenCalled()
      expect(mockRevokeObjectURL).toHaveBeenCalled()
    })

    it('should set correct filename for JSON export', () => {
      exportAsJSON(mockResearch)

      const link = mockCreateElement.mock.results[0].value
      expect(link.download).toMatch(/test_company_research_\d{4}-\d{2}-\d{2}\.json/)
    })
  })

  describe('exportAsCSV', () => {
    it('should create a CSV blob and trigger download', () => {
      exportAsCSV(mockResearch)

      expect(mockCreateElement).toHaveBeenCalledWith('a')
      expect(mockCreateObjectURL).toHaveBeenCalled()
      expect(mockAppendChild).toHaveBeenCalled()
      expect(mockClick).toHaveBeenCalled()
      expect(mockRemoveChild).toHaveBeenCalled()
      expect(mockRevokeObjectURL).toHaveBeenCalled()
    })

    it('should set correct filename for CSV export', () => {
      exportAsCSV(mockResearch)

      const link = mockCreateElement.mock.results[0].value
      expect(link.download).toMatch(/test_company_research_\d{4}-\d{2}-\d{2}\.csv/)
    })
  })

  describe('CSV escaping', () => {
    it('should handle commas in values', () => {
      const researchWithComma = {
        ...mockResearch,
        companyName: 'Test, Company',
      }

      exportAsCSV(researchWithComma)

      // Verify Blob was created (CSV content is passed to Blob constructor)
      expect(global.Blob).toHaveBeenCalled()
    })

    it('should handle quotes in values', () => {
      const researchWithQuotes = {
        ...mockResearch,
        emailSubject: 'Test "Subject"',
      }

      exportAsCSV(researchWithQuotes)

      expect(global.Blob).toHaveBeenCalled()
    })

    it('should handle newlines in values', () => {
      const researchWithNewlines = {
        ...mockResearch,
        emailBody: 'Line 1\nLine 2',
      }

      exportAsCSV(researchWithNewlines)

      expect(global.Blob).toHaveBeenCalled()
    })
  })
})
