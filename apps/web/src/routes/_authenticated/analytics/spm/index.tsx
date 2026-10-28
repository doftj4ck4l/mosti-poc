import { createFileRoute } from '@tanstack/react-router'
import { SpmIntelligence } from '@/features/spm'

export const Route = createFileRoute('/_authenticated/analytics/spm/')({
  component: SpmIntelligence,
})
