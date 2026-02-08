import { toast } from 'sonner'

/**
 * Centralized toast notification messages for consistent user feedback
 * Requirements: 13.1, 13.2, 13.3, 13.4, 13.5
 */

// Success messages
export const toastSuccess = {
  researchCreated: (companyName: string) =>
    toast.success('Email generated successfully!', {
      description: `Personalized email created for ${companyName}`,
    }),

  researchUpdated: () =>
    toast.success('Research updated successfully!'),

  researchDeleted: () =>
    toast.success('Research deleted successfully!'),

  emailCopied: () =>
    toast.success('Email copied to clipboard!'),

  emailUpdated: () =>
    toast.success('Email updated successfully!'),

  favoriteAdded: () =>
    toast.success('Added to favorites'),

  favoriteRemoved: () =>
    toast.success('Removed from favorites'),

  tagAdded: () =>
    toast.success('Tag added successfully!'),

  tagRemoved: () =>
    toast.success('Tag removed successfully!'),

  settingsSaved: () =>
    toast.success('Settings saved successfully!'),
}

// Error messages
export const toastError = {
  // Network and API errors
  networkError: () =>
    toast.error('Network error', {
      description: 'Please check your connection and try again.',
    }),

  apiError: (message?: string) =>
    toast.error('Error', {
      description: message || 'An unexpected error occurred. Please try again.',
    }),

  // Authentication errors
  unauthorized: () =>
    toast.error('Unauthorized', {
      description: 'Please sign in to continue.',
    }),

  // Rate limiting errors
  rateLimitExceeded: (limit: number, resetDate: string) =>
    toast.error('Rate limit exceeded', {
      description: `You've used all ${limit} researches this month. Limit resets on ${new Date(resetDate).toLocaleDateString()}.`,
      action: {
        label: 'Upgrade',
        onClick: () => window.location.href = '/pricing',
      },
    }),

  // Scraping errors
  scrapingFailed: (details?: string) =>
    toast.error('Failed to scrape website', {
      description: details || 'Unable to extract company information. Please try a different URL.',
    }),

  invalidUrl: () =>
    toast.error('Invalid URL', {
      description: 'Please enter a valid company website URL.',
    }),

  // Data operation errors
  loadFailed: (resource: string) =>
    toast.error(`Failed to load ${resource}`, {
      description: 'Please try again or refresh the page.',
    }),

  updateFailed: (resource: string) =>
    toast.error(`Failed to update ${resource}`, {
      description: 'Please try again.',
    }),

  deleteFailed: (resource: string) =>
    toast.error(`Failed to delete ${resource}`, {
      description: 'Please try again.',
    }),

  // Clipboard errors
  clipboardFailed: () =>
    toast.error('Failed to copy to clipboard', {
      description: 'Please try copying manually.',
    }),

  // Tag errors
  tagExists: () =>
    toast.error('Tag already exists', {
      description: 'This tag has already been added.',
    }),

  // Email generation errors
  emailGenerationFailed: (details?: string) =>
    toast.error('Failed to generate email', {
      description: details || 'Unable to create personalized email. Please try again.',
    }),

  // Validation errors
  validationError: (message: string) =>
    toast.error('Validation error', {
      description: message,
    }),
}

// Info messages
export const toastInfo = {
  processing: (stage: string) =>
    toast.info(`Processing: ${stage}`, {
      description: 'This may take a few moments...',
    }),

  remainingUsage: (remaining: number, limit: number) =>
    toast.info('Usage update', {
      description: `You have ${remaining} of ${limit} researches remaining this month.`,
    }),
}

// Warning messages
export const toastWarning = {
  lowUsage: (remaining: number) =>
    toast.warning('Low usage remaining', {
      description: `You have only ${remaining} research${remaining === 1 ? '' : 'es'} left this month.`,
      action: {
        label: 'Upgrade',
        onClick: () => window.location.href = '/pricing',
      },
    }),

  unsavedChanges: () =>
    toast.warning('Unsaved changes', {
      description: 'You have unsaved changes that will be lost.',
    }),
}
