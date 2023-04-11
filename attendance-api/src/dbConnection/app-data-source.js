"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.AppDataSource = void 0;
var typeorm_1 = require("typeorm");
exports.AppDataSource = new typeorm_1.DataSource({
    type: "mysql",
    host: "127.0.0.1",
    username: "root",
    password: 'root',
    database: 'attendance',
    port: 3306,
    entities: ["src/entities/*.js"],
    logging: true,
    synchronize: true,
});
