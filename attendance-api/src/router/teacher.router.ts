import * as express from "express";
import { Request, Response } from "express";
import { Teacher } from "../entities/teacher.entity";
import { AppDataSource } from "../dbConnection/app-data-source";
const router = express.Router();
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
export const teacher = router;
