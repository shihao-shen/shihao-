---
# 当前页面内容标题
title: iptables源地址转换
# sidebar: heading
# 当前页面图标
icon: note
# 分类
category:
    - 防火墙
tabs: 
    - iptables
sticky: false
# 是否收藏在博客主题的文章列表中，当填入数字时，数字越大，排名越靠前。
star: false
# 是否将该文章添加至文章列表中
article: true
# 是否将该文章添加至时间线中
timeline: true
# sidebar: heading
order: 4
date: 2023-02-13
# 浏览量
pageview: true
---

场景介绍：下图是一个简单的网络拓扑结构，这里分为内网和外网，当内网主机需要访问外网时，就必须通过出口服务器

要求：出口服务器配置源地址转换

![image-20220718230805421](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/iptables源地址转换.drawio.png)

## 配置centos7-1

- 为centos7-2添加一个默认路由

  ```sh
  [root@localhost ~]@ ip route add 0.0.0.0/0 via 192.168.100.130
  ```

## 配置Ubuntu

- 允许Ubuntu转发数据

  ```sh
  root@ubuntu:/home/shihao@ echo net.ipv4.ip_forward = 1 >> /etc/sysctl.conf
  ```

- 配置SNAT

  ```sh
  root@ubuntu:/home/shihao@ iptables -t nat -A POSTROUTING -s 192.168.100.0/24 -o ens33 -j SNAT --to-source 192.168.107.132
  # -A POSTROUTING 在链表POSTROUTING的规则后添加一个规则
  # -s 192.168.100.0/24 源地址
  # -o ens33 指定网卡
  # -j SNAT target
  # --to-source 192.168.107.132 将源地址为192.168.100.0/24转化为192.168.107.132 
  ```

## 测试

```sh
ping centos7-
```

![环境](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220718230805421.png)