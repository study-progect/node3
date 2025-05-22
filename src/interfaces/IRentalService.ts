import {RentalDto} from "../dtos/RentalDto.js";
import {Rental} from "../models/Rental.js";

export interface IRentalService {
    createRental(dto:RentalDto):Promise<Rental | null>
    getAllRentals():Promise<Rental[]>
    getRentalById(id:number):Promise<Rental | undefined>
    cancelRental(id:number):Promise<boolean>
}
