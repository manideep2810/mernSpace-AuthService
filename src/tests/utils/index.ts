import { DataSource, Repository } from 'typeorm'
import logger from '../../config/logger'
import { Tenant } from '../../entity/Tenant'

export const truncateTables = async (connection: DataSource) => {
    const entities = connection.entityMetadatas
    for (const entity of entities) {
        const repository = connection.getRepository(entity.name)
        await repository.clear()
    }
}

export const isJWT = (token: string | null): boolean => {
    if (token == null) {
        return false
    }

    const parts = token.split('.')
    if (parts.length !== 3) {
        return false
    }

    try {
        parts.forEach((part) => {
            Buffer.from(part, 'base64').toString('utf8')
        })
        return true
    } catch (err) {
        logger.error('Invalid JWT token', { error: err })
        return false
    }
}

export const createTenant = async (repository: Repository<Tenant>) => {
    const tenant = await repository.save({
        name: 'Test tenant',
        address: 'Test address',
    })
    return tenant
}
