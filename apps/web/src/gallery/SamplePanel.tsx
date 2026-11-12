import type { ReactNode } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'

export function SamplePanel({ title, description, action, children, className }: {
  title: string
  description: string
  action?: ReactNode
  children: ReactNode
  className?: string
}) {
  return (
    <Card className={cn('min-w-0 gap-4 rounded-none border border-border py-5 shadow-none ring-0', className)}>
      <CardHeader className="flex items-start justify-between gap-2 px-5">
        <div className="min-w-0 space-y-1">
          <CardTitle className="text-[0.82rem] font-bold tracking-[0.04em] uppercase">
            <h2>{title}</h2>
          </CardTitle>
          <CardDescription className="text-xs leading-relaxed">{description}</CardDescription>
        </div>
        {action}
      </CardHeader>
      <CardContent className="px-5">{children}</CardContent>
    </Card>
  )
}
