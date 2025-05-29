import {CustomerService} from "../services/CustomerService.js";
import {Request,Response,NextFunction} from "express";
import {AuthService} from "../services/AuthService.js";

export class AuthController {
    constructor(private customerService: CustomerService) {
    }
    login = async (req: Request, res: Response) => {
        const {email, password} = req.body;
        const customer = await this.customerService.validateLogin(email, password);
        if (!customer) {
            return res.status(401).json({ error: "Invalid email or password" });
        }
        const token = AuthService.generateToken(customer);
        res.status(200).json({token})
    }
}