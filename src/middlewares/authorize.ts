import {Request, Response, NextFunction} from "express"
import {Permission} from "../types/Permission.js";
import {array} from "joi";
import {Types} from "mongoose";

export function authorize(requiredPermission:Permission) {
    return (req: Request, res: Response, next: NextFunction) => {
        const customer = (req as any).customer;
        if (!customer || !customer.role || !Array.isArray(customer.role.permissions) ||
        !(customer.role.permissions.includes(requiredPermission))) {
            res.status(403).json({error: 'forbidden no permission'})
            return;
        }
        next()
    }
}