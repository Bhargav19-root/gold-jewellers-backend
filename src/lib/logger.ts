import { createLogger, format, transports } from 'winston'

const { combine, timestamp, colorize, printf, json } = format

const devFormat = combine(
  colorize(),
  timestamp({ format: 'HH:mm:ss' }),
  printf(({ level, message, timestamp, ...meta }) => {
    const extra = Object.keys(meta).length ? ` ${JSON.stringify(meta)}` : ''
    return `[${timestamp}] ${level}: ${message}${extra}`
  })
)

const prodFormat = combine(timestamp(), json())

export const logger = createLogger({
  level: process.env.NODE_ENV === 'production' ? 'warn' : 'debug',
  format: process.env.NODE_ENV === 'production' ? prodFormat : devFormat,
  transports: [new transports.Console()],
})
