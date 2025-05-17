import {RentalDto} from "../dtos/RentalDto.js";
import {Rental} from "../models/Rental.js";

export interface IRentalService {
    createRental(dto:RentalDto):Promise<Rental | null>
    getAllRentals():Promise<Rental[]>
    // getRentalById(id:string):Promise<Rental | undefined>
    // cancelRental(id:string):Promise<boolean>
}
