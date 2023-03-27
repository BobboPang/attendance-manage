<template>
  <div class="main">
    <div class="left"></div>
    <nav>
      <router-link to="/home">主页</router-link> |
      <router-link to="/attendance">考勤</router-link>
    </nav>
    <div class="right">
      你好，{{ role ? username : ""
      }}<router-link to="/login" v-if="!role">请登陆</router-link>
    </div>
  </div>
  <router-view />
</template>
<script setup>
/* eslint-disable */
import pinia from "@/store";
import { computed, unref } from "vue";
import { useUserStore } from "@/store/modules/user";
const userStore = useUserStore(pinia);
const username = userStore.getUserInfo().username;
const role = computed(() => userStore.getUserInfo().role);
</script>
<style lang="less">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
.main {
  display: flex;
  justify-content: space-between;
}

nav {
  padding: 30px;

  a {
    font-weight: bold;
    color: #2c3e50;

    &.router-link-exact-active {
      color: #42b983;
    }
  }
}
</style>
