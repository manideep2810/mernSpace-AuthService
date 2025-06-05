import { DataSource } from 'typeorm'
import { AppDataSource } from '../../config/data-source'
import request from 'supertest'
import app from '../../app'
import createJWKMock from 'mock-jwks'
import { ROLES } from '../../constants'
import { User } from '../../entity/User'
import { createTenant } from '../utils'
import { Tenant } from '../../entity/Tenant'

describe('POST /users', () => {
    let connection: DataSource
    let jwks: ReturnType<typeof createJWKMock>

    beforeAll(async () => {
        jwks = createJWKMock('http://localhost:5501')
        connection = await AppDataSource.initialize()
    })

    beforeEach(async () => {
        jwks.start()
        // await new Promise(res => setTimeout(res, 10000));
        await connection.dropDatabase()
        await connection.synchronize()
    })

    afterEach(() => {
        jwks.stop()
    })

    afterAll(async () => {
        await connection.destroy()
    })

    describe('Given all fields', () => {
        it('should persist the user in database', async () => {
            const tenant = await createTenant(connection.getRepository(Tenant))

            const adminToken = jwks.token({
                sub: '1',
                role: ROLES.ADMIN,
            })

            const UserData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'John@gmail.com',
                password: '12345678',
                tenantId: tenant.id,
            }

            await request(app)
                .post('/users')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(UserData)

            // console.log(response.body);
            const usersRepository = connection.getRepository(User)
            const users = await usersRepository.find()

            expect(users).toHaveLength(1)
            expect(users[0].email).toBe(UserData.email)
        })

        it('should create user of role manager only', async () => {
            const tenant = await createTenant(connection.getRepository(Tenant))

            const adminToken = jwks.token({
                sub: '1',
                role: ROLES.ADMIN,
            })

            const UserData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'John@gmail.com',
                password: '12345678',
                tenantId: tenant.id,
            }

            await request(app)
                .post('/users')
                .set('Cookie', [`accessToken=${adminToken}`])
                .send(UserData)

            // console.log(response.body);
            const usersRepository = connection.getRepository(User)
            const users = await usersRepository.find()

            expect(users).toHaveLength(1)
            expect(users[0].role).toBe(ROLES.MANAGER)
        })
    })
})
