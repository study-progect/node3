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
            const car = yield this.carService.getCarById(req.params.id);
            if (!car) {
                throw new AppError("Car not found", 404);
            }
            res.status(200).json(car);
        });
        this.updateAvailability = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const updated = yield this.carService.updateAvailability(req.params.id, req.body);
            if (!updated) {
                throw new AppError("Car not found or invalid update", 404);
            }
            res.sendStatus(200);
        });
        this.deleteCar = (req, res) => __awaiter(this, void 0, void 0, function* () {
            const car = yield this.carService.deleteCar(req.params.id);
            if (!car) {
                throw new AppError("Car not found or invalid delete", 404);
            }
            res.sendStatus(200).json(car);
        });
    }
}
