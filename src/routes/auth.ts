import express, { Request, Response, NextFunction } from 'express'
import { AuthController } from '../controllers/AuthController'
import { UserService } from '../services/userService'
import { AppDataSource } from '../config/data-source'
import { User } from '../entity/User'
import logger from '../config/logger'
import registerValidators from '../validators/register-validators'
import loginValidators from '../validators/login-validators'
import { TokenService } from '../services/tokenService'
import { RefreshToken } from '../entity/RefreshToken'
import { CredentailService } from '../services/credentialService'

const router = express.Router()
const userRepository = AppDataSource.getRepository(User)
const userService = new UserService(userRepository)
const refreshTokenRepository = AppDataSource.getRepository(RefreshToken)
const tokenService = new TokenService(refreshTokenRepository)
const credentailService = new CredentailService()
const authController = new AuthController(
    userService,
    logger,
    tokenService,
    credentailService,
)

router.post(
    '/register',
    registerValidators,
    (req: Request, res: Response, next: NextFunction) =>
        authController.register(req, res, next),
)

router.post(
    '/login',
    loginValidators,
    (req: Request, res: Response, next: NextFunction) =>
        authController.login(req, res, next),
)

export default router
