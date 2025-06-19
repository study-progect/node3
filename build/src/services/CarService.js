var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { LoggerService } from "./LoggerService.js";
import { sqlConnection } from "../config/sqlConfig.js";
export class CarService {
    constructor(logger = LoggerService) {
        this.logger = logger;
    }
    getAvailableCars(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield sqlConnection();
            const query = `SELECT c.* from cars c
            where c.available = true 
            and (not exists(
                select 1
                from car_availability ca
                where ca.carId = c.id
                and ca.date between ? and ?
                and ca.isAvailable = false
            ))`;
            const [rows] = yield connection.execute(query, [startDate, endDate]);
            return rows;
        });
    }
    getAvailableModels(startDate, endDate) {
        return __awaiter(this, void 0, void 0, function* () {
            const cars = yield this.getAvailableCars(startDate, endDate);
            const uniModels = [...new Set(cars.map(c => c.model))];
            return uniModels;
        });
    }
    addCar(carDto) {
        return __awaiter(this, void 0, void 0, function* () {
            let connect;
            try {
                connect = yield sqlConnection();
                const insertQuery = `INSERT INTO cars (model, brand, year, dailyPrice, available)
                                 VALUES (?, ?, ?, ?, true)`;
                const [result] = yield connect.execute(insertQuery, [carDto.model, carDto.brand, carDto.year, carDto.dailyPrice]);
                const insId = result.insertId;
                if (!insId) {
                    yield this.logger.logError('insert id is missing');
                    return undefined;
                }
                const [rows] = yield connect.execute(`SELECT *
                                                  FROM cars
                                                  WHERE id = ${insId}`);
                const carRow = rows[0];
                if (!carRow) {
                    yield this.logger.logError('car not found after insert', { insId });
                    return undefined;
                }
                const car = carRow;
                yield this.logger.logAction('car add', car);
                return car;
            }
            catch (e) {
                yield this.logger.logError('sql error', e);
            }
            finally {
                if (connect) {
                    yield connect.end();
                }
            }
        });
    }
    getAllCar() {
        return __awaiter(this, void 0, void 0, function* () {
            const connect = yield sqlConnection();
            try {
                const [rows] = yield connect.execute(`SELECT *
                                                  FROM cars`);
                const cars = rows.map((row) => {
                    const car = row;
                    return car;
                });
                yield this.logger.logAction('car get all', cars);
                return cars;
            }
            catch (e) {
                yield this.logger.logError('car get all error', e);
                throw e;
            }
            finally {
                yield connect.end();
            }
        });
    }
    getCarById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const connect = yield sqlConnection();
            try {
                const [rows] = yield connect.execute(`SELECT *
                                                  FROM cars
                                                  WHERE id = ${id}`);
                const carRow = rows[0];
                if (!carRow) {
                    yield this.logger.logError(`car with id not foud`, { carId: id });
                    return undefined;
                }
                const car = carRow;
                yield this.logger.logAction('car get by id', car);
                return car;
            }
            catch (e) {
                yield this.logger.logError('car get by id error', e);
                return undefined;
            }
            finally {
                yield connect.end();
            }
        });
    }
    updateAvailability(id, availability) {
        return __awaiter(this, void 0, void 0, function* () {
            const connect = yield sqlConnection();
            const [result] = yield connect.execute(`UPDATE cars
                                                SET available = ?
                                                WHERE id = ?`, [availability, id]);
            const success = result.affectedRows > 0;
            if (success) {
                yield this.logger.logAction('car update availability', { carId: id, availability });
            }
            else
                yield this.logger.logError(`car update availability failed`, { carId: id, availability });
            return success;
        });
    }
    deleteCar(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const connect = yield sqlConnection();
            const car = this.getCarById(id);
            const [result] = yield connect.execute(`DELETE
                                                FROM cars
                                                WHERE id = ${id}`);
            const success = result.affectedRows > 0;
            if (success) {
                yield this.logger.logAction('car delete', { carId: id });
            }
            else
                yield this.logger.logError(`car delete failed`, { carId: id });
            return car;
        });
    }
}
