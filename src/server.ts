import { config } from 'dotenv'
config()
import app from './app'
import { Config } from './config'
import logger from './config/logger'

console.log(process.env.NODE_ENV)

const startServer = () => {
    const { PORT } = Config
    try {
        app.listen(PORT, () => {
            logger.info(`server is running on port ${PORT}`)
        })
    } catch (err) {
        console.error('Error starting server:', err)
        process.exit(1)
    }
}

startServer()
