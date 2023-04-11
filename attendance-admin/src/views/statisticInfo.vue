<template>
  <div class="login-box">
    <div class="form">
      <el-card shadow="always">
        <el-button type="primary" @click="router.back()"> 返回</el-button>
        <el-table :data="tableData" border style="width: 100%">
          <el-table-column prop="create_time" label="打卡时间" width="180" />
          <el-table-column prop="name" label="姓名" width="180" />
          <el-table-column prop="address" label="打卡地址" />
        </el-table>
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
  teacherName: computed(() => userStore.getUserInfo().username),
  role: computed(() => userStore.getUserInfo().role),
  class: computed(() => userStore.getUserInfo().class),
});
var tableData = reactive([])
function getAttendanceData(){
  if (form.class) {
      axios.post(
        "/getAttendanceData",
        { ...form },
        (values) => {
          console.log(values);
          if(values.status === 200)
            values.data.forEach((ele)=>{ tableData.push(ele)});
          console.log(tableData)
          // tipsTitle="更新班级";
          // tipsContent = values.status === 200 ? `${values.data.username}成功加入${values.data.class}班`:`${values.data.msg}`
          // dialogVisible.value=true;
          getUser()
        },
        (values) => {
          ElMessage.error("请求失败！原因：", values);
        }
      );}
}

function getClassData() {
    if (form.class) {
      axios.post(
        "/getClass",
        { ...form },
        (values) => {
          console.log(values);

          // tipsTitle="更新班级";
          // tipsContent = values.status === 200 ? `${values.data.username}成功加入${values.data.class}班`:`${values.data.msg}`
          // dialogVisible.value=true;

          getUser()

        },
        (values) => {
          ElMessage.error("请求失败！原因：", values);
        }
      );}
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
      if (values.data);
        userStore.setUserInfo(values.data[0]);
    },
    (values) => {
      ElMessage.error("请求失败！原因：", values);
    }
  );
}

onMounted(() => {
  getUser();
  getClassData();
  getAttendanceData();
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
