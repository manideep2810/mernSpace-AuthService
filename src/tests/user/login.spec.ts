import { DataSource } from 'typeorm'
import { AppDataSource } from '../../config/data-source'
import request from 'supertest'
import app from '../../app'
import { User } from '../../entity/User'

describe('POST /auth/login', () => {
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

    describe.skip('Given all fields', () => {
        it('should return 200', async () => {
            // Arrange
            // Create a user in the database
            const userRepository = connection.getRepository(User)
            await userRepository.save({
                firstName: 'Manideep',
                lastName: 'Naidugorle',
                email: 'manideepnaidugorle11@gmail.com',
                password: '123456789',
                role: 'CUSTOMER',
            })

            const userData = {
                email: 'manideepnaidugorle11@gmail.com',
                password: '123456789',
            }

            // Act
            await request(app).post('/auth/login').send(userData)

            // Assert
            // expect(response.statusCode).toBe(200)
        })
    })

    describe('Missing Feilds', () => {})
})
