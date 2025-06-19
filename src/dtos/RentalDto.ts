import {CarModel} from "../models/enums/CarModel.js";

export interface RentalDto {
    // carId: number;
    model:CarModel
    customerId: number;
    startDate: string;
    endDate: string;
}