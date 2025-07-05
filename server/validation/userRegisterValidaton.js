import Joi from 'joi';

export const userRegisterValidation = Joi.object({
    name: Joi.string()
        .min(3)
        .required()
        .messages({
            'string.base': 'Name must be a string',
            'string.min': 'Name must be at least 3 characters long',
            'any.required': 'Name is required',
        }),
    email: Joi.string()
        .email()
        .required()
        .messages({
            'string.base': 'Email must be a string',
            'string.email': 'Email is invalid',
            'any.required': 'Email is required',
        }),
    password: Joi.string()
        .pattern(new RegExp('^(?=.*[A-Za-z])(?=.*\\d)[A-Za-z\\d]{8,}$'))
        .required()
        .messages({
            'string.pattern.base': 'Password must be at least 8 characters long and contain at least one letter and one number',
            'string.required': 'Password is required',
        }),
    referrerCode: Joi.string()
        .optional()
        .allow('')
});