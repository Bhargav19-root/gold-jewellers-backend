import type { Request, Response, NextFunction, RequestHandler } from 'express'

type AsyncFn = (req: Request, res: Response, next: NextFunction) => Promise<unknown>

// Wraps an async route handler so errors are automatically forwarded to errorHandler.
// Without this every controller needs its own try/catch.
export function asyncHandler(fn: AsyncFn): RequestHandler {
  return (req, res, next) => {
    fn(req, res, next).catch(next)
  }
}
