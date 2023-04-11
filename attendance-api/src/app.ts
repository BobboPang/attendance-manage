import * as express from "express";
import { Request, Response } from "express";
import { Student } from "./entities/student.entity";
import { AppDataSource } from "./dbConnection/app-data-source";
import bodyParser = require("body-parser");
import { route } from "./router";
AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
// create and setup express app
const app = express();
// app.use(express.json());
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(route);
// 跨域设置
app.all("*", function (req, res, next) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, If-Modified-Since");
  next();
});

/**
 * _____________________student________________________
 */

// start express server
app.listen(3000);
