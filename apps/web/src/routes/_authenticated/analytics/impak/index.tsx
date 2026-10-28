import { createFileRoute } from '@tanstack/react-router'
import { Impak } from '@/features/impak'

export const Route = createFileRoute('/_authenticated/analytics/impak/')({
  component: Impak,
})
