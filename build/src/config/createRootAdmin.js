var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { sqlConnection } from "./sqlConfig.js";
import bcrypt from "bcrypt";
export const createRootAdmin = () => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield sqlConnection();
    const [rows] = yield connection.execute('SELECT * FROM customers WHERE role="ROOT_ADMIN"');
    if (!rows.length) {
        const hashedPassword = yield bcrypt.hash(process.env.ROOT_ADMIN_PASSWORD, 10);
        yield connection.execute(`INSERT INTO customers(name,email,phone,password,role) VALUES (?,?,?,?,?)`, [process.env.ROOT_ADMIN_NAME,
            process.env.ROOT_ADMIN_EMAIL,
            process.env.ROOT_ADMIN_PHONE,
            hashedPassword,
            'ROOT_ADMIN'
        ]);
        console.log('root admin created');
    }
    else {
        console.log('root admin already exists');
    }
});
