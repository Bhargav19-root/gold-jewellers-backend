import { integer, pgTable, varchar, timestamp } from 'drizzle-orm/pg-core'

export const usersTable = pgTable('users', {
  id:    integer().primaryKey().generatedAlwaysAsIdentity(),
  name:  varchar({ length: 255 }).notNull(),
  age:   integer().notNull(),
  email: varchar({ length: 255 }).notNull().unique(),
})

// Demo table — replace with your full schema once designed
export const jewellersTable = pgTable('jewellers', {
  id:        integer().primaryKey().generatedAlwaysAsIdentity(),
  name:      varchar({ length: 255 }).notNull(),
  city:      varchar({ length: 255 }).notNull(),
  status:    varchar({ length: 50 }).notNull().default('pending'),
  createdAt: timestamp().defaultNow().notNull(),
})

// Drizzle inferred types — use these in services instead of writing interfaces manually
export type Jeweller       = typeof jewellersTable.$inferSelect
export type NewJeweller    = typeof jewellersTable.$inferInsert
