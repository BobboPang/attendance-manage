const express = require("express");
const app = express();
const bodyParser = require("body-parser");
const conn = require("../dbConnection/dbConnection");
const port = process.env.PORT || 5002;
var sql = "";
app.use(express.static("public"));
// app.use(express.urlencoded({ extended: true }));
// app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// 跨域设置
app.all("*", function (req, res, next) {
  res.setHeader("Access-Control-Allow-Credentials", "true");
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
  sql = "SELECT * FROM `class` WHERE class = ?";
  conn.query(sql, [formReq.class], (error, class_result) => {
    if (error) throw error;
    if (class_result.length != 0) {
      errorMessage = "已存在此班级";
      res.send({ status: 404, msg: errorMessage });
      return;
    } else {
      sql = `INSERT INTO class set student='',class='${formReq.class}',teacher='${formReq.username}'`;
      console.log(sql);
      conn.query(sql, (error, result) => {
        if (error) throw error;
        sql = `UPDATE teacher set class='${formReq.class}' WHERE username='${formReq.username}'`;
        conn.query(sql, (error, result) => {
          if (error) throw error;
          const obj = {
            username: formReq.username,
            class: formReq.class,
          };
          res.send({ status: 200, msg: "创建班级成功!", data: obj });
        });
      });
    }
  });
});

app.post("/joinClass", (req, res) => {
  const formReq = req.body;
  sql = "SELECT * FROM `class` WHERE class = ?";
  conn.query(sql, [formReq.class], (error, class_result) => {
    if (error) throw error;
    if (class_result.length != 0) {
      sql = `UPDATE student set class='${formReq.class}' WHERE username='${formReq.username}'`;
      conn.query(sql, (error, result) => {
        if (error) throw error;
        sql = `INSERT INTO class set student='${formReq.username}',class='${formReq.class}',teacher='${class_result[0].teacher}'`;
        conn.query(sql, (error, result) => {
          if (error) throw error;
          const obj = {
            username: formReq.username,
            class: formReq.class,
          };
          res.send({ status: 200, msg: "加入班级成功!", data: obj });
        });
        return;
      })
    } else {
      errorMessage = "不存在此班级";
      res.send({ status: 404, msg: errorMessage });
    }
  });
});
app.post("/updateClass", (req, res) => {
  const formReq = req.body;
  sql = "SELECT * FROM `class` WHERE student = ? and class = ?";
  conn.query(sql, [formReq.username, formReq.class], (error, result) => {
    if (error) throw error;
    
    if (result.length != 0) {
      errorMessage = "你已经在此班级了";
      res.send({ status: 404, msg: errorMessage });
      return;
    } else {
      sql = "SELECT * FROM `class` WHERE class = ?";
      conn.query(sql, [formReq.class], (error, class_result) => {
        if (error) throw error;
        console.log(sql, "result: ", class_result)
        if (class_result.length === 0) {
          errorMessage = "不存在此班级";
          res.send({ status: 404, msg: errorMessage });
          return;
        } else {
        sql = "SELECT * FROM `class` WHERE student = ?";
        conn.query(sql, [formReq.username], (error, student_result) => {
          if (error) throw error;
          sql = student_result.length != 0 ? `UPDATE class set student='${formReq.username}',class='${formReq.class}',teacher='${class_result[0].teacher}' WHERE student='${formReq.username}'` : `INSERT INTO class set student='${formReq.username}',class='${formReq.class}',teacher='${class_result[0].teacher}'`;;
          conn.query(sql, (error, result) => {
            if (error) throw error;
            sql = `UPDATE student set class='${formReq.class}' WHERE username='${formReq.username}'`;
            conn.query(sql, (error, result) => {
              if (error) throw error;
              const obj = {
                username: formReq.username,
                class: formReq.class,
              };
              res.send({ status: 200, msg: "更新班级成功!", data: obj });
            });
          });
        });}
      })
    }
  })
})
app.post("/check", (req, res) => {
  const formReq = req.body;
  const format= '{y}-{m}-{d} {h}:{i}:{s}';
  const date = new Date();
  const formatObj = {
    y: date.getFullYear(),
    m: date.getMonth() + 1,
    d: date.getDate(),
    h: date.getHours(),
    i: date.getMinutes(),
    s: date.getSeconds(),
    a: date.getDay(),
  };
  const timeStr = format.replace(/{([ymdhisa])+}/g, (result, key) => {
    const value = formatObj[key];
    // Note: getDay() returns 0 on Sunday
    if (key === 'a') {
      return ['日', '一', '二', '三', '四', '五', '六'][value];
    }
    return value.toString().padStart(2, '0');
  });
  sql = `INSERT INTO attendance_record set create_time='${timeStr}', name='${formReq.name}', latitude='${formReq.latitude}',longitude='${formReq.longitude}',address='${formReq.address}'`;
  console.log(sql);
  conn.query(sql, (error, user_result) => {
    if (error) throw error;
        const obj = {
          username: formReq.name,
          latitude: formReq.latitude,
          longitude: formReq.longitude,
          address: formReq.address,
          time: timeStr
        };
        res.send({ status: 200, msg: "打卡成功!", data: obj });
      });
    
});
app.post("/getClass", (req, res) => {
  const formReq = req.body;
  sql = "SELECT * FROM `class` WHERE class = ? AND teacher = ? ";
  conn.query(sql, [formReq.class, formReq.teacherName], (error, class_result) => {
    if (error) throw error;
    if (class_result.length != 0) {
          res.send({ status: 200, msg: "加入班级成功!", data: class_result });
        return;
    } else {
      errorMessage = "您还没有创建班级";
      res.send({ status: 404, msg: errorMessage });
    }
  });
});
app.post("/getAttendanceData", (req, res) => {
  const formReq = req.body;
  var attendanceData = [];
  sql = "SELECT * FROM `class` WHERE class = ? AND teacher = ? ";
  conn.query(sql, [formReq.class, formReq.teacherName], (error, class_result) => {
    if (error) throw error;
    console.log('class_result',class_result)
    if (class_result.length != 0) {
      for(const student of class_result){
        sql = "SELECT * FROM `attendance_record` WHERE name = ? ";
        conn.query(sql, [student.student], (error, result) => {
          if (error) throw error;
          if (result.length != 0) {
            for(const item of result){
              attendanceData.push({...item});
            }      
          }
        });
      }
      setTimeout(() => {
        res.send({ status: 200, msg: "查询成功!", data: attendanceData });
      }, 500);
      
    } else {
      errorMessage = "您还没有创建班级";
      res.send({ status: 404, msg: errorMessage });
    }
  });
  
});
app.listen(port, () => console.log(`Server running on the port : ${port}`));
