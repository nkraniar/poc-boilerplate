import { sqliteTable, text } from 'drizzle-orm/sqlite-core'

export const items = sqliteTable('items', {
  id: text('id').primaryKey().notNull(),
  title: text('title').notNull(),
  createdAt: text('created_at').notNull(),
})
