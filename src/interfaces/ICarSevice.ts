import {CarDto} from "../dtos/CarDto.js";
import {Car} from "../models/Car.js";

export interface ICarSevice {
    addCar(carDto: CarDto): Promise<Car>;
    getAllCar():Promise<Car[]>;
    getCarById(id: string): Promise<Car | undefined>;
    updateAvailability(id: string, availability: boolean): Promise<boolean>;
    deleteCar(id: string):Promise<Car | undefined>;
    addRentalToCar(carId:string, rentalId:string):Promise<boolean>;
}