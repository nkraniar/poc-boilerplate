import { useState } from 'react'
import { Check } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Checkbox } from '@/components/ui/checkbox'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { Textarea } from '@/components/ui/textarea'
import { formatMoney } from './FinanceSamples'
import { SamplePanel } from './SamplePanel'

const currencies = [
  ['USD', 'United States Dollar'],
  ['EUR', 'Euro'],
  ['GBP', 'British Pound'],
]

export function PayoutThreshold() {
  const [currency, setCurrency] = useState('USD')
  const [threshold, setThreshold] = useState(2500)
  const [saved, setSaved] = useState(false)

  return (
    <SamplePanel title="Payout threshold" description="Set the minimum balance required before a payout is triggered.">
      <form className="grid gap-5" onChange={() => setSaved(false)} onSubmit={(event) => {
        event.preventDefault()
        setSaved(true)
      }}>
        <div className="sample-field">
          <Label htmlFor="payout-currency" className="sample-label">Preferred currency</Label>
          <Select value={currency} onValueChange={(value) => { setCurrency(value); setSaved(false) }}>
            <SelectTrigger id="payout-currency" className="sample-line-input w-full">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {currencies.map(([code, name]) => <SelectItem key={code} value={code}>{code} — {name}</SelectItem>)}
            </SelectContent>
          </Select>
        </div>
        <div className="sample-field">
          <div className="flex flex-wrap items-baseline justify-between gap-x-2">
            <span className="sample-label">Minimum payout</span>
            <output className="text-lg font-semibold tracking-tight tabular-nums">{formatMoney(threshold, currency, 2)}</output>
          </div>
          <Slider value={[threshold]} min={50} max={10_000} step={50} aria-label="Minimum payout amount"
            onValueChange={([amount]) => { setThreshold(amount); setSaved(false) }} />
          <div className="flex justify-between text-[0.68rem] text-muted-foreground">
            <span>{formatMoney(50, currency)} min</span><span>{formatMoney(10_000, currency)} max</span>
          </div>
        </div>
        <div className="sample-field">
          <Label htmlFor="payout-notes" className="sample-label">Notes</Label>
          <Textarea id="payout-notes" className="sample-line-input min-h-16 resize-y" maxLength={240} placeholder="Add any notes about this payout…" />
        </div>
        <Button className="sample-action w-full" type="submit">
          {saved && <Check />} {saved ? 'Threshold saved' : 'Save threshold'}
        </Button>
        <span className="sr-only" role="status">{saved ? 'Payout threshold saved for this session.' : ''}</span>
      </form>
    </SamplePanel>
  )
}

const preferences = [
  { key: 'transactions', title: 'Transaction alerts', detail: 'Deposits, withdrawals, and transfers.' },
  { key: 'security', title: 'Security alerts', detail: 'Login attempts and account changes.' },
  { key: 'milestones', title: 'Goal milestones', detail: 'Progress on your active savings goals.' },
] as const

const initialPreferences = { transactions: true, security: true, milestones: false }

export function NotificationPreferences() {
  const [enabled, setEnabled] = useState(true)
  const [selected, setSelected] = useState(initialPreferences)
  const [saved, setSaved] = useState(false)

  return (
    <SamplePanel title="Notifications" description="Choose what you want to be notified about.">
      <div className="mb-1 flex items-start justify-between gap-3 border-b border-border pb-3">
        <div className="space-y-1">
          <Label htmlFor="email-notifications" className="sample-label">Email notifications</Label>
          <p className="text-xs leading-relaxed text-muted-foreground">Send selected alerts to your inbox.</p>
        </div>
        <Switch id="email-notifications" checked={enabled} onCheckedChange={(next) => {
          setEnabled(next)
          setSaved(false)
        }} />
      </div>
      <fieldset disabled={!enabled} className="space-y-4 py-4 disabled:opacity-55">
        <legend className="sr-only">Notification types</legend>
        {preferences.map(({ key, title, detail }) => (
          <div key={key} className="flex items-start gap-2.5">
            <Checkbox id={key} checked={selected[key]} onCheckedChange={(value) => {
              setSelected((current) => ({ ...current, [key]: value === true }))
              setSaved(false)
            }} />
            <div className="space-y-1">
              <Label htmlFor={key} className="sample-label">{title}</Label>
              <p className="text-xs text-muted-foreground">{detail}</p>
            </div>
          </div>
        ))}
      </fieldset>
      <Button className="sample-action mt-1 w-full" onClick={() => setSaved(true)}>
        {saved && <Check />} {saved ? 'Preferences saved' : 'Save preferences'}
      </Button>
      <span className="sr-only" role="status">{saved ? 'Notification preferences saved for this session.' : ''}</span>
    </SamplePanel>
  )
}
