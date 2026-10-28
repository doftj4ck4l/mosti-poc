import { createFileRoute } from '@tanstack/react-router'
import { I360Page } from '@/features/i360'

export const Route = createFileRoute('/_authenticated/analytics/i360/')({
  component: I360Page,
})
