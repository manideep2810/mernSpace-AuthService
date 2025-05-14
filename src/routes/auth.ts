import express from 'express'
import { AuthController } from '../controllers/AuthController'

const router = express.Router()
const authController = new AuthController()

// eslint-disable-next-line @typescript-eslint/unbound-method
router.post('/register', authController.register)

export default router
