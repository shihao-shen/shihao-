import { defineUserConfig } from "vuepress";
import { searchProPlugin } from "vuepress-plugin-search-pro";

import { registerComponentsPlugin } from "@vuepress/plugin-register-components";
import { getDirname, path } from "@vuepress/utils";
import theme from "./theme.js";

const __dirname = getDirname(import.meta.url);

//自定义用户配置
export default defineUserConfig({
  base: "/",
  head:[
    // ['script', {src: "/js/aes.js"}]
  ],
  // 多语言设置
  locales: {
    "/": {
      lang: "zh-CN", 
      title: "shihao.icu",
      description: "shihao.icu",
    head: [["link", { rel: "icon", href: "/favicon.svg" }]],
    },
  },
  // 主题设置
  theme,
  plugins: [
    // 注册全局组件的插件
    registerComponentsPlugin({
      componentsDir: path.resolve(__dirname, "./components"),
    }),
    // 搜索插件
    searchProPlugin({
      // 索引全部内容
      indexContent: false,
      // 为分类和标签添加索引
      customFields: [
      ],
    }),
    
  ],

  shouldPrefetch: false,
});
