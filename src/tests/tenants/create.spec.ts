import { DataSource } from 'typeorm'
import { AppDataSource } from '../../config/data-source'
import app from '../../app'
import request from 'supertest'
import { Tenant } from '../../entity/Tenant'

describe('POST /tenants', () => {
    let connection: DataSource

    beforeAll(async () => {
        connection = await AppDataSource.initialize()
    })

    beforeEach(async () => {
        await connection.dropDatabase()
        await connection.synchronize()
    })

    afterAll(async () => {
        await connection.destroy()
    })

    describe('Given all fields', () => {
        it('should return 201 status code', async () => {
            const tenantData = {
                name: 'Test Tenant',
                address: '123 Test St, Test City, TC 12345',
            }

            const response = await request(app)
                .post('/tenants')
                .send(tenantData)

            expect(response.statusCode).toBe(201)
        })

        it('should persist the tenant data in databse', async () => {
            const tenantData = {
                name: 'Test Tenant',
                address: '123 Test St, Test City, TC 12345',
            }

            await request(app).post('/tenants').send(tenantData)

            const tenantRepository = connection.getRepository(Tenant)
            const tenants = await tenantRepository.find()

            expect(tenants.length).toBe(1)
            expect(tenants[0].name).toBe(tenantData.name)
            expect(tenants[0].address).toBe(tenantData.address)
        })
    })
})
