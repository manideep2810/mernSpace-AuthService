import 'reflect-metadata'
import express, { NextFunction, Request, Response } from 'express'
import { HttpError } from 'http-errors'
import cookieParser from 'cookie-parser'
import cors from 'cors'
import logger from './config/logger'
import authRouter from './routes/auth'
import tenantRouter from './routes/tenant'
import userRouter from './routes/user'

const app = express()
app.use(cookieParser())
app.use(
    cors({
        origin: ['http://localhost:5173'],
        credentials: true,
    }),
)
app.use(express.json())
app.use(express.static('public', { dotfiles: 'allow' }))

app.get('/', (req, res) => {
    res.send('Welcome to auth service')
})

app.use('/auth', authRouter)
app.use('/tenants', tenantRouter)
app.use('/users', userRouter)

// eslint-disable-next-line @typescript-eslint/no-unused-vars
app.use((err: HttpError, req: Request, res: Response, next: NextFunction) => {
    console.log(err)
    logger.error(err.message)
    const statusCode = err.statusCode || err.status || 500

    res.status(statusCode).json({
        error: [
            {
                type: err.name,
                msg: err.message,
                path: '',
                location: '',
            },
        ],
    })
})

export default app
