import {Request, Response, NextFunction} from "express"
import {AuthService} from "../services/AuthService.js";
import {roles} from "../config/roles.js";

export function authenticate(req: Request, res: Response, next: NextFunction)  {
        const authHeader = req.headers.authorization
    if (!authHeader || !authHeader.startsWith('Bearer ')) {
         res.status(401).json({error: 'no token provided'})
        return
    }
    try {
        const token = authHeader.split(' ')[1]
        const decodedToken = AuthService.verifyToken(token)
        const role = roles[decodedToken.role]
        if (!role) {
            res.status(403).json({error: 'invalid role in token'})
            return
        }
        (req as any).customer = {id: decodedToken.id,name: decodedToken.name, email: decodedToken.email, phone: decodedToken.phone, role: role}
        next()
    } catch (e) {
        res.status(401).json({error: 'invalid token'})
    }

    }