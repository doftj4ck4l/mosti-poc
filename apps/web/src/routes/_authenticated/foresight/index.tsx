import { createFileRoute } from '@tanstack/react-router'
import { Foresight } from '@/features/foresight'

export const Route = createFileRoute('/_authenticated/foresight/')({
  component: Foresight,
})
