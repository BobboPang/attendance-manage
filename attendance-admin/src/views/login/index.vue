<script setup>
/* eslint-disable */
import { UserFilled, Lock } from "@element-plus/icons-vue";
import { onMounted, onUnmounted, reactive, ref } from "vue";
import { router } from "@/router";
import pinia from "@/store";
import { useUserStore } from "@/store/modules/user";
import axios from "@/api/index.js";
/**
 * 属性
 */
const title = ref("请登陆");
const userStore = useUserStore(pinia);
const loading = ref(false);
const form = reactive({
  username: "",
  password: "",
  role: "",
});
var alert = ref("");
/**
 * 函数
 */
const handleLogin = async () => {
  loading.value = true;
  if (!form.username) {
    alert = "请填写全部信息";
    loading.value = false;
    return;
  }
  try {
    axios.post(
      "/getUserInfo",
      form,
      (values) => {
        console.log(values);
        userStore.setUserInfo(values.data[0]);
        router.push("/home");
      },
      (values) => {
        ElMessage.error("请求失败！原因：", values);
      }
    );
  } catch (error) {
    console.log("login error", error);
  } finally {
    loading.value = false;
  }
};
const handleRegister = () => {
  router.push("/register");
};
const keyDown = (e) => {
  if (e.key === "Enter") {
    handleLogin();
  }
};
onMounted(() => {
  window.addEventListener("keydown", keyDown);
});
onUnmounted(() => {
  window.removeEventListener("keydown", keyDown, false);
});
</script>
<template>
  <div class="login-box">
    <div class="form">
      <el-card shadow="always">
        <div class="item">
          <div class="tilte">
            <span>{{ title }}</span>
          </div>
        </div>
        <div class="item">
          <el-radio v-model="form.role" label="teacher">我是教师</el-radio>
          <el-radio v-model="form.role" label="student">我是学生</el-radio>
        </div>
        <div class="item">
          <el-input v-model="form.username" placeholder="用户名" :prefix-icon="UserFilled" size="large" />
        </div>
        <div class="item">
          <el-input v-model="form.password" type="password" placeholder="密码" show-password :prefix-icon="Lock" size="large" />
        </div>
        <div class="item">
          <el-button type="primary" size="large" :loading="loading" @click="handleLogin">登录</el-button>
          <div class="alert" style="color: red">{{ alert }}</div>
        </div>
        <el-button size="small" :loading="loading" @click="handleRegister">注册</el-button>
      </el-card>
    </div>
  </div>
</template>
<style lang="less" scoped>
.login-box {
  display: flex;
  flex-direction: row;
  width: 100%;
  height: 100%;
  align-items: center;
  justify-content: center;
  // background-color: green;

  background-size: 100% 100%;
  border-radius: 5px;
  .form {
    width: 550px;
    height: 400px;
    align-items: center;
    align-content: center;
    text-align: center;
    .el-card {
      height: 100%;
      border-radius: 20px;
    }
    .item {
      margin: 20px 0;
    }
    .el-button {
      width: 100%;
    }
    .tilte {
      font-size: 30px;
      margin-bottom: 60px;
    }
    .test {
      color: gray;
      text-align: left;
    }
  }
}
</style>
