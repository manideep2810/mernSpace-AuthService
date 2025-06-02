import express from 'express'
import { TenantController } from '../controllers/tenantController'
import { TenantService } from '../services/tenantService'
import { Tenant } from '../entity/Tenant'
import { AppDataSource } from '../config/data-source'
import logger from '../config/logger'
import authenticate from '../middlewares/authenticate'
import { canAccess } from '../middlewares/canAccess'
import { ROLES } from '../constants'

const router = express.Router()

const tenantRepository = AppDataSource.getRepository(Tenant)
const tenantService = new TenantService(tenantRepository)
const tenantController = new TenantController(tenantService, logger)

router.post(
    '/',
    authenticate,
    canAccess([ROLES.ADMIN]),
    async (req, res, next) => await tenantController.create(req, res, next),
)

export default router
