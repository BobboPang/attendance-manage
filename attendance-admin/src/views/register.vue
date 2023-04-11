<script setup>
/* eslint-disable */
import { UserFilled, Lock } from "@element-plus/icons-vue";
import { onMounted, onUnmounted, reactive, ref } from "vue";
import { router } from "@/router";
import pinia from "@/store";
import { useUserStore } from "@/store/modules/user";
import axios from "@/api/index.js";
import { ElMessage } from "element-plus";
/**
 * 属性
 */
const title = ref("注册");
const userStore = useUserStore(pinia);
const loading = ref(false);
const form = reactive({
  username: "",
  password: "",
  role: "",
});
var dialogVisible = ref(false);
var tipsContent=ref("");
var tipsTitle=ref("");
/**
 * 函数
 */
const handleRegist = async () => {
  loading.value = true;
  try {
    axios.post(
      "/register",
      form,
      (values) => {
        console.log(values);
        userStore.setUserInfo(values.data);
        tipsTitle="注册详情";
        tipsContent = values.status === 200 ? `${values.data.username}注册成功`:`注册失败:${values.data.msg}`
        dialogVisible.value=true;
        setTimeout(() => {
          router.push("/home");
        }, 1500);
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
const keyDown = (e) => {
  if (e.key === "Enter") {
    handleRegist();
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
        <div class="item">            <el-form-item label="姓名">
          <el-input v-model="form.username" placeholder="姓名" :prefix-icon="UserFilled" size="large" />            </el-form-item>
        </div>
        <div class="item">            <el-form-item label="密码">
          <el-input v-model="form.password" type="password" placeholder="密码" show-password :prefix-icon="Lock" size="large" />            </el-form-item>
        </div>
        <div class="item">
          <el-radio v-model="form.role" label="teacher">我是教师</el-radio>
          <el-radio v-model="form.role" label="student">我是学生</el-radio>
        </div>
        <div class="item">
          <el-button type="primary" size="large" :loading="loading" @click="handleRegist">注册</el-button>
        </div>
      </el-card>
    </div>
    <el-dialog v-model="dialogVisible" :title="tipsTitle" width="30%">
      <span>{{ tipsContent }}</span>
      <template #footer>
        <span class="dialog-footer">
          <el-button type="primary" @click="dialogVisible = false">
            好的
          </el-button>
        </span>
      </template>
    </el-dialog>
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
    height: 600px;
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
