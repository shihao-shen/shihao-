---
# 当前页面内容标题
title: tcpdump
# sidebar: heading
# 当前页面图标
icon: note
# 分类
category:
    - 流量分析软件
tag:
    - Tcpdump
    - Wireshark
sticky: false
# 是否收藏在博客主题的文章列表中，当填入数字时，数字越大，排名越靠前。
star: false
# 是否将该文章添加至文章列表中
article: true
# 是否将该文章添加至时间线中
timeline: true
# sidebar: heading
order: 2
date: 2023-01-05
# 浏览量
pageview: true
---

# 📖 什么是tcpdump

tcpdump是一个网络流量监控工具，能够抓取网络中的数据包并进行分析。它可以用来检测网络问题、调试协议和进行安全分析。

## 📑 安装tcpdump

在Linux系统中可以使用包管理器进行安装，如在Debian/Ubuntu中使用apt-get命令：

```sh
sudo apt-get install tcpdump
```

在CentOS/RedHat中使用yum命令：

```sh
sudo yum install tcpdump
```

## 📑 使用tcpdump

使用tcpdump时需要以root身份运行，否则会提示权限不足。

基本用法：

```js
tcpdump [options]
常用选项：

-i 指定网卡接口
-c 指定抓取的数据包数量
-w 保存抓取的数据包到文件
-r 读取保存的数据包文件
```

例如，使用网卡eth0接口抓取5个数据包并保存到文件packets.pcap中：

```sh
sudo tcpdump -i eth0 -c 5 -w packets.pcap
```

使用-r选项读取保存的数据包文件：

```sh
tcpdump -r packets.pcap
```

tcpdump还有很多高级用法，例如使用表达式进行过滤、使用脚本语言编写复杂的处理规则等。

### 📑常用过滤命令

1. `host`：过滤指定主机的流量。例如：`tcpdump host example.com`。
2. `net`：过滤指定子网的流量。例如：`tcpdump net 10.0.0.0/8`。
3. `port`：过滤指定端口的流量。例如：`tcpdump port 80`。
4. `src`：过滤源地址为指定地址的流量。例如：`tcpdump src 192.168.0.1`。
5. `dst`：过滤目的地址为指定地址的流量。例如：`tcpdump dst 192.168.0.1`。
6. `src and dst`：过滤源地址和目的地址均为指定地址的流量。例如：`tcpdump src 192.168.0.1 and dst 192.168.0.2`。
7. `src or dst`：过滤源地址或目的地址为指定地址的流量。例如：`tcpdump src 192.168.0.1 or dst 192.168.0.2`。
8. `greater`：过滤大于指定字节数的流量。例如：`tcpdump greater 1000`。
9. `less`：过滤小于指定字节数的流量。例如：`tcpdump less 1000`。
10. `and not`：过滤不符合条件的流量。例如：`tcpdump src 192.168.0.1 and not dst 192.168.0.2`。