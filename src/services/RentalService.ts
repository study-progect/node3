import {IPersistable} from "../interfaces/IPesistable.js";
import {IRentalService} from "../interfaces/IRentalService.js";
import {RentalDto} from "../dtos/RentalDto.js";
import {Rental} from "../models/Rental.js";
import {CarService} from "./CarService.js";
import {Customer} from "../models/Customer.js";
import {FileStorage} from "../storages/FileStorage.js";
import {AppError} from "../errors/AppError.js";
import { v4 as uuidv4 } from "uuid";

export class RentalService implements IRentalService, IPersistable{
    private rentals:Rental[] = []

    constructor(private carService:CarService, private customerService:CustomerService, private storage:FileStorage<Rental>
    ) {

    }
    async createRental(dto:RentalDto):Promise<Rental | null> {
        const car = await this.carService.getCarById(dto.carId)
        const customer = await this.customerService.getCustomerById(dto.customerId)
        if(!car || !car.available || !customer) {
            throw new AppError("Car or customer not found or car not available", 404)
        }
        const days = (new Date(dto.endDate).getTime() - new Date(dto.startDate).getTime()) / (1000 * 3600 * 24)
        const rental:Rental = {
            id:uuidv4(),
            carId:dto.carId,
            customerId:dto.customerId,
            startDate:dto.startDate,
            endDate:dto.endDate,
            totalCost:Math.round(days * car.dailyPrice),
            status:"active"
        }
        this.rentals.push(rental)
        await this.carService.updateAvailability(dto.carId, false)
        await this.carService.addRentalToCar(dto.carId, rental.id)
        await this.customerService.addRentalToCustomer(dto.customerId, rental.id)
        await this.save()
        return rental
    }
    async save() {
        await this.storage.save(this.rentals);
    }
    async load() {
        this.rentals = await this.storage.load();
    }
}