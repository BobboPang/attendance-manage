import * as express from "express";
import { Request, Response } from "express";
import { Student } from "./entities/student.entity";
import { AppDataSource } from "./dbConnection/app-data-source";
import bodyParser = require("body-parser");

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
// 跨域设置
app.all("*", function (req, res, next) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, If-Modified-Since");
  next();
});
// register routes

app.get("/students", async function (req: Request, res: Response) {
  const students = await AppDataSource.getRepository(Student).find();
  res.json(students);
});

app.get("/students/:id", async function (req: Request, res: Response) {
  const results = await AppDataSource.getRepository(Student).findOneBy({
    id: parseInt(req.params.id),
  });
  return res.send(results);
});

app.post("/students", async function (req: Request, res: Response) {
  const students = await AppDataSource.getRepository(Student).create(req.body);
  const results = await AppDataSource.getRepository(Student).save(students);
  return res.send(results);
});

app.put("/students/:id", async function (req: Request, res: Response) {
  const students = await AppDataSource.getRepository(Student).findOneBy({
    id: parseInt(req.params.id),
  });
  AppDataSource.getRepository(Student).merge(students, req.body);
  const results = await AppDataSource.getRepository(Student).save(students);
  return res.send(results);
});

app.delete("/students/:id", async function (req: Request, res: Response) {
  const results = await AppDataSource.getRepository(Student).delete(req.params.id);
  return res.send(results);
});

// start express server
app.listen(3000);
