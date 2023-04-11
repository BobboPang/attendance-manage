"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var express = require("express");
var app_data_source_1 = require("./dbConnection/app-data-source");
var bodyParser = require("body-parser");
var router_1 = require("./router");
app_data_source_1.AppDataSource.initialize()
    .then(function () {
    console.log("Data Source has been initialized!");
})
    .catch(function (err) {
    console.error("Error during Data Source initialization:", err);
});
// create and setup express app
var app = express();
// app.use(express.json());
app.use(express.static("public"));
app.use(bodyParser.json());
app.use(router_1.route);
// 跨域设置
app.all("*", function (req, res, next) {
    res.setHeader("Access-Control-Allow-Credentials", "true");
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, GET, OPTIONS, DELETE, PUT");
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, If-Modified-Since");
    next();
});
/**
 * _____________________student________________________
 */
// start express server
app.listen(3000);
