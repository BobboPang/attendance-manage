"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.route = void 0;
var express = require("express");
var router = express.Router();
var student_router_1 = require("./student.router");
// 配置路由,遵循restful接口开发规范，统一使用json格式返回数据
router.use(function (req, res, next) {
    res.set("Content-Type", "application/json");
    next();
});
router.use(student_router_1.student);
// 导出路由
exports.route = router;
