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
          <!-- <div class="item">
            <el-form-item label="年级">
              <el-input
                v-model="form.grade"
                placeholder="请输入年级"
                :prefix-icon="UserFilled"
                size="large"
                disabled
              />
            </el-form-item>
          </div> -->
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
          <div class="item">
            <el-form-item label="带班级">
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
            v-if="form.role === 'student'"
            @click="handleShowJoinClass"
            >{{ form.class ? "加入其他班级" : "加入新班级" }}</el-button
          >
          <el-button
            type="primary"
            size="large"
            style="margin: 20px 0"
            :loading="loading"
            v-if="form.role === 'teacher'"
            @click="handleShowJoinClass"
            >创建班级</el-button
          >
          <el-card v-if="showJoinClass" class="join-class-card">
            <!-- <div class="item">
              <el-form-item label="年级">
                <el-input
                  v-model="join.grade"
                  placeholder="请输入年级"
                  :prefix-icon="UserFilled"
                  size="large"
                />
              </el-form-item>
            </div> -->
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
              >{{
                form.role === "student" ? "确认加入班级" : "确认创建班级"
              }}</el-button
            >
          </el-card>
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

<script setup>
/* eslint-disable */
import pinia from "@/store";
import { onMounted, computed, reactive, ref, toRefs } from "vue";
import { useUserStore } from "@/store/modules/user";
import axios from "@/api/index.js";
import { router } from "@/router";

const loading = ref(false);
const showJoinClass = ref(false);
var dialogVisible = ref(false);
var tipsContent=ref("");
var tipsTitle=ref("");
const userStore = useUserStore(pinia);
var form = reactive({
  username: computed(() => userStore.getUserInfo().username),
  role: computed(() => userStore.getUserInfo().role),
  class: computed(() => userStore.getUserInfo().class),
});
var join = reactive({
  class: "",
})

function handleLogout() {
  userStore.resetUserInfo();
  router.push("/login");
}

function handleShowJoinClass() {
  showJoinClass.value = true;
}

function handleJoinClass() {
  if (form.role === 'student') {
    if (form.class) {
      axios.post(
        "/updateClass",
        { ...form, class: join.class },
        (values) => {
          console.log(values);
          tipsTitle="更新班级";
          tipsContent = values.status === 200 ? `${values.data.username}成功加入${values.data.class}班`:`${values.data.msg}`
          dialogVisible.value=true;
          // userStore.setUserInfo(values.data);
          getUser()
          // router.push("/home");
        },
        (values) => {
          ElMessage.error("请求失败！原因：", values);
        }
      );
    } else {

      axios.post(
        "/joinClass",
        { ...form, class: join.class },
        (values) => {
          console.log(values);
          tipsTitle="加入班级";
          tipsContent = values.status === 200 ? `${values.data.username}成功加入${values.data.class}班`:`${values.data.msg}`
          dialogVisible.value=true;
          getUser()
          // router.push("/home");
        },
        (values) => {
          ElMessage.error("请求失败！原因：", values);
        }
      );
    }
  } else {
    axios.post(
      "/createClass",
      { ...form, class: join.class },
      (values) => {
        console.log(values);
        // userStore.setUserInfo(values.data);
        getUser()
      },
      (values) => {
        ElMessage.error("请求失败！原因：", values);
      }
    );
  }
}

function getUser() {
  console.log(form)
  axios.post(
    "/getUserInfo",
    {
      username: form.username,
      role: form.role,
      class: form.class,
    },
    (values) => {
      console.log(values);
      if (values.data)
        userStore.setUserInfo(values.data[0]);
    },
    (values) => {
      ElMessage.error("请求失败！原因：", values);
    }
  );
}

onMounted(() => {
  // form.username = userStore.getUserInfo().username;
  // form.role = userStore.getUserInfo().role;
  // form.class = userStore.getUserInfo().class;
  // if(!userStore.getUserInfo().username)  
  getUser();
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
