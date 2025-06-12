import {IPersistable} from "../interfaces/IPesistable.js";
import {IRentalService} from "../interfaces/IRentalService.js";
import {RentalDto} from "../dtos/RentalDto.js";
import {Rental} from "../models/Rental.js";
import {CarService} from "./CarService.js";
import {Customer} from "../models/Customer.js";
import {FileStorage} from "../storages/FileStorage.js";
import {AppError} from "../errors/AppError.js";
import { v4 as uuidv4 } from "uuid";
import {CustomerService} from "./CustomerService.js";
import {LoggerService} from "./LoggerService.js";
import {sqlConnection} from "../config/sqlConfig.js";

export class RentalService implements IRentalService{
    // private rentals:Rental[] = []

    constructor(private carService:CarService, private customerService:CustomerService, private logger = LoggerService
    ) {

    }

    async getRentalById(id: number): Promise<Rental | undefined> {
        const connection = await sqlConnection()
        const [rows] = await connection.execute('SELECT * FROM rentals WHERE id = ?', [id]);
        const rental = (rows as Rental[])[0];
        if (rental) {
            await this.logger.logAction('rental get by id', rental);
        } else {
            await this.logger.logError('rental not found', id);
        }
        return rental;
    }
    async cancelRental(id: number): Promise<boolean> {
        const connection = await sqlConnection()
        const [rows] = await connection.execute('SELECT * FROM rentals WHERE id = ?', [id]);
        const rental = (rows as Rental[])[0];
        if(!rental) {
            await this.logger.logError('rental not found', id);
            return Promise.resolve(false);
        }
        if(rental.status === 'cancelled') {
            await this.logger.logError('rental already cancelled', id);
            return Promise.resolve(false);
        }
        const [result] = await connection.execute(`UPDATE rentals set status = 'cancelled' WHERE id = ?`, [id]);
        const affected = (result as any).affectedRows > 0;
        if (affected) {
            await this.logger.logAction('rental cancelled', id);
        } else {
            await this.logger.logError('rental no rows affected', id);
        }
        return affected;
    }
    async createRental(dto:RentalDto):Promise<Rental | null> {

        const car = await this.carService.getCarById(dto.carId)
        const custom = await this.customerService.getCustomerById(dto.customerId)
        if(!car || !car.available || !custom){
            await this.logger.logError(`car or customer not found or car not available`, {carId:dto.carId, customerId:dto.customerId})
            return null;
        }
        const days = (new Date(dto.endDate).getTime() - new Date(dto.startDate).getTime()) / (1000 * 3600 * 24)
        const totalPrice = Math.round(days * car.dailyPrice)
        const connection = await sqlConnection()
        const insertQuery = `INSERT INTO rentals (carId, customerId, startDate, endDate, totalPrice, status) VALUES (?,?,?,?,?,?)`
        const [result] = await connection.execute(insertQuery, [dto.carId, dto.customerId, dto.startDate, dto.endDate, totalPrice, "active"])
        const insId = (result as any).insertId
        const [rows] = await connection.execute(`SELECT * FROM rentals WHERE id = ${insId}`)
        const rentalRow = (rows as any[])[0]
        const rental = rentalRow as Rental
        await this.logger.logAction('rental add', rental)
        return rental
    }

   async getAllRentals(): Promise<Rental[]> {
        const connection = await sqlConnection()
       const [rows] = await connection.execute(`SELECT * FROM rentals`)
       const rentals = (rows as any[]).map((row:any) => {
           const rental = row as Rental
           return rental
       })
       await this.logger.logAction('rental get all', rentals)
       return rentals
       //  const rentals = await RentalModelMongo.find()
       // return rentals.map((rent) => ({
       //     id: rent._id.toString(),
       //     carId: rent.carId,
       //     customerId: rent.customerId,
       //     startDate: rent.startDate,
       //     endDate: rent.endDate,
       //     totalCost: rent.totalCost,
       //     status:rent.status,
       // }))

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