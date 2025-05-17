import {IPersistable} from "../interfaces/IPesistable.js";
import {IRentalService} from "../interfaces/IRentalService.js";
import {RentalDto} from "../dtos/RentalDto.js";
import {Rental, RentalModelMongo} from "../models/Rental.js";
import {CarService} from "./CarService.js";
import {Customer} from "../models/Customer.js";
import {FileStorage} from "../storages/FileStorage.js";
import {AppError} from "../errors/AppError.js";
import { v4 as uuidv4 } from "uuid";
import {CustomerService} from "./CustomerService.js";
import {CarModelMongo} from "../models/Car.js";

export class RentalService implements IRentalService{
    // private rentals:Rental[] = []

    constructor(private carService:CarService, private customerService:CustomerService, private rentalModel = RentalModelMongo
    ) {

    }
    async createRental(dto:RentalDto):Promise<Rental | null> {
        const car = await this.carService.getCarById(dto.carId)
        const custom = await this.customerService.getCustomerById(dto.customerId)
        if(!car || !car.available || !custom){
            throw new AppError("Car or customer not found or car not available", 404)
        }
        const days = (new Date(dto.endDate).getTime() - new Date(dto.startDate).getTime()) / (1000 * 3600 * 24)
        const rental = new RentalModelMongo({
            carId:dto.carId,
                    customerId:dto.customerId,
                    startDate:dto.startDate,
                    endDate:dto.endDate,
                    totalCost:Math.round(days * car.dailyPrice),
                    status:"active"
        })
        const saved = await rental.save();
            await this.carService.updateAvailability(dto.carId, false)
            await this.carService.addRentalToCar(dto.carId, saved._id.toString())
            await this.customerService.addRentalToCustomer(dto.customerId, saved._id.toString())
            return saved
    }

   async getAllRentals(): Promise<Rental[]> {

        const rentals = await RentalModelMongo.find()
       return rentals.map((rent) => ({
           id: rent._id.toString(),
           carId: rent.carId,
           customerId: rent.customerId,
           startDate: rent.startDate,
           endDate: rent.endDate,
           totalCost: rent.totalCost,
           status:rent.status,
       }))

    }
    //     const car = await this.carService.getCarById(dto.carId)
    //     const customer = await this.customerService.getCustomerById(dto.customerId)
    //     if(!car || !car.available || !customer) {
    //         throw new AppError("Car or customer not found or car not available", 404)
    //     }
    //     const days = (new Date(dto.endDate).getTime() - new Date(dto.startDate).getTime()) / (1000 * 3600 * 24)
    //     const rental:Rental = {
    //         id:uuidv4(),
    //         carId:dto.carId,
    //         customerId:dto.customerId,
    //         startDate:dto.startDate,
    //         endDate:dto.endDate,
    //         totalCost:Math.round(days * car.dailyPrice),
    //         status:"active"
    //     }
    //     this.rentals.push(rental)
    //     await this.carService.updateAvailability(dto.carId, false)
    //     await this.carService.addRentalToCar(dto.carId, rental.id)
    //     await this.customerService.addRentalToCustomer(dto.customerId, rental.id)
    //     await this.save()
    //     return rental
    // }
    // async save() {
    //     await this.storage.save(this.rentals);
    // }
    // async load() {
    //     this.rentals = await this.storage.load();
    // }
}