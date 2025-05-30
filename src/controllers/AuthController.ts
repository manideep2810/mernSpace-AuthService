import { NextFunction, Response } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import { UserService } from '../services/userService'
import { RegisterUserRequest } from '../types/index'
import { Logger } from 'winston'
import { validationResult } from 'express-validator'
import { AppDataSource } from '../config/data-source'
import { RefreshToken } from '../entity/RefreshToken'
import { TokenService } from '../services/tokenService'

export class AuthController {
    constructor(
        private userService: UserService,
        private logger: Logger,
        private tokenService: TokenService,
    ) {}
    async register(
        req: RegisterUserRequest,
        res: Response,
        next: NextFunction,
    ) {
        const temp = validationResult(req)
        if (!temp.isEmpty()) {
            res.status(400).json({ errors: temp.array() })
            return
        }

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

            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            }

            const accessToken = this.tokenService.generateAccessToken(payload)

            const MS_IN_YEAR = 60 * 60 * 1000 * 24 * 365
            const expiresAt = new Date(Date.now() + MS_IN_YEAR)
            const RefreshTokenRepo = AppDataSource.getRepository(RefreshToken)
            const newRefreshToken = await RefreshTokenRepo.save({
                expiresAt: expiresAt,
                user: user,
            })

            const refreshToken = this.tokenService.generateRefreshToken({
                ...payload,
                id: String(newRefreshToken.id),
            })

            res.cookie('accessToken', accessToken, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000,
                domain: 'localhost',
                sameSite: 'strict',
            })

            res.cookie('refreshToken', refreshToken, {
                httpOnly: true,
                maxAge: 60 * 60 * 1000 * 24 * 365,
                domain: 'localhost',
                sameSite: 'strict',
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
