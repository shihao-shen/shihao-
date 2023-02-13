---
# 当前页面内容标题
title: iptables目的地址转换
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
order: 5
date: 2023-02-13
# 浏览量
pageview: true
---

场景介绍：现在有内网服务器和代理服务器各一台，内网服务器提供web服务，但是外网无法直接访问，需要代理服务器对服务器的web服务进行流量转发，也就是源地址转换。

要求：当外网主机访问代理服务器的80端口时，可以访问到内网服务器的web服务

![环境](/iptables/iptables目地址转换.png)

开放80端口
```sh
iptables -A INPUT -p tcp -m tcp --dport 80 -j ACCEPT
```
::: info
iptables默认是拒绝所有，所以在转发前要保证80端口是开启状态
:::

设置目的地址转换

```sh
iptables -t nat -I PREROUTING -d 192.168.79.128 -p tcp --dport 80 -j DNAT --to 172.23.0.2
```

访问
```uri
http://192.168.79.128/phpinfo.php
```
![效果](/iptables/Snipaste_2023-02-13_17-07-44.png)