import type { Response } from 'express'
import { HTTP, type HttpStatus } from '../constants/httpStatus'

export function sendSuccess<T>(
  res: Response,
  data: T,
  message = 'Success',
  statusCode: HttpStatus = HTTP.OK
): void {
  res.status(statusCode).json({ success: true, message, data })
}

export function sendCreated<T>(res: Response, data: T, message = 'Created'): void {
  sendSuccess(res, data, message, HTTP.CREATED)
}

export function sendNoContent(res: Response): void {
  res.status(HTTP.NO_CONTENT).send()
}

export function sendError(
  res: Response,
  message = 'Something went wrong',
  statusCode: HttpStatus = HTTP.INTERNAL_SERVER_ERROR
): void {
  res.status(statusCode).json({ success: false, message })
}

export function sendNotFound(res: Response, message = 'Resource not found'): void {
  sendError(res, message, HTTP.NOT_FOUND)
}

export function sendUnauthorized(res: Response, message = 'Unauthorized'): void {
  sendError(res, message, HTTP.UNAUTHORIZED)
}

export function sendForbidden(res: Response, message = 'Access denied'): void {
  sendError(res, message, HTTP.FORBIDDEN)
}

export function sendBadRequest(res: Response, message = 'Bad request'): void {
  sendError(res, message, HTTP.BAD_REQUEST)
}

export function sendConflict(res: Response, message = 'Already exists'): void {
  sendError(res, message, HTTP.CONFLICT)
}
