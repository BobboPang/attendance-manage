<template>
  <div class="login-box">
    <div class="form">
      <el-card shadow="always">
        <div class="item">
          <div class="tilte">
            <span>{{ title }}</span>
          </div>
        </div>
        <img style="height: 250px" src="http://127.0.0.1:5000/video_feed" />
        <div class="item">
          <el-input
            v-model="form.username"
            :placeholder="form.username ? form.username : '请登录'"
            :prefix-icon="UserFilled"
            size="large"
            disabled
          />
        </div>
        <div class="item">
          <el-button
            type="primary"
            size="large"
            :loading="loading"
            @click="handleVerifyFace"
            >打卡</el-button
          >
        </div>
        <el-button size="small" :loading="loading" @click="handleAddface"
          >添加人脸</el-button
        >
        <router-link v-if="form.role === 'teacher'" to="/statisticInfo"
          >统计信息</router-link
        >
        <baidu-map
          class="bm-view"
          :center="center"
          :zoom="zoom"
          ak="v5Yo8D5MFgZhv2WzUY4gpNhQbaaXWwMI"
          :scroll-wheel-zoom="true"
          @ready="handler"
        >
        </baidu-map>
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
import { UserFilled, Lock } from "@element-plus/icons-vue";
import { onMounted, onUnmounted, reactive, ref, nextTick } from "vue";
import { router } from "@/router";
import pinia from "@/store";
// import { LoginParams } from '@/types/auth'import pinia from "@/store";
import { useUserStore } from "@/store/modules/user";
import BaiduMap from "vue-baidu-map/components/map/Map.vue";
import BmCityList from "vue-baidu-map/components/controls/CityList.vue";
import axios from "@/api/index.js";
/**
 * 属性
 */
const title = ref("考勤打卡");
const loading = ref(true);
const form = reactive({
  username: "",
  role: "",
});
var dialogVisible = ref(false);
var tipsContent=ref("");
var tipsTitle=ref("");
var localAddress=ref("");
const isShowAnchor = ref(false);
var BMapObj = reactive({});
var mapObj = reactive({});
var center = reactive({ lng: 109.45744048529967, lat: 36.49771311230842 });
var zoom = 15;
const userStore = useUserStore(pinia);
/**
 * 函数
 */

function handleVerifyFace(){
  
  axios.post(
      "/predict",
      {name: form.username,},
      (values) => {
        console.log(values);
        if(values.status=== '已验证通过')
          handleCheck()
        else{
          tipsTitle="打卡情况";
          tipsContent = "打卡失败，人脸验证未通过！"
          dialogVisible.value=true;
          }
      },
      (values) => {
        ElMessage.error("请求失败！原因：", values);
      },
      "pythonRoot"
    );
}

const handleCheck = async () => {
  loading.value = true;
  try {
    axios.post(
      "/check",
      {name:form.username,
        address: localAddress,
        longitude: center.lng,
        latitude: center.lat,},
      (values) => {
        console.log(values);
        tipsTitle="打卡详情";
        tipsContent = values.msg === "打卡成功!" ? `${values.data.username}打卡成功,时间：${values.data.time},地址：${values.data.address}`:"打卡失败"
        dialogVisible.value=true;
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
function handler({ BMap, map }) {
  // 保存百度地图类
  console.log("BMap:", BMap);
  console.log("map:", map);
  BMapObj = { ...BMap };
  mapObj = { ...map };
  zoom = 20;
  const geolocation = new BMap.Geolocation();
  console.log("geolocation:", geolocation);
  geolocation.getCurrentPosition((res) => {
    // IP地址赋值给locations对象
    console.log("getCurrentPosition:", res);
    center.lng = res.point.lng;
    center.lat = res.point.lat;
    isShowAnchor.value = true;
    var marker = new BMap.Marker(res.point); // 创建标注
    var circle = new BMap.Circle(res.point, 60, { strokeColor: "Red", strokeWeight: 6, strokeOpacity: 0.7, Color: "Red", fillColor: "#f03" });
    map.addOverlay(marker);
    map.addOverlay(circle);
    localAddress = res.address.province + res.address.city + res.address.district + res.address.street + res.address.street_number;
    var label = new BMap.Label(`${res.address.province + res.address.city + res.address.district + res.address.street + res.address.street_number}`, { offset: new BMap.Size(20, -10) }); //标注标签
    marker.setLabel(label); //设置标注说明
    loading.value = false;
  });
}
function clickLocation(e) {
  console.log(e);
  center.lng = e.point.lng;
  center.lat = e.point.lat;
  const BMapGL = _BMap;
  const map = _map;
  map.clearOverlays();
  const marker = new BMapGL.Marker(new BMapGL.Point(e.point.lng, e.point.lat));
  map.addOverlay(marker);
  const geoc = new BMapGL.Geocoder();
  geoc.getLocation(e.point, (rs) => {
    const addressComp = rs.addressComponents;
    console.log(addressComp);
    // this.form.setFieldsValue({
    //   detailAddress: addressComp.province + addressComp.city + addressComp.district + addressComp.street + addressComp.streetNumber,
    // });
  });
}
function handleAddface(){
  try {
    axios.post(
      "/add_face",
      {
        name: form.username,
      },
      (values) => {
        console.log(values);
        tipsTitle="添加人脸";
        tipsContent = values.success === true ? "添加人脸成功":"添加人脸失败"
        dialogVisible.value=true;
      },
      (values) => {
        ElMessage.error("请求失败！原因：", values);
      },
      "pythonRoot"
    );
  } catch (error) {
    console.log("login error", error);
  } finally {
    loading.value = false;
  }
}
onMounted(() => {
  form.username = userStore.getUserInfo().username;
  form.role = userStore.getUserInfo().role;

  // var map = new BMapGL.Map("container");
});
</script>
<style lang="less" scoped>
.bm-view {
  display: flex;
  height: 600px;
  width: auto;
  .BMap_cpyCtrl {
    display: none;
  }
  .anchorBL {
    display: none;
  }
}

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
    height: 1000px;
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
      margin-bottom: 20px;
    }
    .test {
      color: gray;
      text-align: left;
    }
  }
}
</style>
