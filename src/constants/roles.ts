export const ROLES = {
  SUPER_ADMIN: 'super_admin',
  JEWELLER:    'jeweller',
  CUSTOMER:    'customer',
} as const

export type Role = (typeof ROLES)[keyof typeof ROLES]
