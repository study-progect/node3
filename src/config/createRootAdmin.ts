import {sqlConnection} from "./sqlConfig.js";
import bcrypt from "bcrypt";

export const createRootAdmin = async () => {
    const connection = await sqlConnection()
    const [rows] = await connection.execute('SELECT * FROM customers WHERE role="ROOT_ADMIN"')
    if (!(rows as any[]).length ) {
        const hashedPassword = await bcrypt.hash(process.env.ROOT_ADMIN_PASSWORD!, 10)
        await connection.execute(`INSERT INTO customers(name,email,phone,password,role) VALUES (?,?,?,?,?)`,
            [process.env.ROOT_ADMIN_NAME,
            process.env.ROOT_ADMIN_EMAIL,
                process.env.ROOT_ADMIN_PHONE,
                hashedPassword,
                'ROOT_ADMIN'
            ]
            )
        console.log('root admin created')

    } else {
        console.log('root admin already exists')
    }

}