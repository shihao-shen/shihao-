---
# 当前页面内容标题
title: iptables的安装
# sidebar: heading
# 当前页面图标
icon: note
# 分类
category:
    - 防火墙
tag: 
    - iptables
sticky: false
# 是否收藏在博客主题的文章列表中，当填入数字时，数字越大，排名越靠前。
star: false
# 是否将该文章添加至文章列表中
article: true
# 是否将该文章添加至时间线中
timeline: true
# sidebar: heading
order: 1
date: 2023-02-13
# 浏览量
pageview: true
---

::: tabs

@tabs Centos

## 关闭firewalld

```sh
systemctl stop firewalld 
systemctl disable firewalld 
```

## 安装iptables

```sh
yum install iptables-services -y 
```

## 启动iptables服务

```sh
systemctl start iptables 
systemctl enable iptables 
```
:::

