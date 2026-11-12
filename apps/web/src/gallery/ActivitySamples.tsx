import { useState } from 'react'
import { Car, Coffee, ShoppingCart, Tv, Wallet, type LucideIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Progress } from '@/components/ui/progress'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { cn } from '@/lib/utils'
import { formatMoney } from './FinanceSamples'
import { SamplePanel } from './SamplePanel'

type Transaction = {
  name: string
  category: string
  date: string
  amount: number
  icon: LucideIcon
}

const transactions: Transaction[] = [
  { name: 'Blue Bottle Coffee', category: 'Food & drink', date: 'Nov 12, 2026', amount: -6.50, icon: Coffee },
  { name: 'Whole Foods Market', category: 'Groceries', date: 'Nov 11, 2026', amount: -142.30, icon: ShoppingCart },
  { name: 'Stripe Payout', category: 'Income', date: 'Nov 10, 2026', amount: 4200, icon: Wallet },
  { name: 'Uber Technologies', category: 'Transport', date: 'Nov 9, 2026', amount: -24.10, icon: Car },
  { name: 'Netflix Subscription', category: 'Entertainment', date: 'Nov 8, 2026', amount: -19.99, icon: Tv },
]

const transactionFilters = [
  { value: 'all', label: 'All', matches: () => true },
  { value: 'income', label: 'Income', matches: ({ amount }: Transaction) => amount > 0 },
  { value: 'expenses', label: 'Expenses', matches: ({ amount }: Transaction) => amount < 0 },
]

export function RecentTransactions() {
  return (
    <SamplePanel title="Recent transactions" description="Your latest account activity." className="sm:col-span-2">
      <Tabs defaultValue="all" className="gap-3">
        <TabsList aria-label="Transaction type">
          {transactionFilters.map(({ value, label }) => (
            <TabsTrigger key={value} value={value}>{label}</TabsTrigger>
          ))}
        </TabsList>
        {transactionFilters.map(({ value, matches }) => (
          <TabsContent key={value} value={value}>
            <TransactionTable rows={transactions.filter(matches)} />
          </TabsContent>
        ))}
      </Tabs>
    </SamplePanel>
  )
}

function TransactionTable({ rows }: { rows: Transaction[] }) {
  return (
    <Table aria-label="Recent transactions">
      <TableHeader>
        <TableRow>
          <TableHead scope="col">Transaction</TableHead>
          <TableHead scope="col" className="hidden sm:table-cell">Date</TableHead>
          <TableHead scope="col" className="text-right">Amount</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {rows.map(({ name, category, date, amount, icon: Icon }) => (
          <TableRow key={name}>
            <TableCell className="whitespace-normal">
              <div className="flex items-center gap-2.5">
                <span className="grid size-8 shrink-0 place-items-center bg-muted/70"><Icon className="size-3.5" aria-hidden="true" /></span>
                <div>
                  <p className="text-xs font-semibold">{name}</p>
                  <p className="text-[0.7rem] text-muted-foreground">{category}</p>
                </div>
              </div>
            </TableCell>
            <TableCell className="hidden text-xs text-muted-foreground sm:table-cell">{date}</TableCell>
            <TableCell className={cn('text-right text-xs font-semibold tabular-nums', amount > 0 && 'text-primary dark:text-sidebar-primary')}>
              {amount > 0 && '+'}{formatMoney(amount, 'USD', 2)}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}

const browsers = [
  { name: 'Chrome', share: 37, color: 'var(--chart-1)' },
  { name: 'Firefox', share: 31, color: 'var(--chart-4)' },
  { name: 'Safari', share: 21, color: 'var(--chart-2)' },
  { name: 'Edge', share: 11, color: 'var(--chart-5)' },
]

let offset = 0
const browserGradient = browsers.map(({ share, color }) => {
  const stop = `${color} ${offset}% ${offset + share}%`
  offset += share
  return stop
}).join(', ')

export function BrowserShare() {
  const [active, setActive] = useState(browsers[1])

  return (
    <SamplePanel title="Browser share" description="January – June 2026">
      <div className="relative mx-auto my-3 grid size-36 place-items-center rounded-full"
        style={{ background: `conic-gradient(${browserGradient})` }}>
        <div className="grid size-28 place-content-center rounded-full bg-card text-center">
          <strong className="text-2xl leading-none font-semibold tracking-tight">935</strong>
          <span className="mt-1 text-[0.7rem] text-muted-foreground">Visitors</span>
        </div>
      </div>
      <div className="mt-4 flex flex-wrap justify-center gap-1" aria-label="Browsers">
        {browsers.map((browser) => (
          <Button key={browser.name} variant={active.name === browser.name ? 'secondary' : 'ghost'} size="sm"
            aria-pressed={active.name === browser.name} onClick={() => setActive(browser)}
            className="h-7 gap-1 px-1.5 text-[0.63rem]">
            <span className="size-1.5" style={{ background: browser.color }} aria-hidden="true" />{browser.name}
          </Button>
        ))}
      </div>
      <div className="mt-4 space-y-1.5 border-t border-border pt-3">
        <div className="flex justify-between text-xs">
          <span>{active.name}</span><span className="font-semibold tabular-nums">{active.share}%</span>
        </div>
        <Progress className="h-0.5" value={active.share} aria-label={`${active.name} share`} />
      </div>
    </SamplePanel>
  )
}

const paymentDate = new Date(2026, 10, 12)
const payments = [
  { date: new Date(2026, 10, 12), name: 'Netflix Subscription', amount: 19.99 },
  { date: new Date(2026, 10, 12), name: 'Auto Insurance', amount: 188 },
  { date: new Date(2026, 10, 20), name: 'Internet Service', amount: 65 },
  { date: new Date(2026, 11, 1), name: 'Rent Payment', amount: 2400 },
]

const paymentDates = payments.map(({ date }) => date)
const paymentDateFormat = new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' })

export function UpcomingPayments() {
  const [selected, setSelected] = useState(paymentDate)
  const scheduled = payments.filter(({ date }) => date.getTime() === selected.getTime())

  return (
    <SamplePanel title="Upcoming payments" description="Select a date to view scheduled payments.">
      <Calendar mode="single" required selected={selected} onSelect={setSelected} defaultMonth={paymentDate}
        modifiers={{ scheduled: paymentDates }} modifiersClassNames={{ scheduled: 'font-bold underline decoration-primary underline-offset-4' }}
        className="mx-auto w-full border border-border p-2 [--cell-size:--spacing(7)]" />
      <div className="mt-3 space-y-1.5" aria-live="polite">
        {scheduled.length === 0 && (
          <p className="bg-muted/65 p-2.5 text-xs text-muted-foreground">No payments on {paymentDateFormat.format(selected)}.</p>
        )}
        {scheduled.map(({ date, name, amount }) => (
          <div key={name} className="flex items-center justify-between gap-2 bg-muted/65 p-2.5 text-xs">
            <div>
              <p className="font-semibold">{name}</p>
              <p className="mt-0.5 text-[0.67rem] text-muted-foreground">{paymentDateFormat.format(date)}</p>
            </div>
            <span className="shrink-0 font-semibold tabular-nums">{formatMoney(amount, 'USD', 2)}</span>
          </div>
        ))}
      </div>
    </SamplePanel>
  )
}
