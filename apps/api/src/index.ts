import { randomUUID } from 'node:crypto'
import { serve } from '@hono/node-server'
import { createItemSchema } from '@poc/contracts'
import { desc } from 'drizzle-orm'
import { Hono } from 'hono'
import { openDatabase } from './db/client.js'
import { items } from './db/schema.js'

const { db } = await openDatabase()
const app = new Hono()

app.get('/api/items', async (c) => {
  const result = await db.select().from(items).orderBy(desc(items.createdAt), desc(items.id))
  return c.json(result)
})

app.post('/api/items', async (c) => {
  const body: unknown = await c.req.json().catch(() => undefined)
  const input = createItemSchema.safeParse(body)
  if (!input.success) {
    return c.json({ error: 'Enter an item title of 1 to 120 characters.' }, 400)
  }

  const item = {
    id: randomUUID(),
    title: input.data.title,
    createdAt: new Date().toISOString(),
  }
  await db.insert(items).values(item)
  return c.json(item, 201)
})

app.onError((error, c) => {
  console.error(error)
  return c.json({ error: 'The API could not complete the request.' }, 500)
})

serve({ fetch: app.fetch, hostname: '127.0.0.1', port: 3001 }, ({ address, port }) => {
  console.log(`API listening on http://${address}:${port}`)
})
