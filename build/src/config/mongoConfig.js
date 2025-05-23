var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import mongoose from "mongoose";
import dotenv from 'dotenv';
dotenv.config();
export const mongoConnection = () => __awaiter(void 0, void 0, void 0, function* () {
    const uri = process.env.MONGO_URI;
    console.log(uri);
    if (!uri) {
        console.log('MONGO_URI not found');
        process.exit(1);
    }
    try {
        yield mongoose.connect(uri);
        console.log('connected to mongo');
    }
    catch (e) {
        console.log(e);
        process.exit(1);
    }
});
