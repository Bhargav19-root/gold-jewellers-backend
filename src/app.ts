import express, { type Request, type Response } from 'express'
import cors from 'cors'
import { env } from './config/env'
import { errorHandler } from './middleware/errorHandler'
import router from './routes'

const app = express()

// ── Core middleware ───────────────────────────────────────────────────────────
app.use(cors({ origin: env.CORS_ORIGIN, credentials: true }))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))

// ── Health check ──────────────────────────────────────────────────────────────
app.get('/health', (_req: Request, res: Response) => {
  res.json({ success: true, status: 'ok', env: env.NODE_ENV })
})

// ── API routes ────────────────────────────────────────────────────────────────
app.use('/api/v1', router)

// ── 404 handler ───────────────────────────────────────────────────────────────
app.use((_req: Request, res: Response) => {
  res.status(404).json({ success: false, message: 'Route not found' })
})

// ── Global error handler (must be last) ───────────────────────────────────────
app.use(errorHandler)

export default app
