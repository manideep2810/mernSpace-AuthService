import { DataSource } from 'typeorm'
import { AppDataSource } from '../../config/data-source'
import request from 'supertest'
import app from '../../app'

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

    describe('Given all fields', () => {
        it('should return 200', async () => {
            // Arrange
            const userData = {
                email: 'manideepnaidugorle@gmail.com',
                password: '123456789',
            }

            // Act
            const response = await request(app)
                .post('/auth/login')
                .send(userData)

            // Assert
            expect(response.statusCode).toBe(200)
        })
    })

    describe('Missing Feilds', () => {})
})
