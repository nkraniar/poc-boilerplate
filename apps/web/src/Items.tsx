import { useEffect, useState, type FormEvent } from 'react'
import { createItemSchema } from '@poc/contracts'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { useItemsStore } from './stores/items'

const dateFormat = new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' })

export function Items() {
  const items = useItemsStore((state) => state.items)
  const loading = useItemsStore((state) => state.loading)
  const loadError = useItemsStore((state) => state.loadError)
  const saving = useItemsStore((state) => state.saving)
  const loadItems = useItemsStore((state) => state.loadItems)
  const addItem = useItemsStore((state) => state.addItem)
  const [title, setTitle] = useState('')
  const [formError, setFormError] = useState('')
  const formDisabled = items === null || loading || loadError || saving

  useEffect(() => {
    void loadItems()
  }, [loadItems])

  async function submitItem(event: FormEvent<HTMLFormElement>) {
    event.preventDefault()
    if (formDisabled) return

    const input = createItemSchema.safeParse({ title })
    if (!input.success) {
      setFormError(input.error.issues[0]?.message ?? 'Enter a valid title.')
      return
    }

    setFormError('')
    if (await addItem(input.data.title)) {
      setTitle('')
    } else {
      setFormError('Could not save the item. Try again.')
    }
  }

  return (
    <main className="mx-auto max-w-2xl px-4 pt-7 pb-10 sm:pt-9">
      <h1 className="mb-5 text-3xl font-semibold tracking-tight">Items</h1>
      <Card className="mb-4 border border-border ring-0">
        <CardContent>
          <form onSubmit={submitItem} className="sample-field">
            <Label htmlFor="title">Item title</Label>
            <div className="flex flex-col gap-2 sm:flex-row">
              <Input
                id="title"
                name="title"
                value={title}
                onChange={(event) => {
                  setTitle(event.target.value)
                  setFormError('')
                }}
                maxLength={120}
                required
                disabled={formDisabled}
                aria-invalid={Boolean(formError)}
                aria-describedby={formError ? 'form-error' : undefined}
              />
              <Button type="submit" disabled={formDisabled}>
                {saving ? 'Adding…' : 'Add item'}
              </Button>
            </div>
            {formError && <p className="text-sm text-destructive" id="form-error" role="alert">{formError}</p>}
          </form>
        </CardContent>
      </Card>
      <Card className="border border-border ring-0">
        <CardHeader>
          <CardTitle><h2>Saved items</h2></CardTitle>
        </CardHeader>
        <CardContent>
          {loadError && (
            <div className="flex flex-wrap items-center gap-3">
              <p className="text-sm text-destructive" role="alert">Could not load items.</p>
              <Button variant="outline" onClick={() => void loadItems()}>Retry</Button>
            </div>
          )}
          {!loadError && items === null && <p role="status" className="text-sm text-muted-foreground">Loading items…</p>}
          {items?.length === 0 && <p className="text-sm text-muted-foreground">No items yet.</p>}
          {items && items.length > 0 && (
            <ul className="divide-y divide-border">
              {items.map((item) => (
                <li key={item.id} className="grid gap-x-4 gap-y-1 py-2.5 first:pt-0 last:pb-0 sm:grid-cols-[minmax(0,1fr)_auto]">
                  <span className="break-words text-sm">{item.title}</span>
                  <time className="text-xs text-muted-foreground" dateTime={item.createdAt}>{dateFormat.format(new Date(item.createdAt))}</time>
                </li>
              ))}
            </ul>
          )}
        </CardContent>
      </Card>
    </main>
  )
}
