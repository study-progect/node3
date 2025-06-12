import Joi from "joi";

export const rentalSchema = Joi.object({
    carId: Joi.number().integer().min(1).required().messages({'number.base': 'carId must be a number',
        'number.integer': 'carId must be an integer',
        'number.min': 'carId must be positive',
        'any.required': 'carId is required',}),
    customerId: Joi.number().integer().min(1).required().messages({'number.base': 'customerId must be a number',
        'number.integer': 'customerId must be an integer',
        'number.min': 'customerId must be positive',
        'any.required': 'customerId is required'}),
    startDate: Joi.string().isoDate().required().messages({'any.required': 'startDate is required',
        'string.isoDate': 'startDate must be a valid ISO date',}),
    endDate: Joi.string().isoDate().required().messages({'any.required': 'endDate is required',
        'string.isoDate': 'endDate must be a valid ISO date',})

})