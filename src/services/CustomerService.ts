import {ICustomerService} from "../interfaces/ICustomerService.js";
import {CustomerDto} from "../dtos/CustomerDto.js";
import {Customer, CustomerResponse} from "../models/Customer.js";
import {LoggerService} from "./LoggerService.js";
import {sqlConnection} from "../config/sqlConfig.js";
// import {CarModelMongo} from "../models/Car.js";
import bcrypt from "bcrypt";
import {roles} from "../config/roles.js";
export class CustomerService implements ICustomerService {

    constructor(private logger =LoggerService) {
    }


    async updateCustomerProfile(id: number, dto: Partial<CustomerDto>): Promise<CustomerResponse | undefined> {
        const connect = await sqlConnection()
        const updates:string[] = []
        const values:any[] = []
        if(dto.name){
            updates.push('name=?')
            values.push(dto.name)
        }
        if(dto.email){
            updates.push('email=?')
            values.push(dto.email)
        }
        if(dto.phone){
            updates.push('phone=?')
            values.push(dto.phone)
        }
        if(dto.password){
            const hashedPassword = await bcrypt.hash(dto.password, 10)
            updates.push('password=?')
            values.push(hashedPassword)
        }
        if(updates.length === 0){
            return await this.getCustomerById(id) || undefined
        }
        const updateCustomer = `UPDATE customers SET ${updates.join(', ')} WHERE id=?`
        values.push(id)
        await connect.execute(updateCustomer,values)
        await this.logger.logAction(`customer profile update ${id}`)
        return await this.getCustomerById(id) || undefined
    }

    async changeCustomerRole(id: number, roleName: string): Promise<CustomerResponse | undefined> {
        const connect = await sqlConnection()
        const role = roles[roleName];
        if(!role){
            return undefined
        }
        const updatesRolesQuery = `UPDATE customers SET role=? WHERE id=?`
        await connect.execute(updatesRolesQuery, [role.name,id])
        await this.logger.logAction(`customer role update ${id} new role: ${role.name}`)
        return await this.getCustomerById(id) || undefined

    }
    async validateLogin(email: string, password: string): Promise<Omit<Customer, 'password'> | undefined> {
        const connect = await sqlConnection()
        // const [rows] = await connect.execute(`SELECT * FROM customers WHERE email = ${email}`)
        const [rows] = await connect.execute(`SELECT * FROM customers WHERE email = ?`, [email]);
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
        const role = roles[user.role]
        if(!role){
            await this.logger.logError(`customer with email not foud`, {email})
            return undefined;
        }

        // const {password:_, ...rest} = user
        // return rest as Customer
        return {id:user.id,name:user.name,email:user.email,phone:user.phone,role:role}
    }

    async addCustomer(dto: CustomerDto): Promise<CustomerResponse> {
        const connect = await sqlConnection()
        const hashedPassword = await bcrypt.hash(dto.password, 10)
        
        const insertQuery = `INSERT INTO customers (name, email,phone,password,role) VALUES (?,?,?,?,?)`
        const [result] = await connect.execute(insertQuery, [dto.name, dto.email,dto.phone,hashedPassword,roles.CUSTOMER.name])
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