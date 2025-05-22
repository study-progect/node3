import {CarService} from "../services/CarService.js";
import {CarDto} from "../dtos/CarDto.js";
import { Request, Response } from "express";
import {Car} from "../models/Car.js";
import {AppError} from "../errors/AppError.js";

export class CarController {
    constructor(private carService: CarService) {}
    addCar = async (req: Request, res: Response) => {
        const carDto: CarDto = req.body
        const newCar = await this.carService.addCar(carDto)
        res.status(201).json(newCar)
    }
    getAllCars = async (req: Request, res: Response) => {
        const cars: Car[] = await this.carService.getAllCar()
        res.status(200).json(cars)
    }
    getCarById = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id,10)
        if (isNaN(id)) {
            throw new AppError("Invalid car id", 400)
        }
        const car = await this.carService.getCarById(id)
        if (!car) {
            //  res.status(404).send("Car not found")
            // return
            throw new AppError("Car not found", 404)
        } res.status(200).json(car)
    }
    updateAvailability = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id,10)
        if (isNaN(id)) {
            throw new AppError("Invalid car id", 400)
        }
        const updated = await this.carService.updateAvailability(id, req.body.available)
        if (!updated) {
            throw new AppError("Car not found or invalid update", 404)
             // res.status(404).send("Car not found or invalid update")
            // return
        }
        res.sendStatus(200)
    }
    deleteCar = async (req: Request, res: Response) => {
        const id = parseInt(req.params.id,10)
        if (isNaN(id)) {
            throw new AppError("Invalid car id", 400)
        }
        const car = await this.carService.deleteCar(id)
        if (!car) {
            throw new AppError("Car not found or invalid delete", 404)
            // res.status(404).send("Car not found or invalid delete")
            // return
        }
        res.sendStatus(200).json(car)
    }
}