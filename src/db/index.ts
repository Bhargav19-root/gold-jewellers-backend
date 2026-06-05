import { drizzle } from 'drizzle-orm/node-postgres'
import { Pool } from 'pg'
import { env } from '../config/env'
import * as schema from './schema'

// Connection pool — reuses connections instead of opening a new one per query
export const pool = new Pool({
  connectionString: env.DATABASE_URL,
  max: 10,                       // max simultaneous connections
  idleTimeoutMillis: 30_000,     // close idle connections after 30s
  connectionTimeoutMillis: 2_000, // fail fast if DB is unreachable
})

// Drizzle instance — use this in every service/controller for queries
export const db = drizzle(pool, { schema })

export type DB = typeof db
