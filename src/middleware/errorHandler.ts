import type { Request, Response, NextFunction } from 'express'
import { HTTP } from '../constants/httpStatus'

export class AppError extends Error {
  constructor(
    public override message: string,
    public statusCode: number = HTTP.INTERNAL_SERVER_ERROR,
    public code?: string
  ) {
    super(message)
    this.name = 'AppError'
    Error.captureStackTrace(this, this.constructor)
  }
}

export function errorHandler(
  err: Error,
  _req: Request,
  res: Response,
  _next: NextFunction
): void {
  if (err instanceof AppError) {
    res.status(err.statusCode).json({
      success: false,
      message: err.message,
      ...(err.code ? { code: err.code } : {}),
    })
    return
  }

  // Log unexpected errors in non-production
  if (process.env.NODE_ENV !== 'production') {
    console.error(err)
  }

  res.status(HTTP.INTERNAL_SERVER_ERROR).json({
    success: false,
    message: 'Internal server error',
  })
}
