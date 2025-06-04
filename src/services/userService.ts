import { Repository } from 'typeorm'
import { User } from '../entity/User'
import { UserData, UserDataWithoutRole } from '../types/index'
import createHttpError from 'http-errors'
import bcrypt from 'bcrypt'

export class UserService {
    constructor(private userRepository: Repository<User>) {}
    async create({ firstName, lastName, email, password, role }: UserData) {
        const user = await this.userRepository.findOne({
            where: { email: email },
        })
        if (user) {
            const err = createHttpError(
                400,
                'User already exists with this email',
            )
            throw err
        }

        const saltRounds = 10
        const hashedpassword = await bcrypt.hash(password, saltRounds)

        try {
            return await this.userRepository.save({
                firstName,
                lastName,
                email,
                password: hashedpassword,
                role,
            })
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (err) {
            const error = createHttpError(
                500,
                'Failed to create a user in database',
            )
            throw error
        }
    }

    async findByEmail(email: string) {
        const user = await this.userRepository.findOne({ where: { email } })
        return user
    }

    async findById(id: number) {
        const user = await this.userRepository.findOne({ where: { id } })
        return user
    }

    async getAll() {
        return await this.userRepository.find({})
    }

    async getOne(id: number) {
        return await this.userRepository.findOne({ where: { id: id } })
    }

    async update(id: number, userData: UserDataWithoutRole) {
        return await this.userRepository.update(id, userData)
    }

    async destroy(id: number) {
        return await this.userRepository.delete(id)
    }
}
