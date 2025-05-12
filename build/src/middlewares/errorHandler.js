import { AppError } from "../errors/AppError.js";
export const errorHandler = (err, req, res, next) => {
    const status = err instanceof AppError ? err.statusCode : 500;
    const message = err.message || "Something went wrong";
    res.status(status).json({ status: `error`, message });
};
