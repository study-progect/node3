import mysql from "mysql2/promise";
export const sqlConnection =  async () => {
    const connection = await mysql.createConnection({
    host:'localhost',
        user:'root',
        password:'',
        database:'rentals_car_db',
        port:3306,
    })
    console.log('connected to Sqldb')
    return connection;
}