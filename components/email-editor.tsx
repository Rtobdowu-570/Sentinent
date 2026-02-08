'use client'

import { useState, memo } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { toast } from 'sonner'

interface EmailEditorProps {
  emailSubject: string
  emailBody: string
  onSave: (subject: string, body: string) => Promise<void>
  onCancel: () => void
}

const EmailEditor = memo(function EmailEditor({
  emailSubject,
  emailBody,
  onSave,
  onCancel,
}: EmailEditorProps) {
  const [subject, setSubject] = useState(emailSubject)
  const [body, setBody] = useState(emailBody)
  const [isSaving, setIsSaving] = useState(false)

  const handleSave = async () => {
    if (!subject.trim()) {
      toast.error('Email subject cannot be empty')
      return
    }

    if (!body.trim()) {
      toast.error('Email body cannot be empty')
      return
    }

    setIsSaving(true)
    try {
      await onSave(subject, body)
      toast.success('Email updated successfully!')
    } catch (error) {
      toast.error('Failed to update email')
      setIsSaving(false)
    }
  }

  const hasChanges = subject !== emailSubject || body !== emailBody

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <label htmlFor="email-subject" className="text-sm font-medium">
          Email Subject
        </label>
        <Input
          id="email-subject"
          value={subject}
          onChange={(e) => setSubject(e.target.value)}
          disabled={isSaving}
          placeholder="Enter email subject"
        />
      </div>

      <div className="space-y-2">
        <label htmlFor="email-body" className="text-sm font-medium">
          Email Body
        </label>
        <Textarea
          id="email-body"
          value={body}
          onChange={(e) => setBody(e.target.value)}
          disabled={isSaving}
          placeholder="Enter email body"
          rows={12}
          className="resize-none"
        />
      </div>

      <div className="flex gap-2 justify-end">
        <Button variant="outline" onClick={onCancel} disabled={isSaving}>
          Cancel
        </Button>
        <Button onClick={handleSave} disabled={isSaving || !hasChanges}>
          {isSaving ? 'Saving...' : 'Save Changes'}
        </Button>
      </div>
    </div>
  )
})

export default EmailEditor
