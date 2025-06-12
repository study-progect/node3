import Joi from "joi";
export const customerSchema = Joi.object({
    name: Joi.string().min(2).max(50).required().
        messages({ 'string.base': 'Name must be a string',
        'string.empty': 'Name is required',
        'string.min': 'Name must be at least 2 characters',
        'string.max': 'Name must be at most 50 characters',
        'any.required': 'Name is required', }),
    email: Joi.string().email().required().messages({ 'string.base': 'Email must be a string',
        'string.email': 'Email must be valid',
        'string.empty': 'Email is required',
        'any.required': 'Email is required', }),
    password: Joi.string().min(6).required().messages({ 'string.min': 'Password must be at least 6 characters',
        'string.empty': 'Password is required',
        'any.required': 'Password is required', }),
    phone: Joi.string().pattern(/^\+?[0-9\-\s]{7,20}$/).required().messages({ 'string.pattern.base': 'Phone must be a valid format',
        'string.empty': 'Phone is required',
        'any.required': 'Phone is required', })
});
export const updateCustomerSchema = customerSchema.fork(['name', 'email', 'phone', 'password'], (schema) => schema.optional());
