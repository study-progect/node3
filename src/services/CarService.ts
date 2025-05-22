import {Car} from "../models/Car.js";
import {FileStorage} from "../storages/FileStorage.js";
import {CarDto} from "../dtos/CarDto.js";
import { v4 as uuidv4 } from "uuid";
import {CarModel} from "../models/enums/CarModel.js";
import {CarBrand} from "../models/enums/CarBrand.js";
import {ICarService} from "../interfaces/ICarService.js";
import {IPersistable} from "../interfaces/IPesistable.js";
import {LoggerService} from "./LoggerService.js";
import {sqlConnection} from "../config/sqlConfig.js";

export class CarService implements ICarService{
    // private cars: Car[] = [];
    // constructor(private storage: FileStorage<Car>) {}
    constructor(private logger = LoggerService) {
    }

    async addCar(carDto: CarDto): Promise<Car> {
        const connect = await sqlConnection()
        const insertQuery = `INSERT INTO cars (model, brand, year, dailyPrice, available) VALUES (?,?,?,?, true)`
        const [result] = await connect.execute(insertQuery, [carDto.model, carDto.brand, carDto.year, carDto.dailyPrice])

        const insId = (result as any).insertId
        const [rows] = await connect.execute(`SELECT * FROM cars WHERE id = ${insId}`)
        const carRow = (rows as any[])[0]
        const car = carRow as Car
        await this.logger.logAction('car add', car)
        return car

    }

    async getAllCar():Promise<Car[]> {
        const connect = await sqlConnection()
        const [rows] = await connect.execute(`SELECT * FROM cars`)
        const cars = (rows as any[]).map((row:any) => {
            const car = row as Car
            return car
        })
        await this.logger.logAction('car get all', cars)
        return cars
    }
    async getCarById(id: number): Promise<Car | undefined> {
        const connect = await sqlConnection()
        const [rows] = await connect.execute(`SELECT * FROM cars WHERE id = ${id}`)
        const carRow = (rows as any[])[0]
        if(!carRow) {
            await this.logger.logError(`car with id not foud`, {carId:id})
            return undefined;
        }
        const car = carRow as Car
        await this.logger.logAction('car get by id', car)
        return car
    }
    async updateAvailability(id: number, availability: boolean): Promise<boolean> {
        const connect = await sqlConnection()
        const [result] = await connect.execute(`UPDATE cars SET available = ? WHERE id = ?`, [availability, id])
        const success = (result as any).affectedRows > 0
        if(success) {
           await this.logger.logAction('car update availability', {carId:id, availability})
        } else await this.logger.logError(`car update availability failed`, {carId:id, availability})
        return success
        // const car = await this.getCarById(id)
        // if (!car) {
        //     return false;
        // }
        // car.available = availability;
        // await this.save();
        // return true;
        // const result = await CarModelMongo.findByIdAndUpdate(id, {availability}, {new: true});
        // return !!result;
    }
    async deleteCar(id: number):Promise<Car | undefined> {
        const connect = await sqlConnection()
        const car = this.getCarById(id)
        const [result] = await connect.execute(`DELETE FROM cars WHERE id = ${id}`)
        const success = (result as any).affectedRows > 0
        if(success) {
            await this.logger.logAction('car delete', {carId:id})
        } else await this.logger.logError(`car delete failed`, {carId:id})
        return car
        // const index = this.cars.findIndex((car) => car.id === id);
        //
        // if (index === -1) {
        //     throw "No car found with id "
        // }
        // const car = await this.getCarById(id)
        //
        // this.cars.splice(index, 1);
        // await this.save()
        //
        // return car;
        // const car = await CarModelMongo.findByIdAndDelete(id);
        // if (!car) {
        //     return undefined;
        // }
        // return car;
    }
    // async save() {
    //     await this.storage.save(this.cars);
    // }
    // async load() {
    //     this.cars = await this.storage.load();
    // }
    // async addRentalToCar(carId:number, rentalId:string):Promise<boolean> {
                //   const car = await this.getCarById(carId)
                //   if (!car) {
                //       throw "Car not found"
                //   }
                //   if (!car.rentalIds.includes(rentalId)) {
                //       car.rentalIds.push(rentalId)
                //       await this.save()
                //   }
    //             // return true;
    //             const car = await CarModelMongo.findById(carId);
    //             if (!car) {
    //             return false;
    //         }
    //         if(!car.rentalIds.includes(rentalId)) {
    //             car.rentalIds.push(rentalId);
    //         await car.save();
    //     }
    //     return Promise.resolve(true);
    // }
}