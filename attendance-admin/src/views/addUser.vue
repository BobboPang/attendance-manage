<template>
  <div class="login-box">
    <div class="form">
      <el-card shadow="always">
        <div class="item">
          <div class="tilte">
            <span>{{ title }}</span>
          </div>
        </div>
        <img src="/video_feed" />
        <div class="item">
          <el-input
            v-model="form.username"
            placeholder="新增学生的姓名"
            :prefix-icon="UserFilled"
            size="large"
          />
        </div>
        <div class="item">
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            @click="handleLogin"
            >确认新增</el-button
          >
        </div>
      </el-card>
    </div>
  </div>
</template>
<script setup>
/* eslint-disable */
import { UserFilled, Lock } from "@element-plus/icons-vue";
import { onMounted, onUnmounted, reactive, ref } from "vue";
import { router } from "@/router";
import pinia from "@/store";
// import { LoginParams } from '@/types/auth'
import { useUserStore } from "@/store/modules/user";
/**
 * 属性
 */
const title = ref("新增学生");
const userStore = useUserStore(pinia);
const loading = ref(false);
const form = reactive({
  username: "",
  password: "",
});
/**
 * 函数
 */
const handleLogin = async () => {
  loading.value = true;
  try {
    // await loginStore.login(form)
    // const user = await userStore.getUserInfo(loginStore.userName)
    // const { id } = user
    // await userStore.getPermission(id.toString())
    router.push("/");
  } catch (error) {
    console.log("login error", error);
  } finally {
    loading.value = false;
  }
};
const handleAddStudent = () =>{
  router.push("/add");
}
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
}
</style>
