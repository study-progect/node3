import jwt from 'jsonwebtoken';
const secret = process.env.SECRET;
export class AuthService {
    static generateToken(customer) {
        return jwt.sign({
            id: customer.id,
            name: customer.name,
            email: customer.email,
            phone: customer.phone,
            role: customer.role.name,
        }, secret, { expiresIn: '2h' });
    }
    static verifyToken(token) {
        return jwt.verify(token, secret);
    }
}
