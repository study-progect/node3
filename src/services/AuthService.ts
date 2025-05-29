import {Customer} from "../models/Customer.js";
import jwt from 'jsonwebtoken';
const secret = process.env.SECRET as string;
export class AuthService {
    static generateToken(customer:Omit<Customer, 'password'>):string {
        return jwt.sign({
            id: customer.id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            role: customer.role.name,
        },secret, {expiresIn: '2h'});
    }
    static verifyToken(token:string):any {
        return jwt.verify(token, secret);
    }
}