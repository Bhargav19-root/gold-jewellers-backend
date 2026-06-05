import type { Role } from '../constants/roles'

export interface JwtPayload {
  userId: string
  role: Role
  email: string
}
