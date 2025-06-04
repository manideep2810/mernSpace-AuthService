import { NextFunction, Request, Response } from 'express'
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

    async getAll(req: Request, res: Response, next: NextFunction) {
        try {
            const users = await this.userService.getAll()
            res.status(200).json({ users: users })
        } catch (error) {
            next(error)
            return
        }
    }

    async getOne(req: Request, res: Response, next: NextFunction) {
        const userId = Number(req.params.id)
        try {
            const users = await this.userService.getOne(userId)
            res.status(200).json({ users: users })
        } catch (error) {
            next(error)
            return
        }
    }

    async update(req: CreateUserRequest, res: Response, next: NextFunction) {
        const userId = Number(req.params.id)
        const { firstName, lastName, email, password } = req.body
        try {
            await this.userService.update(userId, {
                firstName,
                lastName,
                email,
                password,
            })
            res.status(200).json({ id: userId })
        } catch (error) {
            next(error)
            return
        }
    }

    async destroy(req: Request, res: Response, next: NextFunction) {
        const userId = Number(req.params.id)
        try {
            await this.userService.destroy(userId)
            res.status(200).json({})
        } catch (err) {
            next(err)
            return
        }
    }
}
