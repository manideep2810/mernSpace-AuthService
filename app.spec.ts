import { calculateDiscount } from './src/utils'
import request from 'supertest'
import app from './src/app'

describe.skip('App', () => {
    it('should return the correct discount amount', () => {
        const discount = calculateDiscount(100, 10)
        expect(discount).toBe(10)
    })

    it('should return 200 for the root endpoint', async () => {
        const res = await request(app).get('/').send()
        expect(res.statusCode).toBe(200)
    })
})
