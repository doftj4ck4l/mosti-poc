import { createFileRoute } from '@tanstack/react-router'
import { Professional } from '@/features/professional'

export const Route = createFileRoute('/_authenticated/analytics/professional/')({
  component: Professional,
})
