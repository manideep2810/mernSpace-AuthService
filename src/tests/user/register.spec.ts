import app from '../../app'
import request from 'supertest'
import { DataSource } from 'typeorm'
import { AppDataSource } from '../../config/data-source'
import { truncateTables } from '../utils/index'

describe('POST auth/register', () => {
    let connection: DataSource

    beforeAll(async () => {
        connection = await AppDataSource.initialize()
    })

    beforeEach(async () => {
        await truncateTables(connection)
    })

    afterAll(async () => {
        await connection.destroy()
    })

    describe('Given all Fields', () => {
        it('Should return 201 status code', async () => {
            // Arrange
            const UserData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'John@gmail.com',
                password: '12345678',
            }

            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(UserData)

            // Assert
            expect(response.statusCode).toBe(201)
        })

        it('Should return a valid json response', async () => {
            // Arrange
            const UserData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'John@gmail.com',
                password: '12345678',
            }

            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(UserData)

            // Assert
            expect(response.headers['content-type']).toEqual(
                expect.stringContaining('json'),
            )
        })

        it('Should Persist user in database', async () => {
            // Arrange
            const UserData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'John@gmail.com',
                password: '12345678',
            }

            // Act
            await request(app).post('/auth/register').send(UserData)

            // Assert
            const userRepository = connection.getRepository('User')
            const user = await userRepository.find()
            expect(user).toHaveLength(1)
            expect(user[0].firstName).toEqual(UserData.firstName)
            expect(user[0].lastName).toEqual(UserData.lastName)
            expect(user[0].email).toEqual(UserData.email)
        })
    })
    describe('Missing Feilds', () => {})
})
