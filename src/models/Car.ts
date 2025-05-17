import {CarModel} from "./enums/CarModel.js";
import {CarBrand} from "./enums/CarBrand.js";
import  mongoose,{Schema,model} from "mongoose";

export interface Car {
    id: string;
    model: CarModel;
    brand: CarBrand;
    year: number;
    dailyPrice: number;
    available: boolean;
    rentalIds: string[];
}
const carSchema = new Schema<Car>({
    model: {type:String, enum:Object.values(CarModel), required:true},
    brand: {type:String, enum:Object.values(CarBrand), required:true},
    year: {type:Number, required:true},
    dailyPrice: {type:Number, required:true},
    available: {type:Boolean, required:true},
    rentalIds: [{type:String}],
})

export const CarModelMongo = model<Car>('Car', carSchema);
