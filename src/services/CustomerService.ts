import {ICustomerService} from "../interfaces/ICustomerService.js";
import {CustomerDto} from "../dtos/CustomerDto.js";
import {Customer, CustomerResponse} from "../models/Customer.js";
import {LoggerService} from "./LoggerService.js";
import {sqlConnection} from "../config/sqlConfig.js";
// import {CarModelMongo} from "../models/Car.js";
import bcrypt from "bcrypt";
export class CustomerService implements ICustomerService {

    constructor(private logger =LoggerService) {
    }

    async validateLogin(email: string, password: string): Promise<CustomerResponse | undefined> {
        const connect = await sqlConnection()
        const [rows] = await connect.execute(`SELECT * FROM customers WHERE email = ${email}`)
        const user = (rows as any[])[0]
        if(!user) {
            await this.logger.logError(`customer with email not foud`, {email})
            return undefined;
        }
        const isMatch = await bcrypt.compare(password, user.password)
        if(!isMatch) {
            await this.logger.logError(`customer password not match`, {email})
            return undefined;
        }
        const {password:_, ...rest} = user
        return rest as CustomerResponse
    }

    async addCustomer(dto: CustomerDto): Promise<CustomerResponse> {
        const connect = await sqlConnection()
        const hashedPassword = await bcrypt.hash(dto.password, 10)
        
        const insertQuery = `INSERT INTO customers (name, email, password,phone) VALUES (?,?,?,?)`
        const [result] = await connect.execute(insertQuery, [dto.name, dto.email, hashedPassword,dto.phone])
        const insId = (result as any).insertId
        // const [rows] = await connect.execute(`SELECT * FROM customers WHERE id = ${insId}`)
        const [rows] = await connect.execute(`SELECT id, name, email, phone FROM customers WHERE id = ${insId}`)
        const customerRow = (rows as any[])[0]
        const customer = customerRow as CustomerResponse
        await this.logger.logAction('customer add', customer)
        return customer

    }

    async deleteCustomer(id: number): Promise<CustomerResponse| undefined> {
        const connect = await sqlConnection()
        const customer = this.getCustomerById(id)

        const [result] = await connect.execute(`DELETE FROM customers WHERE id = ${id}`)
        const deleted = (result as any).affectedRows > 0
        if(deleted) {
            await this.logger.logAction('customer delete', {customerId:id})
        } else {
            await this.logger.logError(`customer delete failed`, {customerId:id})
        }
        return customer
    }

    async getAllCustomers(): Promise<CustomerResponse[]> {
        const connect = await sqlConnection()
        // const [rows] = await connect.execute(`SELECT * FROM customers`)
        const [rows] = await connect.execute(`SELECT id, name, email, phone FROM customers`)
        return (rows as CustomerResponse[])
    }

    async getCustomerById(id: number): Promise<CustomerResponse | undefined> {
        const connect = await sqlConnection()
        // const [rows] = await connect.execute(`SELECT * FROM customers WHERE id = ${id}`)
        const [rows] = await connect.execute(`SELECT id, name, email, phone FROM customers WHERE id = ${id}`)
        const customerRow = (rows as any[])[0]
        if(!customerRow) {
            await this.logger.logError(`customer with id not foud`, {customerId:id})
            return undefined;
        }
        const customer = customerRow as CustomerResponse
        await this.logger.logAction('customer get by id', customer)
        return customer
    }

    // async addRentalToCustomer(id: string, rentalId: string): Promise<boolean> {
    //
    //     const custom = await CustomerModelMongo.findById(id);
    //     if (!custom) {
    //         return false;
    //     }
    //     if(!custom.rentalIds.includes(rentalId)) {
    //         custom.rentalIds.push(rentalId);
    //         await custom.save();
    //     }
    //     return Promise.resolve(true);
    // }

}