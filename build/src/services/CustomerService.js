var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { LoggerService } from "./LoggerService.js";
import { sqlConnection } from "../config/sqlConfig.js";
import bcrypt from "bcrypt";
import { roles } from "../config/roles.js";
export class CustomerService {
    constructor(logger = LoggerService) {
        this.logger = logger;
    }
    updateCustomerProfile(id, dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const connect = yield sqlConnection();
            const updates = [];
            const values = [];
            if (dto.name) {
                updates.push('name=?');
                values.push(dto.name);
            }
            if (dto.email) {
                updates.push('email=?');
                values.push(dto.email);
            }
            if (dto.phone) {
                updates.push('phone=?');
                values.push(dto.phone);
            }
            if (dto.password) {
                const hashedPassword = yield bcrypt.hash(dto.password, 10);
                updates.push('password=?');
                values.push(hashedPassword);
            }
            if (updates.length === 0) {
                return (yield this.getCustomerById(id)) || undefined;
            }
            const updateCustomer = `UPDATE customers SET ${updates.join(', ')} WHERE id=?`;
            values.push(id);
            yield connect.execute(updateCustomer, values);
            yield this.logger.logAction(`customer profile update ${id}`);
            return (yield this.getCustomerById(id)) || undefined;
        });
    }
    changeCustomerRole(id, roleName) {
        return __awaiter(this, void 0, void 0, function* () {
            const connect = yield sqlConnection();
            const role = roles[roleName];
            if (!role) {
                return undefined;
            }
            const updatesRolesQuery = `UPDATE customers SET role=? WHERE id=?`;
            yield connect.execute(updatesRolesQuery, [role.name, id]);
            yield this.logger.logAction(`customer role update ${id} new role: ${role.name}`);
            return (yield this.getCustomerById(id)) || undefined;
        });
    }
    validateLogin(email, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const connect = yield sqlConnection();
            const [rows] = yield connect.execute(`SELECT * FROM customers WHERE email = ?`, [email]);
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
            const role = roles[user.role];
            if (!role) {
                yield this.logger.logError(`customer with email not foud`, { email });
                return undefined;
            }
            return { id: user.id, name: user.name, email: user.email, phone: user.phone, role: role };
        });
    }
    addCustomer(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const connect = yield sqlConnection();
            const hashedPassword = yield bcrypt.hash(dto.password, 10);
            const insertQuery = `INSERT INTO customers (name, email,phone,password,role) VALUES (?,?,?,?,?)`;
            const [result] = yield connect.execute(insertQuery, [dto.name, dto.email, dto.phone, hashedPassword, roles.CUSTOMER.name]);
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
