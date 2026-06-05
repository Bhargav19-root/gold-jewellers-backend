import type { Request, Response, NextFunction } from 'express'
import { ZodSchema } from 'zod'
import { AppError } from './errorHandler'
import { HTTP } from '../constants/httpStatus'

// Usage: router.post('/route', validate(myZodSchema), handler)
export function validate(schema: ZodSchema) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    const result = schema.safeParse(req.body)

    if (!result.success) {
      const message = result.error.issues
        .map((e) => `${e.path.join('.')}: ${e.message}`)
        .join(', ')
      return next(new AppError(message, HTTP.UNPROCESSABLE_ENTITY))
    }

    req.body = result.data // replace with parsed + coerced data
    next()
  }
}
