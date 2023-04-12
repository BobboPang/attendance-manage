import { DataSource } from "typeorm"

export const AppDataSource = new DataSource({
    type: "mysql",
    host: "127.0.0.1",
    username: "root",
    password: 'root',
    database: 'attendance',
    port: 3306,
    entities: ["src/entities/*.entity.ts"],
    logging: true,
    synchronize: true,
})