import { useState, type FormEvent } from 'react'
import { ArrowUpRight, Plus } from 'lucide-react'
import { Button } from '@/components/ui/button'
import {
  Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger,
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { SamplePanel } from './SamplePanel'

export function formatMoney(amount: number, currency = 'USD', digits = 0) {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency,
    minimumFractionDigits: digits,
    maximumFractionDigits: digits,
  }).format(amount)
}

const contributions = [
  { month: 'Dec', amount: 640 },
  { month: 'Jan', amount: 880 },
  { month: 'Feb', amount: 720 },
  { month: 'Mar', amount: 1040 },
  { month: 'Apr', amount: 600 },
  { month: 'May', amount: 1120 },
]

export function ContributionHistory() {
  const total = contributions.reduce((sum, entry) => sum + entry.amount, 0)
  return (
    <SamplePanel title="Contribution history" description="December 2025 – May 2026">
      <div className="mb-5 flex items-baseline gap-2">
        <strong className="text-3xl font-semibold tracking-tight tabular-nums">{formatMoney(total)}</strong>
        <span className="text-xs text-muted-foreground">total</span>
      </div>
      <figure aria-label="Monthly contributions" className="mb-5">
        <ul className="grid grid-cols-6 gap-2">
          {contributions.map(({ month, amount }) => (
            <li key={month} className="min-w-0 text-center">
              <div className="flex h-24 items-end border-b border-border">
                <div
                  className="w-full bg-chart-3 dark:bg-chart-2"
                  style={{ height: `${amount / 12}%` }}
                  title={`${month}: ${formatMoney(amount)}`}
                  aria-hidden="true"
                />
              </div>
              <span className="mt-1.5 block text-[0.65rem] text-muted-foreground">{month}</span>
              <span className="sr-only">{formatMoney(amount)}</span>
            </li>
          ))}
        </ul>
      </figure>
      <div className="mb-4 grid grid-cols-2 gap-2">
        <div className="space-y-1 bg-muted/65 p-3">
          <p className="sample-label text-muted-foreground">Upcoming</p>
          <p className="text-xs font-semibold">Dec 1, 2026</p>
          <p className="text-[0.7rem] text-muted-foreground">$1,000 scheduled</p>
        </div>
        <div className="space-y-1 bg-muted/65 p-3">
          <p className="sample-label text-muted-foreground">Auto-save</p>
          <p className="text-xs font-semibold">Accelerated</p>
          <p className="text-[0.7rem] text-muted-foreground">Recurring weekly</p>
        </div>
      </div>
      <Dialog>
        <DialogTrigger asChild>
          <Button className="sample-action w-full">View full report <ArrowUpRight /></Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Contribution report</DialogTitle>
            <DialogDescription>Monthly activity from December 2025 to May 2026.</DialogDescription>
          </DialogHeader>
          <Table>
            <TableHeader>
              <TableRow><TableHead>Month</TableHead><TableHead className="text-right">Amount</TableHead></TableRow>
            </TableHeader>
            <TableBody>
              {contributions.map(({ month, amount }) => (
                <TableRow key={month}>
                  <TableCell>{month}</TableCell><TableCell className="text-right tabular-nums">{formatMoney(amount)}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    </SamplePanel>
  )
}

const initialGoals = [
  { id: 'retirement', name: 'Retirement', target: 420_000, saved: 273_000 },
  { id: 'real-estate', name: 'Real estate', target: 85_000, saved: 27_200 },
]

export function SavingsTargets() {
  const [goals, setGoals] = useState(initialGoals)
  const [open, setOpen] = useState(false)
  const [error, setError] = useState('')

  function addGoal(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    const data = new FormData(event.currentTarget)
    const name = String(data.get('name') ?? '').trim()
    const target = Number(data.get('target'))
    if (!name || !Number.isFinite(target) || target < 1) {
      setError('Enter a goal name and an amount of at least $1.')
      return
    }
    setGoals((current) => [...current, { id: crypto.randomUUID(), name, target, saved: 0 }])
    setOpen(false)
  }

  return (
    <SamplePanel title="Savings targets" description="Active savings milestones" action={
      <Dialog open={open} onOpenChange={(next) => { setError(''); setOpen(next) }}>
        <DialogTrigger asChild>
          <Button variant="outline" size="sm" className="sample-action"><Plus /> New goal</Button>
        </DialogTrigger>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Set a new milestone</DialogTitle>
            <DialogDescription>Choose a name and an amount to save.</DialogDescription>
          </DialogHeader>
          <form onSubmit={addGoal} className="grid gap-4">
            <div className="sample-field">
              <Label htmlFor="goal-name">Goal name</Label>
              <Input id="goal-name" name="name" maxLength={60} required />
            </div>
            <div className="sample-field">
              <Label htmlFor="goal-amount">Target amount (USD)</Label>
              <Input id="goal-amount" name="target" type="number" min="1" step="1" required />
            </div>
            {error && <p role="alert" className="text-xs text-destructive">{error}</p>}
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setOpen(false)}>Cancel</Button>
              <Button type="submit">Create goal</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    }>
      <ul className="space-y-2.5">
        {goals.map(({ id, name, target, saved }) => {
          const percent = Math.round(saved / target * 100)
          return (
            <li key={id} className="min-w-0 space-y-2 bg-muted/65 p-3.5">
              <p className="sample-label break-words text-muted-foreground">{name}</p>
              <p className="break-words text-[1.4rem] leading-none font-semibold tracking-tight tabular-nums">{formatMoney(target)}</p>
              <Progress value={percent} aria-label={`${name} savings progress`} className="h-0.5 bg-border" />
              <div className="flex justify-between gap-2 text-[0.7rem] tabular-nums">
                <span className="text-muted-foreground">{percent}% achieved</span>
                <strong className="font-semibold">{formatMoney(saved)}</strong>
              </div>
            </li>
          )
        })}
      </ul>
      <p className="mt-4 text-xs leading-relaxed text-muted-foreground">You have {goals.length} active savings goals.</p>
    </SamplePanel>
  )
}
