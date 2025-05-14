import app from '../../src/app'
import request from 'supertest'

describe('POST auth/register', () => {
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
        })
    })
    describe('Missing Feilds', () => {})
})
