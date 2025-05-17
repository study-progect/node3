import {ICustomerService} from "../interfaces/ICustomerService.js";
import {CustomerDto} from "../dtos/CustomerDto.js";
import {Customer, CustomerModelMongo} from "../models/Customer.js";
import {CarModelMongo} from "../models/Car.js";

export class CustomerService implements ICustomerService {

    constructor(private customModel =CustomerModelMongo) {
    }

    async addCustomer(dto: CustomerDto): Promise<Customer> {
        const newCustomer = new CustomerModelMongo({
            name: dto.name,
            email: dto.email,
            phone: dto.phone,
            rentalIds:[]
        })
        return await newCustomer.save()
    }

    async deleteCustomer(id: string): Promise<Customer| undefined> {
        const custom = await CustomerModelMongo.findById(id)
        if(!custom) {
            return undefined
        }
        await CustomerModelMongo.findByIdAndDelete(id)
        return custom
    }

    async getAllCustomers(): Promise<Customer[]> {
        return CustomerModelMongo.find();
    }

    async getCustomerById(id: string): Promise<Customer | undefined> {
        const custom = await CustomerModelMongo.findById(id)
        if(!custom) {
            return undefined
        }

        return custom
    }

    async addRentalToCustomer(id: string, rentalId: string): Promise<boolean> {

        const custom = await CustomerModelMongo.findById(id);
        if (!custom) {
            return false;
        }
        if(!custom.rentalIds.includes(rentalId)) {
            custom.rentalIds.push(rentalId);
            await custom.save();
        }
        return Promise.resolve(true);
    }

}