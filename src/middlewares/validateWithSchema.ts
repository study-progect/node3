import {ObjectSchema} from "joi";
import {Request,Response,NextFunction} from "express";
import path from "joi"
export const validateWithSchema = (schema:ObjectSchema<any>) => {
    return (
        req: Request,
        res: Response,
        next: NextFunction
    ): void => {
        const {error} = schema.validate(req.body, {abortEarly: false})
        if (error) {
            res.status(400).json({
                errors: error.details.map(detail => ({
                    message: detail.message,
                    path: detail.path.join("."),
                })),
            });
            return;
        }
        next();
    }

}

