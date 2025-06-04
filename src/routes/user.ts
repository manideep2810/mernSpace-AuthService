import express, { NextFunction, Request, Response } from 'express'
import authenticate from '../middlewares/authenticate'
import { canAccess } from '../middlewares/canAccess'
import { ROLES } from '../constants'
import { UserController } from '../controllers/UserController'
import { UserService } from '../services/userService'
import { AppDataSource } from '../config/data-source'
import { User } from '../entity/User'
import registerValidators from '../validators/register-validators'

const router = express.Router()

const usersRepository = AppDataSource.getRepository(User)
const userService = new UserService(usersRepository)
const usersController = new UserController(userService)

router.post(
    '/',
    authenticate,
    canAccess([ROLES.ADMIN]),
    registerValidators,
    async (req: Request, res: Response, next: NextFunction) =>
        await usersController.create(req, res, next),
)

router.get(
    '/',
    authenticate,
    canAccess([ROLES.ADMIN]),
    async (req: Request, res: Response, next: NextFunction) =>
        await usersController.getAll(req, res, next),
)

router.get(
    '/:id',
    authenticate,
    canAccess([ROLES.ADMIN]),
    async (req: Request, res: Response, next: NextFunction) =>
        await usersController.getOne(req, res, next),
)

router.patch(
    '/:id',
    authenticate,
    canAccess([ROLES.ADMIN]),
    async (req: Request, res: Response, next: NextFunction) =>
        await usersController.update(req, res, next),
)

router.delete(
    '/:id',
    authenticate,
    canAccess([ROLES.ADMIN]),
    async (req: Request, res: Response, next: NextFunction) =>
        await usersController.destroy(req, res, next),
)

export default router
