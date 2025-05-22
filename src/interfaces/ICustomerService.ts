import {Customer, CustomerResponse} from "../models/Customer.js";
import {CustomerDto} from "../dtos/CustomerDto.js";

export interface ICustomerService{
    addCustomer(dto:CustomerDto):Promise<CustomerResponse>,
    getAllCustomers():Promise<CustomerResponse[]>,
    getCustomerById(id:number):Promise<CustomerResponse | undefined>,
    deleteCustomer(id:number):Promise<CustomerResponse| undefined>,
    // addRentalToCustomer(id:number,rentalId:number):Promise<boolean>,
    validateLogin(email:string,password:string):Promise<CustomerResponse | undefined>

}