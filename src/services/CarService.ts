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

export class CarService implements ICarService {
    // private cars: Car[] = [];
    // constructor(private storage: FileStorage<Car>) {}
    constructor(private logger = LoggerService) {
    }

    async getAvailableCars(startDate: Date, endDate: Date): Promise<Car[]> {
        const connection = await sqlConnection()
        const query = `SELECT c.* from cars c
            where c.available = true 
            and (not exists(
                select 1
                from car_availability ca
                where ca.carId = c.id
                and ca.date between ? and ?
                and ca.isAvailable = false
            ))`;
        const [rows] = await connection.execute(query, [startDate, endDate]);
        return rows as Car[];
    }
    async getAvailableModels(startDate: Date, endDate: Date): Promise<string[]> {
        const cars = await this.getAvailableCars(startDate, endDate);
        const uniModels = [... new Set(cars.map(c => c.model))];
        return uniModels;
    }

    async addCar(carDto: CarDto): Promise<Car | undefined> {
        let connect
        try {
            connect = await sqlConnection()
            const insertQuery = `INSERT INTO cars (model, brand, year, dailyPrice, available)
                                 VALUES (?, ?, ?, ?, true)`
            const [result] = await connect.execute(insertQuery, [carDto.model, carDto.brand, carDto.year, carDto.dailyPrice])

            const insId = (result as any).insertId
            if (!insId) {
                await this.logger.logError('insert id is missing')
                return undefined
            }
            const [rows] = await connect.execute(`SELECT *
                                                  FROM cars
                                                  WHERE id = ${insId}`)
            const carRow = (rows as any[])[0]
            if (!carRow) {
                await this.logger.logError('car not found after insert', {insId})
                return undefined
            }
            const car = carRow as Car
            await this.logger.logAction('car add', car)
            return car
        } catch (e) {
            await this.logger.logError('sql error', e)
        } finally {
            if (connect) {
                await connect.end()
            }
        }
    }

    async getAllCar(): Promise<Car[]> {
        const connect = await sqlConnection()
        try {
            const [rows] = await connect.execute(`SELECT *
                                                  FROM cars`)
            const cars = (rows as any[]).map((row: any) => {
                const car = row as Car
                return car
            })
            await this.logger.logAction('car get all', cars)
            return cars
        } catch (e) {
            await this.logger.logError('car get all error', e)
            throw e
        } finally {
            await connect.end()
        }
    }

    async getCarById(id: number): Promise<Car | undefined> {
        const connect = await sqlConnection()
        try {
            const [rows] = await connect.execute(`SELECT *
                                                  FROM cars
                                                  WHERE id = ${id}`)
            const carRow = (rows as any[])[0]
            if (!carRow) {
                await this.logger.logError(`car with id not foud`, {carId: id})
                return undefined;
            }
            const car = carRow as Car
            await this.logger.logAction('car get by id', car)
            return car
        } catch (e) {
            await this.logger.logError('car get by id error', e)
            return undefined
        } finally {
            await connect.end()
        }
    }

    async updateAvailability(id: number, availability: boolean): Promise<boolean> {
        const connect = await sqlConnection()
        const [result] = await connect.execute(`UPDATE cars
                                                SET available = ?
                                                WHERE id = ?`, [availability, id])
        const success = (result as any).affectedRows > 0
        if (success) {
            await this.logger.logAction('car update availability', {carId: id, availability})
        } else await this.logger.logError(`car update availability failed`, {carId: id, availability})
        return success
    }

    async deleteCar(id: number): Promise<Car | undefined> {
        const connect = await sqlConnection()
        const car = this.getCarById(id)
        const [result] = await connect.execute(`DELETE
                                                FROM cars
                                                WHERE id = ${id}`)
        const success = (result as any).affectedRows > 0
        if (success) {
            await this.logger.logAction('car delete', {carId: id})
        } else await this.logger.logError(`car delete failed`, {carId: id})
        return car

    }
}