import {sqlConnection} from "./sqlConfig.js";

export const initDb =async () => {
    const connection = await sqlConnection()
    await connection.execute(`CREATE TABLE IF NOT EXISTS cars(
        id INT AUTO_INCREMENT PRIMARY KEY,
        model VARCHAR(50) NOT NULL,
        brand VARCHAR(50) NOT NULL,
        year INT NOT NULL,
        dailyPrice DECIMAL(10,2) NOT NULL,
        available BOOLEAN DEFAULT TRUE )`);
    await connection.execute(`CREATE TABLE IF NOT EXISTS customers(
        id INT AUTO_INCREMENT PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL,
        phone VARCHAR(20) NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(30) NOT NULL DEFAULT 'CUSTOMER',
        )`);
    await connection.execute(`CREATE TABLE IF NOT EXISTS rentals(
    id INT AUTO_INCREMENT PRIMARY KEY,
    carId INT NOT NULL,
    customerId INT NOT NULL,
    startDate DATE NOT NULL,
    endDate DATE NOT NULL,
    totalPrice DECIMAL(10,2) NOT NULL,
    status ENUM("active","completed","cancelled") NOT NULL,
    FOREIGN KEY (carId) REFERENCES cars(id),
        FOREIGN KEY (customerId) REFERENCES customers(id) )`);
    console.log('tables created')
};