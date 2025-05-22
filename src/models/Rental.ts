import  mongoose,{Schema,model} from "mongoose";

export interface Rental {
    id: number;
    carId: number;
    customerId: number;
    startDate: string;
    endDate: string;
    totalCost: number;
    status: "active" | "completed" | "cancelled";
}
// const rentalSchema: Schema = new Schema<Rental>({
//     carId:{type:String,required:true},
//     customerId:{type:String,required:true},
//     startDate:{type:String,required:true},
//     endDate:{type:String,required:true},
//     totalCost:{type:Number,required:true},
//     status:{type:String,enum:["active" , "completed" , "cancelled"],required:true},
// })

// export const RentalModelMongo = model<Rental>("Rental",rentalSchema);