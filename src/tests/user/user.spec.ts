import { DataSource } from 'typeorm'
import { AppDataSource } from '../../config/data-source'
import request from 'supertest'
import app from '../../app'
import createJWKMock from 'mock-jwks'
import { User } from '../../entity/User'
import { ROLES } from '../../constants'

describe('GET /auth/self', () => {
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
        it('should return user data', async () => {
            const UserData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'John@gmail.com',
                password: '12345678',
            }

            const userRepository = connection.getRepository(User)
            const data = await userRepository.save({
                ...UserData,
                role: ROLES.CUSTOMER,
            })

            const accessToken = jwks.token({
                sub: String(data.id),
                role: data.role,
            })

            const response = await request(app)
                .get('/auth/self')
                .set('Cookie', [`accessToken=${accessToken};`])
                .send()

            expect((response.body as Record<string, string>).id).toBe(data.id)
        })

        it('should not return password feild', async () => {
            const UserData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'John@gmail.com',
                password: '12345678',
            }

            const userRepository = connection.getRepository(User)
            const data = await userRepository.save({
                ...UserData,
                role: ROLES.CUSTOMER,
            })

            const accessToken = jwks.token({
                sub: String(data.id),
                role: data.role,
            })

            const response = await request(app)
                .get('/auth/self')
                .set('Cookie', [`accessToken=${accessToken};`])
                .send()

            // console.log(response.body);
            expect(response.body as Record<string, string>).not.toHaveProperty(
                'password',
            )
        })
    })
})
