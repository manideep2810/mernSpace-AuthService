import { expressjwt } from 'express-jwt'
import { Config } from '../config'
import { Request } from 'express'
import { AuthCookie, IRefreshtokenPayload } from '../types'
import { AppDataSource } from '../config/data-source'
import { RefreshToken } from '../entity/RefreshToken'
import logger from '../config/logger'

export default expressjwt({
    secret: Config.REFRESH_TOKEN_SECRET!,
    algorithms: ['HS256'],

    getToken(req: Request) {
        const { refreshToken } = req.cookies as AuthCookie
        return refreshToken
    },

    async isRevoked(req: Request, token) {
        try {
            const refreshTokenRepository =
                AppDataSource.getRepository(RefreshToken)
            const refreshToken = await refreshTokenRepository.findOne({
                where: {
                    id: Number((token?.payload as IRefreshtokenPayload).id),
                    user: { id: Number(token?.payload.sub) },
                },
            })
            return refreshToken === null
            // eslint-disable-next-line @typescript-eslint/no-unused-vars
        } catch (error) {
            logger.error('Error while getting the refresh Token', {
                id: (token?.payload as IRefreshtokenPayload).id,
            })
        }
        return true
    },
})
