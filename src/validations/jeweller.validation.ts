import { z } from 'zod'

export const createJewellerSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  city: z.string().min(2, 'City is required'),
})

export const updateJewellerSchema = z.object({
  name: z.string().min(2).optional(),
  city: z.string().min(2).optional(),
})

export type CreateJewellerInput = z.infer<typeof createJewellerSchema>
export type UpdateJewellerInput = z.infer<typeof updateJewellerSchema>
