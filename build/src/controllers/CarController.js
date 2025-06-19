var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { AppError } from "../errors/AppError.js";
export class CarController {
    constructor(carService) {
        this.carService = carService;
        this.addCar = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const carDto = req.body;
            const newCar = yield this.carService.addCar(carDto);
            res.status(201).json(newCar);
        });
        this.getAllCars = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const cars = yield this.carService.getAllCar();
            res.status(200).json(cars);
        });
        this.getCarById = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                throw new AppError("Invalid car id", 400);
            }
            const car = yield this.carService.getCarById(id);
            if (!car) {
                throw new AppError("Car not found", 404);
            }
            res.status(200).json(car);
        });
        this.updateAvailability = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                throw new AppError("Invalid car id", 400);
            }
            const updated = yield this.carService.updateAvailability(id, req.body.available);
            if (!updated) {
                throw new AppError("Car not found or invalid update", 404);
            }
            res.sendStatus(200);
        });
        this.deleteCar = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const id = parseInt(req.params.id, 10);
            if (isNaN(id)) {
                throw new AppError("Invalid car id", 400);
            }
            const car = yield this.carService.deleteCar(id);
            if (!car) {
                throw new AppError("Car not found or invalid delete", 404);
            }
            res.sendStatus(200).json(car);
        });
        this.getAvailableCars = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { startDate, endDate } = req.query;
            if (!startDate || !endDate) {
                throw new AppError("start date and end date are required", 400);
            }
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                throw new AppError("invalid date format", 400);
            }
            const cars = yield this.carService.getAvailableCars(start, end);
            res.status(200).json(cars);
        });
        this.getAvailableModels = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const { startDate, endDate } = req.query;
            if (!startDate || !endDate) {
                throw new AppError("start date and end date are required", 400);
            }
            const start = new Date(startDate);
            const end = new Date(endDate);
            if (isNaN(start.getTime()) || isNaN(end.getTime())) {
                throw new AppError("invalid date format", 400);
            }
            const models = yield this.carService.getAvailableModels(start, end);
            res.status(200).json(models);
        });
    }
}
