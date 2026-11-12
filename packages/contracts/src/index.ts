import { z } from 'zod'

export const createItemSchema = z.object({
  title: z.string().trim().min(1, 'Enter an item title.').max(120, 'Use 120 characters or fewer.'),
})

export const itemSchema = z.object({
  id: z.uuid(),
  title: z.string(),
  createdAt: z.iso.datetime(),
})

export const itemListSchema = z.array(itemSchema)

export type Item = z.infer<typeof itemSchema>
