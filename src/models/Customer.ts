import  mongoose,{Schema,model} from "mongoose";

export interface Customer {
    id: number;
    name: string;
    email: string;
    phone: string;
    password: string;

    // rentalIds: string[];
}
export interface CustomerResponse {
    id: number;
    name: string;
    email: string;
    phone: string;
}

// const customerSchema = new Schema<Customer>({
//     name:{type:String,required:true},
//     email:{type:String,required:true},
//     phone:{type:String,required:true},
//     rentalIds:[{type:String}]
// })

// export const CustomerModelMongo = model<Customer>("Customer", customerSchema);
