// 配置API接口地址
const root = "http://localhost:5002";
const pythonRoot = "http://127.0.0.1:5000";
// 引用axios
var axios = require("axios");
// 自定义判断元素类型JS
function toType(obj) {
  return {}.toString
    .call(obj)
    .match(/\s([a-zA-Z]+)/)[1]
    .toLowerCase();
}
// 参数过滤函数
function filterNull(o) {
  for (var key in o) {
    if (o[key] === null) {
      delete o[key];
    }
    if (toType(o[key]) === "string") {
      o[key] = o[key].trim();
    } else if (toType(o[key]) === "object") {
      o[key] = filterNull(o[key]);
    } else if (toType(o[key]) === "array") {
      o[key] = filterNull(o[key]);
    }
  }
  return o;
}
function apiAxios(method, url, params, success, failure, urlRoot) {
  if (params) {
    params = filterNull(params);
  }
  console.log(urlRoot);
  axios({
    method: method,
    url: url,
    data: method === "POST" || method === "PUT" ? params : null,
    params: method === "GET" || method === "DELETE" ? params : null,
    baseURL: urlRoot === "pythonRoot" ? pythonRoot : root,
    withCredentials: false,
  })
    .then(function (res) {
      console.log(res);
      if (res.status === 200) {
        if (success) {
          success(res.data);
        }
      } else {
        if (failure) {
          failure(res.data);
        } else {
          window.alert("error: " + JSON.stringify(res.data));
        }
      }
    })
    .catch(function (err) {
      console.log(err);
      let res = err.response;
      if (err) {
        window.alert("api error, HTTP CODE: " + res.data.msg);
      }
    });
}
// 返回在vue模板中的调用接口
export default {
  get: function (url, params, success, failure, urlRoot) {
    return apiAxios("GET", url, params, success, failure, urlRoot);
  },
  post: function (url, params, success, failure, urlRoot) {
    return apiAxios("POST", url, params, success, failure, urlRoot);
  },
  put: function (url, params, success, failure, urlRoot) {
    return apiAxios("PUT", url, params, success, failure, urlRoot);
  },
  delete: function (url, params, success, failure, urlRoot) {
    return apiAxios("DELETE", url, params, success, failure, urlRoot);
  },
};
