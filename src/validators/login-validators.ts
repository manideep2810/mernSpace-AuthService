import { checkSchema } from 'express-validator'

export default checkSchema({
    email: {
        errorMessage: 'Email is required',
        notEmpty: true,
        trim: true,
        isEmail: true,
    },
    password: {
        errorMessage: 'First name is required',
        notEmpty: true,
    },
})

// export default [body('email').notEmpty().withMessage('Email is required')];
