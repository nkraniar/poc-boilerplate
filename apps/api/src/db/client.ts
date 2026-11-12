import { mkdirSync } from 'node:fs'
import { createClient } from '@libsql/client'
import { drizzle } from 'drizzle-orm/libsql'

const dataDirectory = new URL('../../../../data/', import.meta.url)
mkdirSync(dataDirectory, { recursive: true })

export async function openDatabase() {
  const client = createClient({ url: new URL('poc.db', dataDirectory).href })
  try {
    await client.execute('PRAGMA foreign_keys = ON')
    return { db: drizzle(client), close: () => client.close() }
  } catch (error) {
    client.close()
    throw error
  }
}
