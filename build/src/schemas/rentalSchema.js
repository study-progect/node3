import Joi from "joi";
import { CarModel } from "../models/enums/CarModel.js";
export const rentalSchema = Joi.object({
    model: Joi.string().valid(...Object.values(CarModel)).required().messages({
        "any.only": "Model must be a valid car model",
        "any.required": "Model is required",
        "string.base": "Model must be a string",
    }),
    customerId: Joi.number().integer().min(1).required().messages({ 'number.base': 'customerId must be a number',
        'number.integer': 'customerId must be an integer',
        'number.min': 'customerId must be positive',
        'any.required': 'customerId is required' }),
    startDate: Joi.string().isoDate().required().messages({ 'any.required': 'startDate is required',
        'string.isoDate': 'startDate must be a valid ISO date', }),
    endDate: Joi.string().isoDate().required().messages({ 'any.required': 'endDate is required',
        'string.isoDate': 'endDate must be a valid ISO date', })
});
