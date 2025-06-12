import {CustomerService} from "../services/CustomerService.js";
import { Request, Response } from "express"
import {AppError} from "../errors/AppError.js";
import {CustomerDto} from "../dtos/CustomerDto.js";
import {CustomerResponse} from "../models/Customer.js";
export class CustomerController  {
    constructor(private customerService: CustomerService) {}
     getAllCustomers = async (req: Request, res: Response) => {
        const custom = await this.customerService.getAllCustomers()
         res.json(custom)

     }
     getById = async (req: Request, res: Response) => {
         const id = parseInt(req.params.id,10)
         if (isNaN(id)) {
             throw new AppError("Invalid customer id", 400)
         }
        const custom = await this.customerService.getCustomerById(id)
         if (!custom) {
             throw new AppError("Customer not found or invalid customer", 404)
         }
         res.json(custom)
     }
     addCustomer = async (req: Request, res: Response) => {
        const dto:CustomerDto = req.body
         const customer = await this.customerService.addCustomer(dto)
         res.status(201).json(customer)
     }
     deleteCustomer = async (req: Request, res: Response) => {
         const id = parseInt(req.params.id,10)
         if (isNaN(id)) {
             throw new AppError("Invalid customer id", 400)
         }
        const custom = await this.customerService.deleteCustomer(id)
         if (!custom) {
             throw new AppError("Customer not found or invalid customer", 404)
         }
         res.json(custom).sendStatus(204)
     }
    // updateCustomerProfile(id:number,dto:Partial<CustomerDto>):Promise<CustomerResponse | undefined>,
    // changeCustomerRole(id:number,roleName:string):Promise<CustomerResponse | undefined>,
    updateCustomerProfile = async (req: Request, res: Response): Promise<CustomerResponse | undefined> => {
        const id = parseInt(req.params.id,10)
        if (isNaN(id)) {
            throw new AppError("Invalid customer id", 400)
        }
        const loggedUser = (req as any).customer
        if (!loggedUser || !loggedUser.role) {
            throw new AppError("Invalid customer role", 403)
        }
        if(loggedUser.role.name !== "ADMIN" && loggedUser.role.name !== "ROOT_ADMIN") {
            if(loggedUser.id !== id) {
                throw new AppError("you can update ony your own data", 403)
            }

        }
        const updated = await this.customerService.updateCustomerProfile(id, req.body)
        if (!updated) {
            throw new AppError("Customer not found or invalid customer", 404)
        }
        // res.json(updated).status(201
            res.status(201).json(updated)
        return updated
    }

    changeCustomerRole = async (req: Request, res: Response):Promise<CustomerResponse | undefined> => {
        const id = parseInt(req.params.id,10)
        const {role} = req.body
        if (isNaN(id) || !role) {
            throw new AppError("Invalid customer id or role", 400)
        }
        const updated = await this.customerService.changeCustomerRole(id, role)
        if (!updated) {
            throw new AppError("Customer not found or invalid customer", 404)
        }
        res.status(201).json(updated)

        return updated
    }
}