import Joi from "joi";
import {CarModel} from "../models/enums/CarModel.js";
import {CarBrand} from "../models/enums/CarBrand.js";

export const carSchema = Joi.object({
    model: Joi.string()
        .required()
        .valid(...Object.values(CarModel)).messages({
        "any.required": "model is required","any.only": "model must be one of list car models"
    }),
    brand: Joi.string().required().valid(...Object.values(CarBrand)).messages({
        "any.required": "brand is required","any.only": "brand must be one of list car brands"
    }),
    year: Joi.number().required().min(1980).max(new Date().getFullYear()).integer().messages({
        "any.required": "year is required","number.min": "year must be greater than 1980", "number.max" : "year must not be in the future"
    }),
    dailyPrice: Joi.number().required().positive().messages({
        "any.required": "daily price is required","number.positive": "daily price must be positive"
    })
})
