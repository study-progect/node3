var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { v4 as uuidv4 } from "uuid";
export class CarService {
    constructor(storage) {
        this.storage = storage;
        this.cars = [];
    }
    addCar(carDto) {
        return __awaiter(this, void 0, void 0, function* () {
            const newCar = {
                id: uuidv4(),
                model: carDto.model,
                brand: carDto.brand,
                year: carDto.year,
                dailyPrice: carDto.dailyPrice,
                available: true,
                rentalIds: []
            };
            this.cars.push(newCar);
            yield this.save();
            return newCar;
        });
    }
    getAllCar() {
        return __awaiter(this, void 0, void 0, function* () {
            return this.cars;
        });
    }
    getCarById(id) {
        return __awaiter(this, void 0, void 0, function* () {
            return this.cars.find((c) => c.id === id);
        });
    }
    updateAvailability(id, availability) {
        return __awaiter(this, void 0, void 0, function* () {
            const car = yield this.getCarById(id);
            if (!car) {
                return false;
            }
            car.available = availability;
            yield this.save();
            return true;
        });
    }
    deleteCar(id) {
        return __awaiter(this, void 0, void 0, function* () {
            const index = this.cars.findIndex((car) => car.id === id);
            if (index === -1) {
                throw "No car found with id ";
            }
            const car = yield this.getCarById(id);
            this.cars.splice(index, 1);
            yield this.save();
            return car;
        });
    }
    save() {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.storage.save(this.cars);
        });
    }
    load() {
        return __awaiter(this, void 0, void 0, function* () {
            this.cars = yield this.storage.load();
        });
    }
    addRentalToCar(carId, rentalId) {
        return __awaiter(this, void 0, void 0, function* () {
            const car = yield this.getCarById(carId);
            if (!car) {
                throw "Car not found";
            }
            if (!car.rentalIds.includes(rentalId)) {
                car.rentalIds.push(rentalId);
                yield this.save();
            }
            return true;
        });
    }
}
