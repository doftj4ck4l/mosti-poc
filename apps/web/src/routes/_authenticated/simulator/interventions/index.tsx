import { createFileRoute } from '@tanstack/react-router'
import { Interventions } from '@/features/interventions'

export const Route = createFileRoute('/_authenticated/simulator/interventions/')({
  component: Interventions,
})
