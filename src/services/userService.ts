import { Repository } from 'typeorm'
import { User } from '../entity/User'
import { UserData } from '../types/index'
import createHttpError from 'http-errors'
import { ROLES } from '../constants'
import bcrypt from 'bcrypt'

export class UserService {
    constructor(private userRepository: Repository<User>) {}
    async create({ firstName, lastName, email, password }: UserData) {
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
                role: ROLES.CUSTOMER,
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
}
