import {CarDto} from "../dtos/CarDto.js";
import {Car} from "../models/Car.js";

export interface ICarService {
    addCar(carDto: CarDto): Promise<Car>;
    getAllCar():Promise<Car[]>;
    getCarById(id: number): Promise<Car | undefined>;
    updateAvailability(id: number, availability: boolean): Promise<boolean>;
    deleteCar(id: number):Promise<Car | undefined>;
    // addRentalToCar(carId:number, rentalId:number):Promise<boolean>;
}