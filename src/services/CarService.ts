import {Car} from "../models/Car.js";
import {FileStorage} from "../storages/FileStorage.js";
import {CarDto} from "../dtos/CarDto.js";
import { v4 as uuidv4 } from "uuid";
import {CarModel} from "../models/enums/CarModel.js";
import {CarBrand} from "../models/enums/CarBrand.js";
import {ICarSevice} from "../interfaces/ICarSevice.js";
import {IPersistable} from "../interfaces/IPesistable.js";

export class CarService implements ICarSevice, IPersistable{
    private cars: Car[] = [];
    constructor(private storage: FileStorage<Car>) {}

    async addCar(carDto: CarDto): Promise<Car> {
        const newCar: Car = {
            id: uuidv4(),
            model: carDto.model as CarModel,
            brand: carDto.brand as CarBrand,
            year: carDto.year,
            dailyPrice: carDto.dailyPrice,
            available: true,
            rentalIds: []
        }
        this.cars.push(newCar);
        await this.save();
        return newCar;
    }

    async getAllCar():Promise<Car[]> {
        return this.cars;
    }
    async getCarById(id: string): Promise<Car | undefined> {
        return this.cars.find((c) => c.id === id);
    }
    async updateAvailability(id: string, availability: boolean): Promise<boolean> {
        const car = await this.getCarById(id)
        if (!car) {
            return false;
        }
        car.available = availability;
        await this.save();
        return true;
    }
    async deleteCar(id: string):Promise<Car | undefined> {
        const index = this.cars.findIndex((car) => car.id === id);

        if (index === -1) {
            throw "No car found with id "
        }
        const car = await this.getCarById(id)

        this.cars.splice(index, 1);
        await this.save()

        return car;
    }
    async save() {
        await this.storage.save(this.cars);
    }
    async load() {
        this.cars = await this.storage.load();
    }
    async addRentalToCar(carId:string, rentalId:string):Promise<boolean> {
        const car = await this.getCarById(carId)
        if (!car) {
            throw "Car not found"
        }
        if (!car.rentalIds.includes(rentalId)) {
            car.rentalIds.push(rentalId)
            await this.save()
        }
      return true;
    }
}