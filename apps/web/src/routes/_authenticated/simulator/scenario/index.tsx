import { createFileRoute } from '@tanstack/react-router'
import { Scenario } from '@/features/scenario'

export const Route = createFileRoute('/_authenticated/simulator/scenario/')({
  component: Scenario,
})
