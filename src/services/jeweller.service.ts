import { eq } from 'drizzle-orm'
import { db } from '../db'
import { jewellersTable } from '../db/schema'
import type { CreateJewellerInput } from '../validations/jeweller.validation'
import { AppError } from '../middleware/errorHandler'
import { HTTP } from '../constants/httpStatus'

 async function getAllJewellers() {
  return db.select().from(jewellersTable)
}

 async function getJewellerById(id: number) {
  const [jeweller] = await db
    .select()
    .from(jewellersTable)
    .where(eq(jewellersTable.id, id))
    .limit(1)

  if (!jeweller) throw new AppError('Jeweller not found', HTTP.NOT_FOUND)
  return jeweller
}

 async function createJeweller(input: CreateJewellerInput) {
  const [created] = await db
    .insert(jewellersTable)
    .values({ name: input.name, city: input.city })
    .returning()

  return created
}

 async function approveJeweller(id: number) {
  const jeweller = await getJewellerById(id) // reuses above — throws if not found

  if (jeweller.status === 'approved') {
    throw new AppError('Jeweller is already approved', HTTP.CONFLICT)
  }

  const [updated] = await db
    .update(jewellersTable)
    .set({ status: 'approved' })
    .where(eq(jewellersTable.id, id))
    .returning()

  return updated
}


export const jewellerService = {
  getAllJewellers,
  getJewellerById,
  createJeweller,
  approveJeweller,
}