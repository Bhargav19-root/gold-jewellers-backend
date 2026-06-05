import { env } from './config/env'
import { logger } from './lib/logger'
import { pool } from './db'
import app from './app'

async function bootstrap() {
  // ── 1. Verify DB is reachable before accepting any traffic ──────────────────
  try {
    const client = await pool.connect()
    await client.query('SELECT 1')
    client.release()
    logger.info('Database connected successfully')
  } catch (err) {
    logger.error('Database connection failed — server will not start', { err })
    process.exit(1)
  }

  // ── 2. Start HTTP server ────────────────────────────────────────────────────
  app.listen(env.PORT, () => {
    logger.info(`Server running on port ${env.PORT} [${env.NODE_ENV}]`)
  })

  // ── 3. Graceful shutdown — release pool on SIGTERM/SIGINT ──────────────────
  const shutdown = async (signal: string) => {
    logger.info(`${signal} received — closing server`)
    await pool.end()
    logger.info('Database pool closed')
    process.exit(0)
  }

  process.on('SIGTERM', () => shutdown('SIGTERM'))
  process.on('SIGINT',  () => shutdown('SIGINT'))
}

bootstrap()
