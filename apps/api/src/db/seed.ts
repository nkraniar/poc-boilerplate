import type { Item } from '@poc/contracts'
import { openDatabase } from './client.js'
import { items } from './schema.js'

const samples: Item[] = [
  {
    id: '00000000-0000-4000-8000-000000000001',
    title: 'Define the problem and requirements',
    createdAt: '2026-01-01T09:00:00.000Z',
  },
  {
    id: '00000000-0000-4000-8000-000000000002',
    title: 'Design the workflow',
    createdAt: '2026-01-01T08:00:00.000Z',
  },
]

const { db, close } = await openDatabase()
try {
  await db.insert(items).values(samples).onConflictDoNothing({ target: items.id })
  console.log('Sample items seeded.')
} finally {
  close()
}
