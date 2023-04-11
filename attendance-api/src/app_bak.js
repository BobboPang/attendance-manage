const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const conn = require("../dbConnection/dbConnection");
const port = process.env.PORT || 5000;
var sql = "";
app.use(express.static("public"));
// app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// 跨域设置
app.all("*", function (req, res, next) {
  res.setHeader("Access-Control-Allow-Credentials", true);
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, If-Modified-Since");
  next();
});
app.get("/", (req, res) => {
  res.send("Hello World!");
});
app.post("/register", (req, res) => {
  const formReq = req.body;
  sql = "SELECT * FROM `student` WHERE username = ?";
  conn.query(sql, [formReq.username], (error, user_result) => {
    console.log("error:", error, "result", user_result);
    if (error) throw error;
    if (user_result.length != 0) {
      errorMessage = "该用户已注册";
      res.send({ status: 404, msg: errorMessage });
      return;
    } else {
      if (formReq.role === "student") sql = `INSERT INTO student set username='${formReq.username}', password='${formReq.password}',role='student'`;
      else if (formReq.role === "teacher") sql = `INSERT INTO teacher set username='${formReq.username}', password='${formReq.password}',role='teacher'`;
      console.log(sql);
      conn.query(sql, (error, create_result) => {
        if (error) throw error;
        const obj = {
          username: formReq.username,
          class: formReq.class,
          grade: formReq.grade,
          role: formReq.role,
        };
        res.send({ status: 200, msg: "新增用户成功!", data: obj });
      });
    }
  });
});
app.post("/getUserInfo", (req, res) => {
  const formReq = req.body;
  sql = formReq.role === "student" ? "SELECT * FROM `student` WHERE username = ?" : "SELECT * FROM `teacher` WHERE username = ?";
  console.log(sql);
  conn.query(sql, [formReq.username], (error, user_result) => {
    console.log("error:", error, "result", user_result);
    if (error) throw error;
    if (user_result.length == 0) {
      errorMessage = "该用户不存在";
      res.send({ status: 404, msg: errorMessage });
      return;
    } else {
      res.send({ status: 200, msg: "查询用户成功!", data: user_result });
    }
  });
});
app.post("/createClass", (req, res) => {
  const formReq = req.body;
  sql = "SELECT * FROM `class` WHERE class = ?, grade";
  conn.query(sql, [formReq.username], (error, class_result) => {
    console.log("error:", error, "result", class_result);
    if (error) throw error;
    if (user_result.length != 0) {
      errorMessage = "你已经在此班级了";
      res.send({ status: 404, msg: errorMessage });
      return;
    } else {
      sql = "SELECT * FROM `class` WHERE class = ?";
      conn.query(sql, [formReq.class], (error, class_result) => {
        if (error) throw error;
        sql = `INSERT INTO class set student='${formReq.username}',class='${formReq.class}', grade='${formReq.grade}',teacher='${class_result.teacher}'`;
        console.log(sql);
        conn.query(sql, (error, result) => {
          if (error) throw error;
          sql = `UPDATE student set class='${formReq.class}', grade='${formReq.grade}' WHERE student='${formReq.username}'`;
          conn.query(sql, (error, result) => {
            if (error) throw error;
            const obj = {
              username: formReq.username,
              class: formReq.class,
              grade: formReq.grade,
            };
            res.send({ status: 200, msg: "加入班级成功!", data: obj });
          });
        });
      });
    }
  });
});
app.post("/joinClass", (req, res) => {
  const formReq = req.body;
  sql = "SELECT * FROM `class` WHERE student = ?";
  conn.query(sql, [formReq.username], (error, class_result) => {
    console.log("error:", error, "result", class_result);
    if (error) throw error;
    if (user_result.length != 0) {
      errorMessage = "你已经在此班级了";
      res.send({ status: 404, msg: errorMessage });
      return;
    } else {
      sql = "SELECT * FROM `class` WHERE class = ?";
      conn.query(sql, [formReq.class], (error, class_result) => {
        if (error) throw error;
        sql = `INSERT INTO class set student='${formReq.username}',class='${formReq.class}', grade='${formReq.grade}',teacher='${class_result.teacher}'`;
        console.log(sql);
        conn.query(sql, (error, result) => {
          if (error) throw error;
          sql = `UPDATE student set class='${formReq.class}', grade='${formReq.grade}' WHERE student='${formReq.username}'`;
          conn.query(sql, (error, result) => {
            if (error) throw error;
            const obj = {
              username: formReq.username,
              class: formReq.class,
              grade: formReq.grade,
            };
            res.send({ status: 200, msg: "加入班级成功!", data: obj });
          });
        });
      });
    }
  });
});
app.listen(port, () => console.log(`Server running on the port : ${port}`));
