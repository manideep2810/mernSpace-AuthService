import { DataSource } from 'typeorm'
import { AppDataSource } from '../../config/data-source'
import app from '../../app'
import request from 'supertest'
import { Tenant } from '../../entity/Tenant'
import createJWKSMock from 'mock-jwks'
import { ROLES } from '../../constants'

describe('POST /tenants', () => {
    let connection: DataSource
    let jwks: ReturnType<typeof createJWKSMock>
    let adminToken: string

    beforeAll(async () => {
        jwks = createJWKSMock('http://localhost:5501')
        connection = await AppDataSource.initialize()
    })

    beforeEach(async () => {
        jwks.start()
        await connection.dropDatabase()
        await connection.synchronize()

        adminToken = jwks.token({
            sub: '1',
            role: ROLES.ADMIN,
        })
    })

    afterEach(() => {
        jwks.stop()
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
                .set('Cookie', [`accessToken=${adminToken};`])
                .send(tenantData)

            expect(response.statusCode).toBe(201)
        })

        it('should persist the tenant data in database', async () => {
            const tenantData = {
                name: 'Test Tenant',
                address: '123 Test St, Test City, TC 12345',
            }

            await request(app)
                .post('/tenants')
                .set('Cookie', [`accessToken=${adminToken};`])
                .send(tenantData)

            const tenantRepository = connection.getRepository(Tenant)
            const tenants = await tenantRepository.find()

            expect(tenants.length).toBe(1)
            expect(tenants[0].name).toBe(tenantData.name)
            expect(tenants[0].address).toBe(tenantData.address)
        })

        it('should return 401 status code if user is not authenticated', async () => {
            const tenantData = {
                name: 'Test Tenant',
                address: '123 Test St, Test City, TC 12345',
            }

            const response = await request(app)
                .post('/tenants')
                .send(tenantData)

            const tenantRepository = connection.getRepository(Tenant)
            const tenants = await tenantRepository.find()

            expect(tenants.length).toBe(0)
            expect(response.statusCode).toBe(401)
        })

        it('should return 403 status code if user is not admin', async () => {
            const tenantData = {
                name: 'Test Tenant',
                address: '123 Test St, Test City, TC 12345',
            }

            const managerToken = jwks.token({
                sub: '1',
                role: ROLES.MANAGER,
            })

            const response = await request(app)
                .post('/tenants')
                .set('Cookie', [`accessToken=${managerToken};`])
                .send(tenantData)

            const tenantRepository = connection.getRepository(Tenant)
            const tenants = await tenantRepository.find()

            expect(tenants.length).toBe(0)
            expect(response.statusCode).toBe(403)
        })
    })
})
