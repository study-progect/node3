var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
import { LoggerService } from "./LoggerService.js";
import { sqlConnection } from "../config/sqlConfig.js";
import bcrypt from "bcrypt";
export class CustomerService {
    constructor(logger = LoggerService) {
        this.logger = logger;
    }
    validateLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const connect = yield sqlConnection();
            const [rows] = yield connect.execute(`SELECT * FROM customers WHERE email = ${email}`);
            const user = rows[0];
            if (!user) {
                yield this.logger.logError(`customer with email not foud`, { email });
                return undefined;
            }
            const isMatch = yield bcrypt.compare(password, user.password);
            if (!isMatch) {
                yield this.logger.logError(`customer password not match`, { email });
                return undefined;
            }
            const { password: _ } = user, rest = __rest(user, ["password"]);
            return rest;
        });
    }
    addCustomer(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const connect = yield sqlConnection();
            const hashedPassword = yield bcrypt.hash(dto.password, 10);
            const insertQuery = `INSERT INTO customers (name, email, password,phone) VALUES (?,?,?,?)`;
            const [result] = yield connect.execute(insertQuery, [dto.name, dto.email, hashedPassword, dto.phone]);
            const insId = result.insertId;
            const [rows] = yield connect.execute(`SELECT id, name, email, phone FROM customers WHERE id = ${insId}`);
            const customerRow = rows[0];
            const customer = customerRow;
            yield this.logger.logAction('customer add', customer);
            return customer;
        });
    }
    deleteCustomer(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const connect = yield sqlConnection();
            const customer = this.getCustomerById(id);
            const [result] = yield connect.execute(`DELETE FROM customers WHERE id = ${id}`);
            const deleted = result.affectedRows > 0;
            if (deleted) {
                yield this.logger.logAction('customer delete', { customerId: id });
            }
            else {
                yield this.logger.logError(`customer delete failed`, { customerId: id });
            }
            return customer;
        });
    }
    getAllCustomers() {
        return __awaiter(this, void 0, void 0, function* () {
            const connect = yield sqlConnection();
            const [rows] = yield connect.execute(`SELECT id, name, email, phone FROM customers`);
            return rows;
        });
    }
    getCustomerById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const connect = yield sqlConnection();
            const [rows] = yield connect.execute(`SELECT id, name, email, phone FROM customers WHERE id = ${id}`);
            const customerRow = rows[0];
            if (!customerRow) {
                yield this.logger.logError(`customer with id not foud`, { customerId: id });
                return undefined;
            }
            const customer = customerRow;
            yield this.logger.logAction('customer get by id', customer);
            return customer;
        });
    }
}
