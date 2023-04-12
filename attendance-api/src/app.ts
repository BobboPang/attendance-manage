import * as express from "express";
import { Teacher } from "./entities/teacher.entity";
import { Student } from "./entities/student.entity";
import { AppDataSource } from "./dbConnection/app-data-source";
import bodyParser = require("body-parser");
import { route } from "./router/index";
import { Request, Response } from "express";
const port = 5002;
const app = express();
app.use(express.static("public"));
app.use(bodyParser.json());

AppDataSource.initialize()
  .then(() => {
    console.log("Data Source has been initialized!");
  })
  .catch((err) => {
    console.error("Error during Data Source initialization:", err);
  });
// create and setup express app

// app.use(express.json());
app.use("/", route);
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.post("/getUserInfo", async function (req: Request, res: Response) {
  const formReq = req.body;
  console.log("recieve post request: getUserInfo");
  if (formReq.role === "student") {
    const teachers = await AppDataSource.getRepository(Student).findOneBy({
      code: formReq.code,
    });
    res.send({ status: 200, msg: "查询用户成功!", data: teachers });
  }
  if (formReq.role === "teacher") {
    const teacher = await AppDataSource.getRepository(Teacher).findOneBy({
      code: formReq.code,
    });
    res.send({ status: 200, msg: "查询用户成功!", data: teacher });
  }
});

// start express server
app.listen(port, () => console.log(`Server running on the port : ${port}`));
