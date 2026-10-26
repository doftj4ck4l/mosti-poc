import { createFileRoute } from '@tanstack/react-router'
import { ModelDiagnostics } from '@/features/model-diagnostics'

export const Route = createFileRoute('/_authenticated/model/')({
  component: ModelDiagnostics,
})
