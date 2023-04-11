// import layout from "../layout/index.vue";
import { createRouter, createWebHashHistory } from "vue-router";
export const router = createRouter({
  history: createWebHashHistory(),
  routes: [
    {
      path: "/home",
      name: "fist",
      redirect: "/home",
      children: [
        {
          path: "/home",
          name: "home",
          component: () => import("@/views/HomeView.vue"),
        },
      ],
    },
    {
      path: "/login",
      name: "Login",
      component: () => import("@/views/login/index.vue"),
    },
    {
      path: "/register",
      name: "Register",
      component: () => import("@/views/register.vue"),
    },
    {
      path: "/attendance",
      name: "Attendance",
      component: () => import("@/views/attendance.vue"),
    },
    {
      path: "/add",
      name: "AddStudent",
      component: () => import("@/views/addUser.vue"),
    },
    {
      path: "/statisticInfo",
      name: "StatisticInfo",
      component: () => import("@/views/statisticInfo.vue"),
    },
    // {
    //   path: "/personalInfo",
    //   name: "PersonalInfo",
    //   // component: layout,
    //   redirect: "/personalInfo/index",
    //   children: [
    //     {
    //       path: "/personalInfo/index",
    //       name: "PersonalInfoIndex",
    //       component: () => import("../views/personalInfo/index.vue"),
    //     },
    //   ],
    // },
    // {
    //   path: "/changePassword",
    //   name: "ChangePassword",
    //   // component: layout,
    //   redirect: "/changePassword/index",
    //   children: [
    //     {
    //       path: "/changePassword/index",
    //       name: "ChangePasswordIndex",
    //       component: () => import("../views/changePassword/index.vue"),
    //     },
    //   ],
    // },
    // {
    //   path: "/:catchAll(.*)",
    //   component: () => import("@/pages/404/index.vue"),
    // },
  ],
});
