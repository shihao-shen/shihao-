---
# 当前页面内容标题
title: iptables的结构
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
order: 2
date: 2023-02-13
# 浏览量
pageview: true
---

## 简单介绍

iptables 是由表（tables）组成，表（tables）再由链组成，所以在写iptables的命令时，需要先指定表，然后再指定链。

![三表五链](/iptables/9ddgnzua1k.png)

图片来源：[iptables系列教程](https://cloud.tencent.com/developer/article/1632776#:~:text=1%E3%80%81%E4%BB%80%E4%B9%88%E6%98%AFiptables%EF%BC%9F.%20iptables%20%E6%98%AF%20Linux%20%E9%98%B2%E7%81%AB%E5%A2%99%E5%B7%A5%E4%BD%9C%E5%9C%A8%E7%94%A8%E6%88%B7%E7%A9%BA%E9%97%B4%E7%9A%84%E7%AE%A1%E7%90%86%E5%B7%A5%E5%85%B7%EF%BC%8C%E6%98%AF%20netfilter%2Fiptables,IP%20%E4%BF%A1%E6%81%AF%E5%8C%85%E8%BF%87%E6%BB%A4%E7%B3%BB%E7%BB%9F%E6%98%AF%E4%B8%80%E9%83%A8%E5%88%86%EF%BC%8C%E7%94%A8%E6%9D%A5%E8%AE%BE%E7%BD%AE%E3%80%81%E7%BB%B4%E6%8A%A4%E5%92%8C%E6%A3%80%E6%9F%A5%20Linux%20%E5%86%85%E6%A0%B8%E7%9A%84%20IP%20%E6%95%B0%E6%8D%AE%E5%8C%85%E8%BF%87%E6%BB%A4%E8%A7%84%E5%88%99%E3%80%82.)

::: tip
三表五链并不是说只有三个表，只是说常用的三个表，你也可以说是四表或五表。
:::

## 基本格式

```sh
iptables [-t table] comment [chain] CRETIRIA -j Action
```

:::tabs

@tab table

`filter` 默认表，主要负责对数据包的过滤

`nat` 负责实现网络地址和端口转换

`mangle` 负责对数据包进行拆分、修改、封装

@tab comment          

- `-A:` 添加防火墙规则           
- `-D:` 删除防火墙规则           
- `-I:` 插入防火墙规则           
- `-F:` 清空防火墙规则           
- `-L:` 列出防火墙规则           
- `-R:` 替换防火墙规则           
- `-Z:` 清空防火墙数据表统计信息 
- `-P:` 设置链默认规则           

@tab chain

- `input` 入站规则

- `output` 出战规则

- `forward` 转发规则

- `prerouting` 目标地址转换规则，用来做 DNAT

- `postrouting` 源地址转换规则，用来做 SNAT

@tab CRETIRIA

- `[!]-p:`           匹配协议，! 表示取反                          
- `[!]-s:`           匹配源地址                                    
- `[!]-d:`           匹配目标地址                                  
- `[!]-i:`           匹配入站网卡接口                              
- `[!]-o:`           匹配出站网卡接口                              
- `[!]--sport:`      匹配源端口                                    
- `[!]--dport:`      匹配目标端口                                  
- `[!]--src-range:`  匹配源地址范围                                
- `[!]--dst-range:`  匹配目标地址范围                              
- `[!]--limit:`      四配数据表速率                                
- `[!]--mac-source:` 匹配源MAC地址                                 
- `[!]--sports:`     匹配源端口                                    
- `[!]--dports:`     匹配目标端口                                  
- `[!]--stste:`      匹配状态（INVALID、ESTABLISHED、NEW、RELATED) 
- `[!]--string:`     匹配应用层字串                                

@tab ACTION
                 
- `ACCEPT:`      允许数据包通过               
- `DROP:`        丢弃数据包                   
- `REJECT:`      拒绝数据包通过               
- `LOG:`         将数据包信息记录 syslog 曰志 
- `DNAT:`        目标地址转换                 
- `SNAT:`        源地址转换                   
- `MASQUERADE:`  地址欺骗                     
- `REDIRECT:`    重定向                       

:::

**参考链接：**

1. [iptables系列教程](https://cloud.tencent.com/developer/article/1632776#:~:text=1%E3%80%81%E4%BB%80%E4%B9%88%E6%98%AFiptables%EF%BC%9F.%20iptables%20%E6%98%AF%20Linux%20%E9%98%B2%E7%81%AB%E5%A2%99%E5%B7%A5%E4%BD%9C%E5%9C%A8%E7%94%A8%E6%88%B7%E7%A9%BA%E9%97%B4%E7%9A%84%E7%AE%A1%E7%90%86%E5%B7%A5%E5%85%B7%EF%BC%8C%E6%98%AF%20netfilter%2Fiptables,IP%20%E4%BF%A1%E6%81%AF%E5%8C%85%E8%BF%87%E6%BB%A4%E7%B3%BB%E7%BB%9F%E6%98%AF%E4%B8%80%E9%83%A8%E5%88%86%EF%BC%8C%E7%94%A8%E6%9D%A5%E8%AE%BE%E7%BD%AE%E3%80%81%E7%BB%B4%E6%8A%A4%E5%92%8C%E6%A3%80%E6%9F%A5%20Linux%20%E5%86%85%E6%A0%B8%E7%9A%84%20IP%20%E6%95%B0%E6%8D%AE%E5%8C%85%E8%BF%87%E6%BB%A4%E8%A7%84%E5%88%99%E3%80%82.) 
2. [Linux iptables命令详解](https://blog.csdn.net/daocaokafei/article/details/115091313)