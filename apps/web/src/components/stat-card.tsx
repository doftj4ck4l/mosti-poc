import { type ReactNode } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

interface StatCardProps {
  title: string
  value: ReactNode
  sub?: ReactNode
  icon?: ReactNode
  danger?: boolean
  good?: boolean
  className?: string
}

export function StatCard({
  title,
  value,
  sub,
  icon,
  danger,
  good,
  className,
}: StatCardProps) {
  return (
    <Card className={className}>
      <CardHeader className='flex flex-row items-center justify-between space-y-0 pb-2'>
        <CardTitle className='text-sm font-medium'>{title}</CardTitle>
        {icon && <span className='text-muted-foreground [&_svg]:size-4'>{icon}</span>}
      </CardHeader>
      <CardContent>
        <div
          className={cn(
            'text-2xl font-bold',
            danger && 'text-red-600 dark:text-red-400',
            good && 'text-emerald-600 dark:text-emerald-400'
          )}
        >
          {value}
        </div>
        {sub && <p className='text-xs text-muted-foreground'>{sub}</p>}
      </CardContent>
    </Card>
  )
}
