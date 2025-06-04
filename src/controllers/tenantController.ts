import { Request, NextFunction, Response } from 'express'
import { TenantService } from '../services/tenantService'
import { CraeteTenantRequest } from '../types'
import { Logger } from 'winston'
import { validationResult } from 'express-validator'

export class TenantController {
    constructor(
        private tenantService: TenantService,
        private logger: Logger,
    ) {}
    async create(req: CraeteTenantRequest, res: Response, next: NextFunction) {
        const temp = validationResult(req)
        if (!temp.isEmpty()) {
            res.status(400).json({ errors: temp.array() })
            return
        }
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

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const tenants = await this.tenantService.getAll()
            res.json({ tenants: tenants })
        } catch (error) {
            next(error)
            return
        }
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        const tenantId = Number(req.params.id)
        try {
            const tenant = await this.tenantService.getOne(tenantId)
            res.status(200).json({ tenant: tenant })
        } catch (error) {
            next(error)
            return
        }
    }

    async update(req: CraeteTenantRequest, res: Response, next: NextFunction) {
        const tenantId = Number(req.params.id)
        const { name, address } = req.body
        try {
            await this.tenantService.update(tenantId, { name, address })
            res.status(200).json({ id: tenantId })
        } catch (error) {
            next(error)
            return
        }
    }

    async destroy(req: Request, res: Response, next: NextFunction) {
        const tenantId = Number(req.params.id)
        try {
            await this.tenantService.destroy(tenantId)
            res.status(200).json({})
        } catch (err) {
            next(err)
            return
        }
    }
}
