import * as express from "express";
import { student } from "./student.router";
import { teacher } from "./teacher.router";
import { classRouter } from "./class.router";
import { courseRouter } from "./course.router";
import { attendanceRouter } from "./attendance.router";

const router = express.Router();

// 配置路由,遵循restful接口开发规范，统一使用json格式返回数据
router.use(function (req, res, next) {
  res.set("Content-Type", "application/json");
  res.setHeader("Access-Control-Allow-Credentials", "true");
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, If-Modified-Since");
  next();
});
// 跨域设置
// router.all("*", function (req, res, next) {
//   res.setHeader("Access-Control-Allow-Credentials", "true");
//   res.setHeader("Access-Control-Allow-Origin", "*");
//   res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
//   res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, If-Modified-Since");
//   next();
// });
router.use(student);
router.use(teacher);
router.use(classRouter);
router.use(courseRouter);
router.use(attendanceRouter);
console.log("router is ready");
// 导出路由
export const route = router;
