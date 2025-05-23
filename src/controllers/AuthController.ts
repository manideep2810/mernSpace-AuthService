import { NextFunction, Response } from 'express'
import { UserService } from '../services/userService'
import { RegisterUserRequest } from '../types/index'
import { Logger } from 'winston'

export class AuthController {
    constructor(
        private userService: UserService,
        private logger: Logger,
    ) {}
    async register(
        req: RegisterUserRequest,
        res: Response,
        next: NextFunction,
    ) {
        const { firstName, lastName, email, password } = req.body
        this.logger.debug(
            'A new request has been received to register a new user',
            { firstName, lastName, email, password: '******' },
        )
        try {
            const user = await this.userService.create({
                firstName,
                lastName,
                email,
                password,
            })
            this.logger.info('User has been registered succesfully', {
                id: user.id,
            })
            res.status(201).json({
                id: user.id,
            })
        } catch (err) {
            next(err)
            return
        }
    }
}
