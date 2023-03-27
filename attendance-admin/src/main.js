import { createApp } from "vue";
import App from "./App.vue";
import { router } from "./router";
import store from "./store";
import ElementPlus from "element-plus";
import "element-plus/dist/index.css";
import zhCn from "element-plus/es/locale/lang/zh-cn";
import { BaiduMap } from "vue-baidu-map";

createApp(App)
  .use(BaiduMap, {
    ak: "v5Yo8D5MFgZhv2WzUY4gpNhQbaaXWwMI",
  })
  .use(store)
  .use(ElementPlus, {
    locale: zhCn,
  })
  .use(router)
  .mount("#app");
