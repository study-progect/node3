import {AppError} from "../errors/AppError.js";
import {Response, Request,NextFunction} from "express";

export const errorHandler = (
    err: Error | AppError,
    req: Request,
    res: Response,
    next: NextFunction
) => {
    const status = err instanceof AppError ? err.statusCode : 500
    const message = err.message || "Something went wrong"
    res.status(status).json({status:`error`,message})
};
