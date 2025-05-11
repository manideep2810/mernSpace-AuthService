import app from './app'
import { Config } from './config'

const startServer = () => {
    const { PORT } = Config
    try {
        app.listen(PORT, () => {
            console.log(`Server is running on port ${PORT}`)
        })
    } catch (err) {
        console.error('Error starting server:', err)
        process.exit(1)
    }
}

startServer()
