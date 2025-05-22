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
export class RentalService {
    constructor(carService, customerService, logger = LoggerService) {
        this.carService = carService;
        this.customerService = customerService;
        this.logger = logger;
    }
    getRentalById(id) {
        throw new Error("Method not implemented.");
    }
    cancelRental(id) {
        throw new Error("Method not implemented.");
    }
    createRental(dto) {
        return __awaiter(this, void 0, void 0, function* () {
            const car = yield this.carService.getCarById(dto.carId);
            const custom = yield this.customerService.getCustomerById(dto.customerId);
            if (!car || !car.available || !custom) {
                yield this.logger.logError(`car or customer not found or car not available`, { carId: dto.carId, customerId: dto.customerId });
                return null;
            }
            const days = (new Date(dto.endDate).getTime() - new Date(dto.startDate).getTime()) / (1000 * 3600 * 24);
            const totalCost = Math.round(days * car.dailyPrice);
            const connection = yield sqlConnection();
            const insertQuery = `INSERT INTO rentals (carId, customerId, startDate, endDate, totalCost, status) VALUES (?,?,?,?,?,?)`;
            const [result] = yield connection.execute(insertQuery, [dto.carId, dto.customerId, dto.startDate, dto.endDate, totalCost, "active"]);
            const insId = result.insertId;
            const [rows] = yield connection.execute(`SELECT * FROM rentals WHERE id = ${insId}`);
            const rentalRow = rows[0];
            const rental = rentalRow;
            yield this.logger.logAction('rental add', rental);
            return rental;
        });
    }
    getAllRentals() {
        return __awaiter(this, void 0, void 0, function* () {
            const connection = yield sqlConnection();
            const [rows] = yield connection.execute(`SELECT * FROM rentals`);
            const rentals = rows.map((row) => {
                const rental = row;
                return rental;
            });
            yield this.logger.logAction('rental get all', rentals);
            return rentals;
        });
    }
}
