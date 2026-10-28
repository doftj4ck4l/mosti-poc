import { createFileRoute } from '@tanstack/react-router'
import { DataCatalog } from '@/features/data-catalog'

export const Route = createFileRoute('/_authenticated/data-sources/')({
  component: DataCatalog,
})
