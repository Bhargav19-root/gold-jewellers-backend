import { Router } from 'express'
import { authenticate, requireRole, ROLES } from '../middleware/auth'
import { validate } from '../middleware/validate'

import { createJewellerSchema } from '../validations/jeweller.validation'
import { jewellerController } from '../controllers/jeweller.controller'

const router = Router()

// ── Public routes ─────────────────────────────────────────────────────────────
router.get('/',   jewellerController.getAllJewellers)
router.get('/:id', jewellerController.getJewellerById)

// ── Admin-only routes ─────────────────────────────────────────────────────────
router.post(
  '/',
  authenticate,                        // 1. verify JWT
  requireRole(ROLES.SUPER_ADMIN),      // 2. check role
  validate(createJewellerSchema),      // 3. validate body
  jewellerController.createJeweller                       // 4. handle request
)

router.patch(
  '/:id/approve',
  authenticate,
  requireRole(ROLES.SUPER_ADMIN),
  jewellerController.approveJeweller
)

export default router
