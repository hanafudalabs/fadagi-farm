import Joi from 'joi';

export const userLoginValidation = Joi.object({
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.base': 'Email must be a string',
            'string.email': 'Invalid email or password',
            'any.required': 'Email is required',
        }),
    password: Joi.string()
        .required()
        .messages({
            'string.required': 'Password is required',
        })
});