import {Car, CarModelMongo} from "../models/Car.js";
import {FileStorage} from "../storages/FileStorage.js";
import {CarDto} from "../dtos/CarDto.js";
import { v4 as uuidv4 } from "uuid";
import {CarModel} from "../models/enums/CarModel.js";
import {CarBrand} from "../models/enums/CarBrand.js";
import {ICarSevice} from "../interfaces/ICarSevice.js";
import {IPersistable} from "../interfaces/IPesistable.js";

export class CarService implements ICarSevice{
    // private cars: Car[] = [];
    // constructor(private storage: FileStorage<Car>) {}
    constructor(private carModel = CarModelMongo) {
    }

    async addCar(carDto: CarDto): Promise<Car> {

        const newCar = new CarModelMongo({
            model: carDto.model as CarModel,
            brand: carDto.brand as CarBrand,
            year: carDto.year,
                dailyPrice: carDto.dailyPrice,
                available: true,
                rentalIds: []
        });
        const savedCar = await newCar.save();
        return {id:savedCar._id.toString(),
                model:savedCar.model,
                brand:savedCar.brand,
            year:savedCar.year,
            dailyPrice:savedCar.dailyPrice,
            available:savedCar.available,
            rentalIds:savedCar.rentalIds
        }
    }

    async getAllCar():Promise<Car[]> {
        // return this.cars;
        const cars = await CarModelMongo.find();
        return cars.map(savedCar => ({id:savedCar._id.toString(),
            model:savedCar.model,
            brand:savedCar.brand,
            year:savedCar.year,
            dailyPrice:savedCar.dailyPrice,
            available:savedCar.available,
            rentalIds:savedCar.rentalIds
        }));
    }
    async getCarById(id: string): Promise<Car | undefined> {
        const car = await CarModelMongo.findById(id);
        if (!car) {
            return undefined;
        }
        return car;
    }
    async updateAvailability(id: string, availability: boolean): Promise<boolean> {
        // const car = await this.getCarById(id)
        // if (!car) {
        //     return false;
        // }
        // car.available = availability;
        // await this.save();
        // return true;
        const result = await CarModelMongo.findByIdAndUpdate(id, {availability}, {new: true});
        return !!result;
    }
    async deleteCar(id: string):Promise<Car | undefined> {
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
        const car = await CarModelMongo.findByIdAndDelete(id);
        if (!car) {
            return undefined;
        }
        return car;
    }
    // async save() {
    //     await this.storage.save(this.cars);
    // }
    // async load() {
    //     this.cars = await this.storage.load();
    // }
    async addRentalToCar(carId:string, rentalId:string):Promise<boolean> {
      //   const car = await this.getCarById(carId)
      //   if (!car) {
      //       throw "Car not found"
      //   }
      //   if (!car.rentalIds.includes(rentalId)) {
      //       car.rentalIds.push(rentalId)
      //       await this.save()
      //   }
      // return true;
        const car = await CarModelMongo.findById(carId);
        if (!car) {
            return false;
        }
        if(!car.rentalIds.includes(rentalId)) {
            car.rentalIds.push(rentalId);
            await car.save();
        }
        return Promise.resolve(true);
    }
}