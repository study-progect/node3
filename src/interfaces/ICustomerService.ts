import {Customer} from "../models/Customer.js";
import {CustomerDto} from "../dtos/CustomerDto.js";

export interface ICustomerService{
    addCustomer(dto:CustomerDto):Promise<Customer>,
    getAllCustomers():Promise<Customer[]>,
    getCustomerById(id:string):Promise<Customer | undefined>,
    deleteCustomer(id:string):Promise<Customer| undefined>,
    addRentalToCustomer(id:string,rentalId:string):Promise<boolean>,
}