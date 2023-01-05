---
# 当前页面内容标题
title: Wireshark
# sidebar: heading
# 当前页面图标
icon: note
# 分类
category:
    - 流量分析软件
sticky: false
# 是否收藏在博客主题的文章列表中，当填入数字时，数字越大，排名越靠前。
star: false
# 是否将该文章添加至文章列表中
article: true
# 是否将该文章添加至时间线中
timeline: true
# sidebar: heading
order: 1
date: 2023-01-05
# 浏览量
pageview: true
---

# 📖 什么是 Wireshark ？

Wireshark是一款网络封包分析软件，它能够抓取网络上的数据包，并对数据包进行详细的分析。Wireshark可以帮助用户诊断网络问题，安全性问题，或者研究网络通信协议的工作原理。Wireshark可以运行在多种操作系统上，包括Windows、Linux、MacOS等。

[Wireshark · 下载页面](https://www.wireshark.org/download.html)

[Wireshark · 官方文档](https://www.wireshark.org/docs/)

## 📑 过滤器

Wireshark 有两种过滤器：**显示过滤器** 和 **捕获过滤器**。

- **显示过滤器** 用于过滤已捕获的数据包，只显示满足过滤条件的数据包。
- **捕获过滤器** 用于在捕获数据包时过滤数据包，在捕获时只捕获满足过滤条件的数据包。

捕获过滤器和显示过滤器的语法是不一样的。在捕获过滤器中，不能使用指定的应用层协议来过滤流量包，因为在捕获流量的时候，应用层协议还没有被解析出来。在捕获过滤器中，可以使用协议类型、IP地址、端口号、帧长度等信息来过滤流量包。

### 📑 基本语法

捕获过滤器的基本语法：

- 过滤网卡接口名称: "eth0"
- 过滤网络层协议: "ip"
- 过滤协议类型: "tcp"
- 过滤源IP地址: "src host 192.168.1.1"
- 过滤目的IP地址: "dst host 192.168.1.2"
- 过滤源端口: "src port 80"
- 过滤目的端口: "dst port 80"

显示过滤器的基本语法：

- `expression`：表示一个简单的表达式，如`ip.src==10.0.0.1`
- `!expression`：表示一个否定的表达式，如`!ip.src==10.0.0.1`
- `expression1 && expression2`：表示两个表达式同时为真的情况，如`ip.src==10.0.0.1 && ip.dst==10.0.0.2`
- `expression1 || expression2`：表示两个表达式至少有一个为真的情况，如`ip.src==10.0.0.1 || ip.dst==10.0.0.2`
- `(expression)`：表示一个子表达式，如`(ip.src==10.0.0.1 || ip.dst==10.0.0.2) && tcp.port==80`

协议字段：

- `protocol.field`：表示协议的某个字段，如`ip.src`表示IP协议的源地址字段
- `protocol.field==value`：表示协议字段等于某个值，如`ip.src==10.0.0.1`表示IP协议的源地址等于10.0.0.1
- `protocol.field!=value`：表示协议字段不等于某个值，如`ip.src!=10.0.0.1`表示IP协议的源地址不等于10.0.0.1
- `protocol.field>value`：表示协议字段大于某个值，如`tcp.port>1024`表示TCP协议的端口号大于1024
- `protocol.field<value`：表示协议字段小于某个值，如`tcp.port<1024`表示TCP协议的端口号小于1024

## 📑 解密HTTPS

**Wireshark** 解密**HTTPS**有两种方法，一种是基于密钥，一种是基于**Google**浏览器的**sslkeylogfile**日志文件

这里主要介绍如何通过**sslkeylogfile**来解密**HTTPS**，但是使用这个方法我只知道对Google和火狐浏览器有效

首先创建环境变量，右键此电脑>高级系统设置>环境变量>系统变量下点击新建

![创建环境变量](/blog_img/hjbl.png)

新建后点击确定保存

打开**Wireshark**，`ctrl+shift+p`进入首选项，点击**protocol**，并找到**TLS**，设置log filename路径，和**SSLKEYLOGFIEL**环境变量的路径一致，然后确定

![](/blog_img/tlsbj.png)

使用**Google**浏览网页，查看**sslkeylogfile**目录下的日志文件是否被写入数据

重启**Wireshark**，健康流量，查看HTTPS是否被解密

![](/blog_img/jmhttps.png)