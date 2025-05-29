import {Permission} from "../types/Permission.js";
import {Request, Response, NextFunction} from "express"
export function checkPermission(permission:Permission)  {
    return (req: Request, res: Response, next: NextFunction) => {
        const customer = (req as any).customer
        if (!customer || !customer.role) {
            return res.status(403).json({error: 'access denied no customer or role'})
        }
        const hasPermission = customer.role.permissions.includes(permission)
        if (!hasPermission) {
            return res.status(403).json({error: 'access denied no permission'})
        }
        next()
    }
}
