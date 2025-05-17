import { Response } from 'express'
import { UserService } from '../services/userService'
import { RegisterUserRequest } from '../types/index'

export class AuthController {
    userService: UserService
    constructor(userService: UserService) {
        this.userService = userService
    }
    async register(req: RegisterUserRequest, res: Response) {
        const { firstName, lastName, email, password } = req.body
        // const userService = new UserService();
        await this.userService.create({ firstName, lastName, email, password })
        res.status(201).json()
    }
}
