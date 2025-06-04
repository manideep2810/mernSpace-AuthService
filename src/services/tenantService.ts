import { Repository } from 'typeorm'
import { Itenant } from '../types'
import { Tenant } from '../entity/Tenant'

export class TenantService {
    constructor(private tenantRepository: Repository<Tenant>) {}
    async create(tenantData: Itenant) {
        return await this.tenantRepository.save(tenantData)
    }

    async getAll() {
        return await this.tenantRepository.find({})
    }

    async getOne(id: number) {
        return await this.tenantRepository.findOne({ where: { id: id } })
    }

    async update(id: number, tenantData: Itenant) {
        return await this.tenantRepository.update(id, tenantData)
    }

    async destroy(id: number) {
        return await this.tenantRepository.delete(id)
    }
}
