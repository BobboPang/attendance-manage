import * as express from "express";
import { Request, Response } from "express";
import { Student } from "../entities/student.entity";
import { AppDataSource } from "../dbConnection/app-data-source";
const router = express.Router();
router.get("/students", async function (req: Request, res: Response) {
  const students = await AppDataSource.getRepository(Student).find();
  res.json(students);
});

router.get("/students/:id", async function (req: Request, res: Response) {
  const results = await AppDataSource.getRepository(Student).findOneBy({
    id: parseInt(req.params.id),
  });
  return res.send(results);
});

router.post("/students", async function (req: Request, res: Response) {
  const students = await AppDataSource.getRepository(Student).create(req.body);
  const results = await AppDataSource.getRepository(Student).save(students);
  return res.send(results);
});

router.put("/students/:id", async function (req: Request, res: Response) {
  const students = await AppDataSource.getRepository(Student).findOneBy({
    id: parseInt(req.params.id),
  });
  AppDataSource.getRepository(Student).merge(students, req.body);
  const results = await AppDataSource.getRepository(Student).save(students);
  return res.send(results);
});

router.delete("/students/:id", async function (req: Request, res: Response) {
  const results = await AppDataSource.getRepository(Student).delete(req.params.id);
  return res.send(results);
});
export const student = router;
