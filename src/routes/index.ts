import { Router } from 'express'
import jewellerRouter from './jeweller.routes'

// import authRouter from './auth.routes'
// import adminRouter from './admin.routes'
// import customerRouter from './customer.routes'

const router = Router()

router.use('/jewellers', jewellerRouter)
// router.use('/auth',      authRouter)
// router.use('/admin',     adminRouter)
// router.use('/customers', customerRouter)

export default router
