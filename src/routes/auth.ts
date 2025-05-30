import express, { Request, Response, NextFunction } from 'express'
import { AuthController } from '../controllers/AuthController'
import { UserService } from '../services/userService'
import { AppDataSource } from '../config/data-source'
import { User } from '../entity/User'
import logger from '../config/logger'
import registerValidators from '../validators/register-validators'
import { TokenService } from '../services/tokenService'

const router = express.Router()
const userRepository = AppDataSource.getRepository(User)
const userService = new UserService(userRepository)
const tokenService = new TokenService()
const authController = new AuthController(userService, logger, tokenService)

router.post(
    '/register',
    registerValidators,
    (req: Request, res: Response, next: NextFunction) =>
        authController.register(req, res, next),
)

export default router
