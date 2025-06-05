var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AuthService } from "../services/AuthService.js";
export class AuthController {
    constructor(customerService) {
        this.customerService = customerService;
        this.login = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { email, password } = req.body;
            const customer = yield this.customerService.validateLogin(email, password);
            if (!customer) {
                return res.status(401).json({ error: "Invalid email or password" });
            }
            const token = AuthService.generateToken(customer);
            res.status(200).json({ token });
        });
    }
}
