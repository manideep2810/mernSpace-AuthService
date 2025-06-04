import express, { Request, Response, NextFunction } from 'express'
import { TenantController } from '../controllers/tenantController'
import { TenantService } from '../services/tenantService'
import { Tenant } from '../entity/Tenant'
import { AppDataSource } from '../config/data-source'
import logger from '../config/logger'
import authenticate from '../middlewares/authenticate'
import { canAccess } from '../middlewares/canAccess'
import { ROLES } from '../constants'
import createTenantValidators from '../validators/createTenant-validators'

const router = express.Router()

const tenantRepository = AppDataSource.getRepository(Tenant)
const tenantService = new TenantService(tenantRepository)
const tenantController = new TenantController(tenantService, logger)

router.post(
    '/',
    authenticate,
    canAccess([ROLES.ADMIN]),
    createTenantValidators,
    async (req: Request, res: Response, next: NextFunction) =>
        await tenantController.create(req, res, next),
)

router.get(
    '/',
    async (req: Request, res: Response, next: NextFunction) =>
        await tenantController.getAll(req, res, next),
)

router.get(
    '/:id',
    authenticate,
    canAccess([ROLES.ADMIN]),
    async (req: Request, res: Response, next: NextFunction) =>
        await tenantController.getOne(req, res, next),
)

router.patch(
    '/:id',
    authenticate,
    canAccess([ROLES.ADMIN]),
    async (req: Request, res: Response, next: NextFunction) =>
        await tenantController.update(req, res, next),
)

router.delete(
    '/:id',
    authenticate,
    canAccess([ROLES.ADMIN]),
    async (req: Request, res: Response, next: NextFunction) =>
        await tenantController.destroy(req, res, next),
)

export default router
