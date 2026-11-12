import { itemListSchema, itemSchema, type Item } from '@poc/contracts'
import { create } from 'zustand'

type ItemsStore = {
  items: Item[] | null
  loading: boolean
  loadError: boolean
  saving: boolean
  loadItems: () => Promise<void>
  addItem: (title: string) => Promise<boolean>
}

export const useItemsStore = create<ItemsStore>((set, get) => ({
  items: null,
  loading: false,
  loadError: false,
  saving: false,

  async loadItems() {
    const { loading, saving } = get()
    if (loading || saving) return

    set({ loading: true, loadError: false })
    try {
      const response = await fetch('/api/items')
      if (!response.ok) throw new Error('Could not load items')
      set({ items: itemListSchema.parse(await response.json()) })
    } catch {
      set({ loadError: true })
    } finally {
      set({ loading: false })
    }
  },

  async addItem(title) {
    const { items, loading, loadError, saving } = get()
    if (items === null || loading || loadError || saving) return false

    set({ saving: true })
    try {
      const response = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ title }),
      })
      if (!response.ok) throw new Error('Could not save item')

      const item = itemSchema.parse(await response.json())
      set({ items: [item, ...items] })
      return true
    } catch {
      return false
    } finally {
      set({ saving: false })
    }
  },
}))
