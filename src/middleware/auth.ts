import type { Request, Response, NextFunction } from 'express'
import jwt from 'jsonwebtoken'
import { env } from '../config/env'
import { ROLES, type Role } from '../constants/roles'
import { type JwtPayload } from '../types/auth.types'
import { AppError } from './errorHandler'
import { HTTP } from '../constants/httpStatus'

export { ROLES, type Role }

// Verifies the Bearer token and attaches req.user
export function authenticate(req: Request, _res: Response, next: NextFunction): void {
  const header = req.headers.authorization
  if (!header?.startsWith('Bearer ')) {
    return next(new AppError('No token provided', HTTP.UNAUTHORIZED))
  }

  const token = header.split(' ')[1]
  try {
    req.user = jwt.verify(token, env.JWT_SECRET) as JwtPayload
    next()
  } catch {
    next(new AppError('Invalid or expired token', HTTP.UNAUTHORIZED))
  }
}

// Usage: router.get('/admin/...', authenticate, requireRole(ROLES.SUPER_ADMIN), handler)
export function requireRole(...roles: Role[]) {
  return (req: Request, _res: Response, next: NextFunction): void => {
    if (!req.user) {
      return next(new AppError('Not authenticated', HTTP.UNAUTHORIZED))
    }
    if (!roles.includes(req.user.role)) {
      return next(new AppError('Access denied', HTTP.FORBIDDEN))
    }
    next()
  }
}
