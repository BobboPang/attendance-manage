import * as express from "express";
import { Request, Response } from "express";
import { Course } from "../entities/course.entity";
import { AppDataSource } from "../dbConnection/app-data-source";
const router = express.Router();
router.get("/courses", async function (req: Request, res: Response) {
  const courses = await AppDataSource.getRepository(Course).find();
  res.json(courses);
});

router.get("/courses/:id", async function (req: Request, res: Response) {
  const results = await AppDataSource.getRepository(Course).findOneBy({
    id: parseInt(req.params.id),
  });
  return res.send(results);
});

router.post("/courses", async function (req: Request, res: Response) {
  const courses = await AppDataSource.getRepository(Course).create(req.body);
  const results = await AppDataSource.getRepository(Course).save(courses);
  return res.send(results);
});

router.put("/courses/:id", async function (req: Request, res: Response) {
  const courses = await AppDataSource.getRepository(Course).findOneBy({
    id: parseInt(req.params.id),
  });
  AppDataSource.getRepository(Course).merge(courses, req.body);
  const results = await AppDataSource.getRepository(Course).save(courses);
  return res.send(results);
});

router.delete("/courses/:id", async function (req: Request, res: Response) {
  const results = await AppDataSource.getRepository(Course).delete(req.params.id);
  return res.send(results);
});
export const courseRouter = router;
