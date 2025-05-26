import { checkSchema } from 'express-validator'

export default checkSchema({
    email: {
        errorMessage: 'Email is required',
        notEmpty: true,
        trim: true,
        isEmail: true,
    },
    firstName: {
        errorMessage: 'FirstName is required',
        notEmpty: true,
        trim: true,
    },
    lastName: {
        errorMessage: 'lastName is required',
        notEmpty: true,
        trim: true,
    },
    password: {
        errorMessage: 'First name is required',
        notEmpty: true,
        isLength: {
            options: { min: 8 },
            errorMessage: 'Password must be at least 8 characters long',
        },
    },
})

// export default [body('email').notEmpty().withMessage('Email is required')];
