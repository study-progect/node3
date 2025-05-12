import {CarModel} from "./enums/CarModel.js";
import {CarBrand} from "./enums/CarBrand.js";

export interface Car {
    id: string;
    model: CarModel;
    brand: CarBrand;
    year: number;
    dailyPrice: number;
    available: boolean;
    rentalIds: string[];
}
