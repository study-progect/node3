var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import path from "path";
import { CarService } from "../services/CarService.js";
import { FileStorage } from "../storages/FileStorage.js";
const carPath = path.resolve("data", "cars.json");
export const carService = new CarService(new FileStorage(carPath));
export const persistable = [carService];
export const loadAllDada = () => __awaiter(void 0, void 0, void 0, function* () {
    yield Promise.all([
        persistable.map(p => p.load())
    ]);
});
export const saveAllDada = () => __awaiter(void 0, void 0, void 0, function* () {
    yield Promise.all([
        persistable.map(p => p.save())
    ]);
});
