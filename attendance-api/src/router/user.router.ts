import * as express from "express";
import { Request, Response } from "express";
import { Teacher } from "../entities/teacher.entity";
import { Student } from "../entities/student.entity";
import { AppDataSource } from "../dbConnection/app-data-source";
const router = express.Router();
router.get("/", async function (req: Request, res: Response) {
  console.log("recieve request");
  res.send({ status: 200, msg: "recieve request" });
});

router.post("/register", async function (req: Request, res: Response) {
  const formReq = req.body;

  const findResults =
    formReq.role === "student"
      ? await AppDataSource.getRepository(Student).findOneBy({
          code: formReq.code,
        })
      : await AppDataSource.getRepository(Teacher).findOneBy({
          code: formReq.code,
        });
  if (findResults) {
    const errorMessage = "该用户已注册";
    res.send({ status: 404, msg: errorMessage });
    return;
  }
  if (formReq.role === "student") {
    const teachers = await AppDataSource.getRepository(Student).create(formReq);
    const results = await AppDataSource.getRepository(Student).save(teachers);
    res.send({ status: 200, msg: "新增用户成功!", data: results });
  }
  if (formReq.role === "teacher") {
    const teachers = await AppDataSource.getRepository(Teacher).create(formReq);
    const results = await AppDataSource.getRepository(Teacher).save(teachers);
    res.send({ status: 200, msg: "新增用户成功!", data: results });
  }
});
router.post("/getUserInfo", async function (req: Request, res: Response) {
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

router.get("/teachers", async function (req: Request, res: Response) {
  const teachers = await AppDataSource.getRepository(Teacher).find();
  res.json(teachers);
});

router.get("/teachers/:id", async function (req: Request, res: Response) {
  const results = await AppDataSource.getRepository(Teacher).findOneBy({
    id: parseInt(req.params.id),
  });
  return res.send(results);
});

router.post("/teachers", async function (req: Request, res: Response) {
  const teachers = await AppDataSource.getRepository(Teacher).create(req.body);
  const results = await AppDataSource.getRepository(Teacher).save(teachers);
  return res.send(results);
});

router.put("/teachers/:id", async function (req: Request, res: Response) {
  const teachers = await AppDataSource.getRepository(Teacher).findOneBy({
    id: parseInt(req.params.id),
  });
  AppDataSource.getRepository(Teacher).merge(teachers, req.body);
  const results = await AppDataSource.getRepository(Teacher).save(teachers);
  return res.send(results);
});

router.delete("/teachers/:id", async function (req: Request, res: Response) {
  const results = await AppDataSource.getRepository(Teacher).delete(req.params.id);
  return res.send(results);
});
console.log("userRouter:", router);
export const teacher = router;
