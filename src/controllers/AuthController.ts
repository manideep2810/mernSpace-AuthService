import { NextFunction, Response } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import { UserService } from '../services/userService'
import { AuthRequest, RegisterUserRequest } from '../types/index'
import { Logger } from 'winston'
import { validationResult } from 'express-validator'
import { TokenService } from '../services/tokenService'
import createHttpError from 'http-errors'
import { CredentailService } from '../services/credentialService'

export class AuthController {
    constructor(
        private userService: UserService,
        private logger: Logger,
        private tokenService: TokenService,
        private credentailService: CredentailService,
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

            const newRefreshToken =
                await this.tokenService.persistRefreshToken(user)

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

    async login(req: RegisterUserRequest, res: Response, next: NextFunction) {
        const temp = validationResult(req)
        if (!temp.isEmpty()) {
            res.status(400).json({ errors: temp.array() })
            return
        }

        const { email, password } = req.body

        this.logger.debug('A new request has been received to login a user', {
            email,
            password: '******',
        })
        try {
            const user = await this.userService.findByEmail(email)

            if (!user) {
                const err = createHttpError(
                    400,
                    'Email or Password does not match',
                )
                next(err)
                return
            }

            const passwordMatch = await this.credentailService.comparePassword(
                password,
                user.password,
            )

            if (!passwordMatch) {
                const err = createHttpError(
                    400,
                    'Email or Password does not match',
                )
                next(err)
                return
            }

            const payload: JwtPayload = {
                sub: String(user.id),
                role: user.role,
            }

            const accessToken = this.tokenService.generateAccessToken(payload)

            const newRefreshToken =
                await this.tokenService.persistRefreshToken(user)

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

            this.logger.info('User has been logged in', { id: user.id })

            res.status(200).json({
                id: user.id,
            })
        } catch (err) {
            next(err)
            return
        }
    }

    async self(req: AuthRequest, res: Response) {
        // console.log(req.auth);
        // console.log('hello from self');
        const user = await this.userService.findById(Number(req.auth.sub))
        res.json({ ...user, password: undefined })
    }
}
