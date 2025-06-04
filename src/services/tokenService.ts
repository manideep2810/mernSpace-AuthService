import { JwtPayload, sign } from 'jsonwebtoken'
import createHttpError from 'http-errors'
import { Config } from '../config'
import { User } from '../entity/User'
import { RefreshToken } from '../entity/RefreshToken'
import { Repository } from 'typeorm'

export class TokenService {
    constructor(private refreshTokenRepository: Repository<RefreshToken>) {}

    generateAccessToken(payload: JwtPayload) {
        let privateKey: string
        if (!Config.PRIVATE_KEY) {
            const err = createHttpError(500, 'unable to read private key')
            throw err
        }
        try {
            privateKey = Config.PRIVATE_KEY
        } catch (error) {
            console.error('Private key not found', error)
            const err = createHttpError(500, 'private key not found')
            throw err
        }

        const accessToken = sign(payload, privateKey, {
            algorithm: 'RS256',
            expiresIn: '1h',
            issuer: 'auth-service',
        })

        return accessToken
    }

    generateRefreshToken(payload: JwtPayload) {
        // console.log(payload);
        const refreshToken = sign(payload, Config.REFRESH_TOKEN_SECRET!, {
            algorithm: 'HS256',
            expiresIn: '1y',
            issuer: 'auth-service',
            jwtid: String(payload.id),
        })
        return refreshToken
    }

    async persistRefreshToken(user: User) {
        const MS_IN_YEAR = 60 * 60 * 1000 * 24 * 365
        const expiresAt = new Date(Date.now() + MS_IN_YEAR)
        const newRefreshToken = await this.refreshTokenRepository.save({
            expiresAt: expiresAt,
            user: user,
        })

        return newRefreshToken
    }

    async deleteRefreshToken(id: number) {
        return await this.refreshTokenRepository.delete({ id: id })
    }
}
