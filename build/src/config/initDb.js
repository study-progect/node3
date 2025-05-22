var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
import { sqlConnection } from "./sqlConfig.js";
export const initDb = () => __awaiter(void 0, void 0, void 0, function* () {
    const connection = yield sqlConnection();
    yield connection.execute(`CREATE TABLE IF NOT EXISTS cars(
        id INT AUTO_INCREMENT PRIMARY KEY,
        model VARCHAR(50) NOT NULL,
        brand VARCHAR(50) NOT NULL,
        year INT NOT NULL,
        dailyPrice DECIMAL(10,2) NOT NULL,
        available BOOLEAN DEFAULT TRUE )`);
    yield connection.execute(`CREATE TABLE IF NOT EXISTS customers(
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        password VARCHAR(255) NOT NULL
        )`);
    yield connection.execute(`CREATE TABLE IF NOT EXISTS rentals(
    id INT AUTO_INCREMENT PRIMARY KEY,
    carId INT NOT NULL,
    customerId INT NOT NULL,
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    totalPrice DECIMAL(10,2) NOT NULL,
    status ENUM("active","completed","cancelled") NOT NULL,
    FOREIGN KEY (carId) REFERENCES cars(id),
        FOREIGN KEY (customerId) REFERENCES customers(id) )`);
    console.log('tables created');
});
