---
# 当前页面内容标题
title: 敏感信息泄露
# 当前页面图标
icon: "hot"
# 分类
sticky: false
# 是否收藏在博客主题的文章列表中，当填入数字时，数字越大，排名越靠前。
star: false
# 是否将该文章添加至文章列表中
article: false
# 是否将该文章添加至时间线中
timeline: false
index: false
date: 2022-02-08
dir:
    link: true
---

### 漏洞描述

什么是信息泄露漏洞？信息泄露漏洞是指客户端在未获得授权的情况下，通过某种手段（目录扫描、查看网页源码等），访问并下载了网站内未公开的重要文件（配置文件、日志文件、备份文件等）

## 漏洞利用

使用御剑进行扫描

![image-20230209210527017](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20230209210527017.png)

### 修复建议 

从网站目录中删除泄露信息的相关文件
