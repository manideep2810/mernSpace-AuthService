import { Repository } from 'typeorm'
import { User } from '../entity/User'
import { UserData } from '../types/index'
import createHttpError from 'http-errors'
import { ROLES } from '../constants'

export class UserService {
    constructor(private userRepository: Repository<User>) {}
    async create({ firstName, lastName, email, password }: UserData) {
        // const userRepository = AppDataSource.getRepository(User);

        try {
            return await this.userRepository.save({
                firstName,
                lastName,
                email,
                password,
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
}
