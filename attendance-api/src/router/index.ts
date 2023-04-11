import * as express from "express";
const router = express.Router();
import { student } from "./student.router";
// 配置路由,遵循restful接口开发规范，统一使用json格式返回数据
router.use(function (req, res, next) {
  res.set("Content-Type", "application/json");
  next();
});

router.use(student);

// 导出路由
export const route = router;
