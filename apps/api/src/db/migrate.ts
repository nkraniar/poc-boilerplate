import { fileURLToPath } from 'node:url'
import { migrate } from 'drizzle-orm/libsql/migrator'
import { openDatabase } from './client.js'

const { db, close } = await openDatabase()
try {
  const migrationsFolder = fileURLToPath(new URL('../../drizzle/', import.meta.url))
  await migrate(db, { migrationsFolder })
  console.log('SQLite migrations applied.')
} finally {
  close()
}
