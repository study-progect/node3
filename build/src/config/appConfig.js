var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { CarService } from "../services/CarService.js";
import { LoggerService } from "../services/LoggerService.js";
import { CustomerService } from "../services/CustomerService.js";
import { RentalService } from "../services/RentalService.js";
import { mongoConnection } from "./mongoConfig.js";
import { initDb } from "./initDb.js";
export const carService = new CarService(LoggerService);
export const customerService = new CustomerService(LoggerService);
export const rentalService = new RentalService(carService, customerService, LoggerService);
export const initApp = () => __awaiter(void 0, void 0, void 0, function* () {
    yield mongoConnection();
    yield initDb();
    console.log('app init');
});
