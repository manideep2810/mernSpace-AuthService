import { Request, Response, NextFunction } from 'express'
import { AuthRequest } from '../types'
import createHttpError from 'http-errors'

export const canAccess = (roles: string[]) => {
    return (req: Request, res: Response, next: NextFunction) => {
        const _req = req as AuthRequest
        const roleFromCookie = _req.auth.role

        if (!roles.includes(roleFromCookie)) {
            const err = createHttpError(
                403,
                "You don't have permission to access this resource",
            )
            return next(err)
        }

        next()
    }
}
