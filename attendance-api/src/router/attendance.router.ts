import * as express from "express";
import { Request, Response } from "express";
import { Attendance } from "../entities/attendance.entity";
import { AppDataSource } from "../dbConnection/app-data-source";
const router = express.Router();
router.get("/attendanceItem", async function (req: Request, res: Response) {
  const attendanceItem = await AppDataSource.getRepository(Attendance).find();
  res.json(attendanceItem);
});

router.get("/attendanceItem/:id", async function (req: Request, res: Response) {
  const results = await AppDataSource.getRepository(Attendance).findOneBy({
    id: parseInt(req.params.id),
  });
  return res.send(results);
});

router.post("/attendanceItem", async function (req: Request, res: Response) {
  const attendanceItem = await AppDataSource.getRepository(Attendance).create(req.body);
  const results = await AppDataSource.getRepository(Attendance).save(attendanceItem);
  return res.send(results);
});

router.put("/attendanceItem/:id", async function (req: Request, res: Response) {
  const attendanceItem = await AppDataSource.getRepository(Attendance).findOneBy({
    id: parseInt(req.params.id),
  });
  AppDataSource.getRepository(Attendance).merge(attendanceItem, req.body);
  const results = await AppDataSource.getRepository(Attendance).save(attendanceItem);
  return res.send(results);
});

router.delete("/attendanceItem/:id", async function (req: Request, res: Response) {
  const results = await AppDataSource.getRepository(Attendance).delete(req.params.id);
  return res.send(results);
});
export const attendanceRouter = router;
