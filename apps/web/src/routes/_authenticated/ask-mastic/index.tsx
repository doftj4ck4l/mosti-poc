import { createFileRoute } from '@tanstack/react-router'
import { AskMastic } from '@/features/ask-mastic'

export const Route = createFileRoute('/_authenticated/ask-mastic/')({
  component: AskMastic,
})
