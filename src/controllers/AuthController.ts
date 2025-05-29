import fs from 'fs'
import path from 'path'
import { NextFunction, Response } from 'express'
import { JwtPayload, sign } from 'jsonwebtoken'
import { UserService } from '../services/userService'
import { RegisterUserRequest } from '../types/index'
import { Logger } from 'winston'
import { validationResult } from 'express-validator'
import createHttpError from 'http-errors'
import { Config } from '../config'

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

            let privateKey: Buffer
            try {
                privateKey = fs.readFileSync(
                    path.join(__dirname, '../../certs/private.pem'),
                )
            } catch (error) {
                const err = createHttpError(500, 'Private key not found')
                this.logger.error('Private key not found', { error: error })
                next(err)
                return
            }

            const accessToken = sign(payload, privateKey, {
                algorithm: 'RS256',
                expiresIn: '1h',
                issuer: 'auth-service',
            })

            const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET!, {
                algorithm: 'HS256',
                expiresIn: '1y',
                issuer: 'auth-service',
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
