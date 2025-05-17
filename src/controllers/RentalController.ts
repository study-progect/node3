import {RentalDto} from "../dtos/RentalDto.js";
import { Request, Response } from "express"
import {RentalService} from "../services/RentalService.js";
import {AppError} from "../errors/AppError.js";

export class RentalController {
    constructor(private rentalService: RentalService) {}

     createRental = async (req: Request, res: Response) => {
        const dto:RentalDto = req.body as RentalDto;
         const rental = await this.rentalService.createRental(dto)
         if(!rental){
             throw new AppError("Can't create rental", 400);
         }
         res.status(201).json(rental);
    }
    getAllRentals = async (req: Request, res: Response) => {
        const rentals = await this.rentalService.getAllRentals()
        res.status(200).json(rentals);
    }
}