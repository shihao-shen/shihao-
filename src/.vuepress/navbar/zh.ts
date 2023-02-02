import { navbar } from "vuepress-theme-hope";

export const zhNavbar = navbar([
  { text: "博客主页", icon: "blog", link: "/" },
  { text: "快速导航", icon: "navigation", link: "/quicknav/" },
  { text: "学习笔记", icon: "note", link: "/learningnote/" },
  { text: "漏洞复现", icon: "code", link: "/CVE/" },
]);
