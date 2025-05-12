import path from "path";
import {CarService} from "../services/CarService.js";
import {FileStorage} from "../storages/FileStorage.js";
import {IPersistable} from "../interfaces/IPesistable.js";

const carPath = path.resolve("data", "cars.json")
export const carService = new CarService(new FileStorage(carPath))
export const persistable:IPersistable[] = [carService]
export const loadAllDada = async () => {
    await Promise.all([
        persistable.map(p => p.load())
    ])
}
export const saveAllDada = async () => {
    await Promise.all([
        persistable.map(p => p.save())
    ])
}