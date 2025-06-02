import { DataSource } from 'typeorm'
import { AppDataSource } from '../../config/data-source'
import app from '../../app'
import request from 'supertest'

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
    })
})
