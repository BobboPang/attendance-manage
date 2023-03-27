<template>
  <div class="login-box">
    <div class="form">
      <el-card shadow="always">
        <div v-if="!form.role">请先登陆</div>
        <div v-if="form.role === 'student'">
          <div class="item">
            <div class="tilte">
              <span>学生主页</span>
            </div>
          </div>
          <div class="item">
            <el-form-item label="姓名">
              <el-input
                v-model="form.username"
                placeholder="请输入姓名"
                :prefix-icon="UserFilled"
                size="large"
                disabled
              />
            </el-form-item>
          </div>
          <div class="item">
            <el-form-item label="年级">
              <el-input
                v-model="form.grade"
                placeholder="请输入年级"
                :prefix-icon="UserFilled"
                size="large"
                disabled
              />
            </el-form-item>
          </div>
          <div class="item">
            <el-form-item label="班级">
              <el-input
                v-model="form.class"
                placeholder="请输入班级"
                :prefix-icon="UserFilled"
                size="large"
                disabled
              />
            </el-form-item>
          </div>
        </div>
        <div v-if="form.role === 'teacher'">
          <div class="item">
            <div class="tilte">
              <span>教师主页</span>
            </div>
          </div>
          <div class="item">
            <el-form-item label="姓名">
              <el-input
                v-model="form.username"
                placeholder="请输入姓名"
                :prefix-icon="UserFilled"
                size="large"
                disabled
              />
            </el-form-item>
          </div>
        </div>
        <div v-if="form.role">
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            @click="handleLogout"
            >登出账号</el-button
          >
          <el-button
            type="primary"
            size="large"
            style="margin: 20px 0"
            :loading="loading"
            @click="handleShowJoinClass"
            >加入其他班级</el-button
          >
          <el-card v-if="showJoinClass" class="join-class-card">
            <div class="item">
              <el-form-item label="年级">
                <el-input
                  v-model="join.grade"
                  placeholder="请输入年级"
                  :prefix-icon="UserFilled"
                  size="large"
                />
              </el-form-item>
            </div>
            <div class="item">
              <el-form-item label="班级">
                <el-input
                  v-model="join.class"
                  placeholder="请输入班级"
                  :prefix-icon="UserFilled"
                  size="large"
                />
              </el-form-item>
            </div>
            <el-button
              type="primary"
              size="large"
              style="margin: 20px 0"
              :loading="loading"
              @click="handleJoinClass"
              >确认加入</el-button
            >
          </el-card>
        </div>
      </el-card>
    </div>
  </div>
</template>

<script setup>
/* eslint-disable */
import pinia from "@/store";
import { onMounted, onUnmounted, reactive, ref } from "vue";
import { useUserStore } from "@/store/modules/user";
import axios from "@/api/index.js";
import { router } from "@/router";

const loading = ref(false);
const showJoinClass = ref(false);

const userStore = useUserStore(pinia);
var form = reactive({
  username: "",
  role: "",
  phone: "",
  class: "",
  grade: "",
  email: "",
});
var join = reactive({
  grade: "",
  class:"",
})

function handleLogout() {
  userStore.resetUserInfo();
  router.push("/login");
}

function handleShowJoinClass() {
  showJoinClass.value = true;
}

function handleJoinClass(){

}

onMounted(() => {
  form.username = userStore.getUserInfo().username;
  form.role = userStore.getUserInfo().role;
  form.phone = userStore.getUserInfo().phone;
  form.class = userStore.getUserInfo().class;
  form.grade = userStore.getUserInfo().grade;
  form.email = userStore.getUserInfo().email;
  console.log(form.role);
});
</script>
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
    width: 1200px;
    height: 800px;
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
  .join-class-card {
    height: 250px;
    width: 100%;
  }
}
</style>
