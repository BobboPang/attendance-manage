/* eslint-disable */
import { defineStore } from "pinia";
// import { getUserByUserName } from '@/api/system/user'
export const useUserStore = defineStore("userStore", {
  state: () => {
    return {
      user: {
        id: "",
        userId: "",
        username: "",
        phone: "",
        avatar: "",
        email: "",
        role: "",
      },
    };
  },
  getters: {
    userInfo() {
      return this.user;
    },
  },
  actions: {
    getUserInfo() {
      return this.user;
    },
    setUserInfo(params) {
      this.user = params;
    },
    resetUserInfo() {
      this.user = {
        id: "",
        userId: "",
        username: "",
        phone: "",
        avatar: "",
        email: "",
        role: "",
      };
    },
  },
  persist: {
    enabled: true, // 默认会以模块id为key，存储当前模块所有的状态；路由跳转会刷新掉store，尽量放在路由刷新后存储。
  },
});
