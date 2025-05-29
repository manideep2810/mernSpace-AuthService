import path from 'path'
import { config } from 'dotenv'
config({ path: path.join(__dirname, `../../.env.${process.env.NODE_ENV}`) })
// console.log(process.env.NODE_ENV);

const {
    PORT,
    NODE_ENV,
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_PASSWORD,
    DB_USERNAME,
    REFRESH_TOKEN_SECRET,
} = process.env

// console.log(__dirname, `../../.env.${process.env.NODE_ENV}`);

// console.log(process.env.PORT);
// console.log(DB_PASSWORD, typeof DB_PASSWORD)

export const Config = {
    PORT,
    NODE_ENV,
    DB_HOST,
    DB_PORT,
    DB_NAME,
    DB_PASSWORD,
    DB_USERNAME,
    REFRESH_TOKEN_SECRET,
}
