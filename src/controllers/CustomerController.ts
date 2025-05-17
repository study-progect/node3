import {CustomerService} from "../services/CustomerService.js";
import { Request, Response } from "express"
import {AppError} from "../errors/AppError.js";
import {CustomerDto} from "../dtos/CustomerDto.js";
export class CustomerController  {
    constructor(private customerService: CustomerService) {}
     getAllCustomers = async (req: Request, res: Response) => {
        const custom = await this.customerService.getAllCustomers()
         res.json(custom)

     }
     getById = async (req: Request, res: Response) => {
        const custom = await this.customerService.getCustomerById(req.params.id)
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
        const custom = await this.customerService.deleteCustomer(req.params.id)
         if (!custom) {
             throw new AppError("Customer not found or invalid customer", 404)
         }
         res.json(custom).sendStatus(204)
     }
}