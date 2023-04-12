import * as express from "express";
import { Request, Response } from "express";
import { Class } from "../entities/class.entity";
import { AppDataSource } from "../dbConnection/app-data-source";
const router = express.Router();
router.get("/class", async function (req: Request, res: Response) {
  const classItem = await AppDataSource.getRepository(Class).find();
  res.json(classItem);
});

router.get("/class/:id", async function (req: Request, res: Response) {
  const results = await AppDataSource.getRepository(Class).findOneBy({
    id: parseInt(req.params.id),
  });
  return res.send(results);
});

router.post("/class", async function (req: Request, res: Response) {
  const classItem = await AppDataSource.getRepository(Class).create(req.body);
  const results = await AppDataSource.getRepository(Class).save(classItem);
  return res.send(results);
});

router.put("/class/:id", async function (req: Request, res: Response) {
  const classItem = await AppDataSource.getRepository(Class).findOneBy({
    id: parseInt(req.params.id),
  });
  AppDataSource.getRepository(Class).merge(classItem, req.body);
  const results = await AppDataSource.getRepository(Class).save(classItem);
  return res.send(results);
});

router.delete("/class/:id", async function (req: Request, res: Response) {
  const results = await AppDataSource.getRepository(Class).delete(req.params.id);
  return res.send(results);
});
export const classRouter = router;
