import { config } from 'dotenv'
config()
import app from './app'
import { Config } from './config'
import logger from './config/logger'
import { AppDataSource } from './config/data-source'

// console.log(process.env.NODE_ENV)

const startServer = async () => {
    const { PORT } = Config
    try {
        await AppDataSource.initialize()
        logger.info('Database connected succesfully')
        app.listen(PORT, () => {
            logger.info(`server is running on port ${PORT}`)
        })
    } catch (err) {
        console.error('Error starting server:', err)
        process.exit(1)
    }
}

void startServer()
