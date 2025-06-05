import path from "path";
import {CarService} from "../services/CarService.js";
import {FileStorage} from "../storages/FileStorage.js";
import {IPersistable} from "../interfaces/IPesistable.js";
import {LoggerService} from "../services/LoggerService.js";
import {CustomerService} from "../services/CustomerService.js";
import {RentalService} from "../services/RentalService.js";
import {mongoConnection} from "./mongoConfig.js";
import {initDb} from "./initDb.js";
import {createRootAdmin} from "./createRootAdmin.js";

// const carPath = path.resolve("data", "cars.json")
export const carService = new CarService(LoggerService)
export const customerService = new CustomerService(LoggerService)
export const rentalService = new RentalService(carService,customerService,LoggerService)
export const initApp = async () => {
    await mongoConnection()
    await initDb()
    await createRootAdmin()
    console.log('app init')
}
// export const carStorage = new FileStorage<any>(carPath)
// export const persistable:IPersistable[] = [carService]
// export const loadAllDada = async () => {
//     await Promise.all([
//         persistable.map(p => p.load())
//     ])
// }
// export const saveAllDada = async () => {
//     await Promise.all([
//         persistable.map(p => p.save())
//     ])
// }
