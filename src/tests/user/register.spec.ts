import app from '../../app'
import request from 'supertest'
import { DataSource } from 'typeorm'
import { AppDataSource } from '../../config/data-source'
import { ROLES } from '../../constants'
import { IncomingHttpHeaders } from 'http'
import { isJWT } from '../utils'

describe('POST auth/register', () => {
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

        it('should return id of the user created from database', async () => {
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
            expect(response.body).toHaveProperty('id')
            const repository = connection.getRepository('User')
            const users = await repository.find()
            expect((response.body as Record<string, string>).id).toBe(
                users[0].id,
            )
        })

        it('should assign a customer role', async () => {
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
            expect(response.body).toHaveProperty('id')
            const repository = connection.getRepository('User')
            const users = await repository.find()
            expect(users[0]).toHaveProperty('role')
            expect(users[0].role).toBe(ROLES.CUSTOMER)
        })

        it('should store the hashed password in database', async () => {
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

            const repository = connection.getRepository('User')
            const users = await repository.find()
            expect(users[0].password).not.toBe(UserData.password)
            expect(users[0].password).toHaveLength(60)
            expect(users[0].password).toMatch(/^\$2b\$\d+\$/)
        })

        it('should return 400 status code if email already exists', async () => {
            // Arrange
            const UserData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'John@gmail.com',
                password: '12345678',
            }
            const repository = connection.getRepository('User')
            await repository.save({ ...UserData, role: ROLES.CUSTOMER })

            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(UserData)

            // Assert
            const users = await repository.find()
            expect(response.statusCode).toBe(400)
            expect(users).toHaveLength(1)
        })

        it('should return access token and refresh token', async () => {
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
            let accessToken = null
            let refreshToken = null
            const headers = response.headers as IncomingHttpHeaders
            const cookies = headers['set-cookie'] ?? []
            cookies.forEach((cookie) => {
                if (cookie.startsWith('accessToken=')) {
                    accessToken = cookie.split(';')[0].split('=')[1]
                }

                if (cookie.startsWith('refreshToken=')) {
                    refreshToken = cookie.split(';')[0].split('=')[1]
                }
            })

            expect(accessToken).not.toBeNull()
            expect(refreshToken).not.toBeNull()

            expect(isJWT(accessToken)).toBeTruthy()
            expect(isJWT(refreshToken)).toBeTruthy()
        })

        it('should return access token and refresh token', async () => {
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
            const refreshTokenRepo = connection.getRepository('RefreshToken')
            const refreshTokens = await refreshTokenRepo.find()
            expect(refreshTokens).toHaveLength(1)

            const tokens = await refreshTokenRepo
                .createQueryBuilder('refreshToken')
                .where('refreshToken.userId = :userId', {
                    userId: (response.body as Record<string, string>).id,
                })
                .getMany()

            // console.log(tokens);
            expect(tokens).toHaveLength(1)
        })
    })

    describe('Missing Feilds', () => {
        it('should return 400 status code if email Field is Missing', async () => {
            // Arrange
            const UserData = {
                firstName: 'John',
                lastName: 'Doe',
                email: '',
                password: '12345678',
            }

            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(UserData)

            // Assert
            const repository = connection.getRepository('User')
            expect(response.statusCode).toBe(400)
            const users = await repository.find()
            expect(users).toHaveLength(0)
        })

        it('should return 400 status code if firstName Field is Missing', async () => {
            // Arrange
            const UserData = {
                firstName: '',
                lastName: 'Doe',
                email: 'Manideepnaidu@gmail.com',
                password: '12345678',
            }

            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(UserData)

            // Assert
            const repository = connection.getRepository('User')
            expect(response.statusCode).toBe(400)
            const users = await repository.find()
            expect(users).toHaveLength(0)
        })

        it('should return 400 status code if lastName Field is Missing', async () => {
            // Arrange
            const UserData = {
                firstName: 'John',
                lastName: '',
                email: 'Manideepnaidu@gmail.com',
                password: '12345678',
            }

            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(UserData)

            // Assert
            const repository = connection.getRepository('User')
            expect(response.statusCode).toBe(400)
            const users = await repository.find()
            expect(users).toHaveLength(0)
        })

        it('should return 400 status code if password Field is Missing', async () => {
            // Arrange
            const UserData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'Manideepnaidu@gmail.com',
                password: '',
            }

            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(UserData)

            // Assert
            const repository = connection.getRepository('User')
            expect(response.statusCode).toBe(400)
            const users = await repository.find()
            expect(users).toHaveLength(0)
        })
    })

    describe('Request Feilds are not in proper Format', () => {
        it('Should Trim email feild while storing in database', async () => {
            // Arrange
            const UserData = {
                firstName: 'John',
                lastName: 'Doe',
                email: ' manideepnaidu@gmail.com ',
                password: '12345678',
            }

            // Act
            await request(app).post('/auth/register').send(UserData)

            // Assert
            const repository = connection.getRepository('User')
            const users = await repository.find()
            expect(users[0].email).toBe('manideepnaidu@gmail.com')
        })

        it('should return 400 status code if email is not valid', async () => {
            // Arrange
            const UserData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'Hello',
                password: '12345678',
            }

            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(UserData)

            // Assert
            const repository = connection.getRepository('User')
            expect(response.statusCode).toBe(400)
            const users = await repository.find()
            expect(users).toHaveLength(0)
        })

        it('should return 400 status code if password length is less than 8', async () => {
            // Arrange
            const UserData = {
                firstName: 'John',
                lastName: 'Doe',
                email: 'manideepnaidu@gmail.com',
                password: '1234567',
            }

            // Act
            const response = await request(app)
                .post('/auth/register')
                .send(UserData)

            // Assert
            const repository = connection.getRepository('User')
            expect(response.statusCode).toBe(400)
            const users = await repository.find()
            expect(users).toHaveLength(0)
        })
    })
})
