import { NextFunction, Response } from 'express'
import { CreateUserRequest } from '../types'
import { UserService } from '../services/userService'
import { ROLES } from '../constants'

export class UserController {
    constructor(private userService: UserService) {}
    async create(req: CreateUserRequest, res: Response, next: NextFunction) {
        const { firstName, lastName, email, password } = req.body
        try {
            const user = await this.userService.create({
                firstName,
                lastName,
                email,
                password,
                role: ROLES.MANAGER,
            })
            res.status(200).json({ id: user.id })
        } catch (error) {
            next(error)
            return
        }
    }
}
