import { NextFunction, Response } from 'express'
import { TenantService } from '../services/tenantService'
import { CraeteTenantRequest } from '../types'
import { Logger } from 'winston'

export class TenantController {
    constructor(
        private tenantService: TenantService,
        private logger: Logger,
    ) {}
    async create(req: CraeteTenantRequest, res: Response, next: NextFunction) {
        const { name, address } = req.body
        try {
            const tenant = await this.tenantService.create({ name, address })
            this.logger.info(`Tenant created with ID: ${tenant.id}`)
            res.status(201).json({ id: tenant.id })
        } catch (error) {
            next(error)
            return
        }
    }
}
