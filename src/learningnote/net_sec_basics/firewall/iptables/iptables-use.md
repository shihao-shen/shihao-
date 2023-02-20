---
# 当前页面内容标题
title: iptables的使用
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
order: 3
date: 2023-02-13
# 浏览量
pageview: true
---

## 查看规则表

::: tabs 

@tab 查看默认表(input)
```sh
[root@localhost ~] iptables -L
Chain INPUT (policy ACCEPT)
target     prot opt source               destination         
ACCEPT     all  --  anywhere             anywhere             state RELATED,ESTABLISHED
ACCEPT     icmp --  anywhere             anywhere            
ACCEPT     all  --  anywhere             anywhere            
ACCEPT     tcp  --  anywhere             anywhere             state NEW tcp dpt:ssh
REJECT     all  --  anywhere             anywhere             reject-with icmp-host-prohibited

Chain FORWARD (policy ACCEPT)
target     prot opt source               destination         
REJECT     all  --  anywhere             anywhere             reject-with icmp-host-prohibited

Chain OUTPUT (policy ACCEPT)
target     prot opt source               destination      
```

@tab 地址和端口的数字输出
```sh
[root@localhost ~] iptables -nL
Chain INPUT (policy ACCEPT)
target     prot opt source               destination         
ACCEPT     all  --  0.0.0.0/0            0.0.0.0/0            state RELATED,ESTABLISHED
ACCEPT     icmp --  0.0.0.0/0            0.0.0.0/0           
ACCEPT     all  --  0.0.0.0/0            0.0.0.0/0           
ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0            state NEW tcp dpt:22
REJECT     all  --  0.0.0.0/0            0.0.0.0/0            reject-with icmp-host-prohibited

Chain FORWARD (policy ACCEPT)
target     prot opt source               destination         
REJECT     all  --  0.0.0.0/0            0.0.0.0/0            reject-with icmp-host-prohibited

Chain OUTPUT (policy ACCEPT)
target     prot opt source               destination 
```
@tab 查看指定表，指定链
```sh
[root@localhost ~] iptables -t filter -nL FORWARD
Chain FORWARD (policy ACCEPT)
target     prot opt source               destination         
REJECT     all  --  0.0.0.0/0            0.0.0.0/0            reject-with icmp-host-prohibited

```
:::

## 规则操作

:::tabs 
@tab 添加规则到尾部
```sh
[root@localhost ~] iptables -A INPUT -s 192.168.0.100 -j DROP
[root@localhost ~] iptables -nL INPUT
Chain INPUT (policy ACCEPT)
target     prot opt source               destination         
ACCEPT     all  --  0.0.0.0/0            0.0.0.0/0            state RELATED,ESTABLISHED
ACCEPT     icmp --  0.0.0.0/0            0.0.0.0/0           
ACCEPT     all  --  0.0.0.0/0            0.0.0.0/0           
ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0            state NEW tcp dpt:22
REJECT     all  --  0.0.0.0/0            0.0.0.0/0            reject-with icmp-host-prohibited
DROP       all  --  192.168.0.100        0.0.0.0/0
```
@tab 插入规则
```sh
[root@localhost ~] iptables -I INPUT 1 -s 192.168.1.100 -j DROP
[root@localhost ~] iptables -nL INPUT
Chain INPUT (policy ACCEPT)
target     prot opt source               destination         
DROP       all  --  192.168.1.100        0.0.0.0/0           
ACCEPT     all  --  0.0.0.0/0            0.0.0.0/0            state RELATED,ESTABLISHED
ACCEPT     icmp --  0.0.0.0/0            0.0.0.0/0           
ACCEPT     all  --  0.0.0.0/0            0.0.0.0/0           
ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0            state NEW tcp dpt:22
REJECT     all  --  0.0.0.0/0            0.0.0.0/0            reject-with icmp-host-prohibited
DROP       all  --  192.168.0.100        0.0.0.0/0           
```
@tab 修改规则 
```sh
[root@localhost ~] iptables -R INPUT 1 -s 192.168.2.100 -j ACCEPT
[root@localhost ~] iptables -nL INPUT
Chain INPUT (policy ACCEPT)
target     prot opt source               destination         
ACCEPT     all  --  192.168.2.100        0.0.0.0/0           
ACCEPT     all  --  0.0.0.0/0            0.0.0.0/0            state RELATED,ESTABLISHED
ACCEPT     icmp --  0.0.0.0/0            0.0.0.0/0           
ACCEPT     all  --  0.0.0.0/0            0.0.0.0/0           
ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0            state NEW tcp dpt:22
REJECT     all  --  0.0.0.0/0            0.0.0.0/0            reject-with icmp-host-prohibited
DROP       all  --  192.168.0.100        0.0.0.0/0    
```
@tab 删除规则
```sh
[root@localhost ~] iptables -D INPUT 1
[root@localhost ~] iptables -nL INPUT
Chain INPUT (policy ACCEPT)
target     prot opt source               destination         
ACCEPT     all  --  0.0.0.0/0            0.0.0.0/0            state RELATED,ESTABLISHED
ACCEPT     icmp --  0.0.0.0/0            0.0.0.0/0           
ACCEPT     all  --  0.0.0.0/0            0.0.0.0/0           
ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0            state NEW tcp dpt:22
REJECT     all  --  0.0.0.0/0            0.0.0.0/0            reject-with icmp-host-prohibited
DROP       all  --  192.168.0.100        0.0.0.0/0          
```
:::

## 导入和导出规则

:::tabs
@tab 导出规则列表
```sh
[root@localhost ~] iptables-save 
# Generated by iptables-save v1.4.21 on Mon Feb 13 22:01:08 2023
*nat
:PREROUTING ACCEPT [0:0]
:INPUT ACCEPT [0:0]
:OUTPUT ACCEPT [1:328]
:POSTROUTING ACCEPT [1:328]
COMMIT
# Completed on Mon Feb 13 22:01:08 2023
# Generated by iptables-save v1.4.21 on Mon Feb 13 22:01:08 2023
*filter
:INPUT ACCEPT [0:0]
:FORWARD ACCEPT [0:0]
:OUTPUT ACCEPT [217:22860]
-A INPUT -m state --state RELATED,ESTABLISHED -j ACCEPT
-A INPUT -p icmp -j ACCEPT
-A INPUT -i lo -j ACCEPT
-A INPUT -p tcp -m state --state NEW -m tcp --dport 22 -j ACCEPT
-A INPUT -j REJECT --reject-with icmp-host-prohibited
-A INPUT -s 192.168.0.100/32 -j DROP
-A FORWARD -j REJECT --reject-with icmp-host-prohibited
COMMIT
# Completed on Mon Feb 13 22:01:08 2023

```
@tab 写入规则文件
```shell
[root@localhost ~] iptables-save > /etc/sysconfig/iptables
[root@localhost ~] cat /etc/sysconfig/iptables
# Generated by iptables-save v1.4.21 on Mon Feb 13 22:01:53 2023
*nat
:PREROUTING ACCEPT [0:0]
:INPUT ACCEPT [0:0]
:OUTPUT ACCEPT [1:328]
:POSTROUTING ACCEPT [1:328]
COMMIT
# Completed on Mon Feb 13 22:01:53 2023
# Generated by iptables-save v1.4.21 on Mon Feb 13 22:01:53 2023
*filter
:INPUT ACCEPT [0:0]
:FORWARD ACCEPT [0:0]
:OUTPUT ACCEPT [262:27176]
-A INPUT -m state --state RELATED,ESTABLISHED -j ACCEPT
-A INPUT -p icmp -j ACCEPT
-A INPUT -i lo -j ACCEPT
-A INPUT -p tcp -m state --state NEW -m tcp --dport 22 -j ACCEPT
-A INPUT -j REJECT --reject-with icmp-host-prohibited
-A INPUT -s 192.168.0.100/32 -j DROP
-A FORWARD -j REJECT --reject-with icmp-host-prohibited
COMMIT
# Completed on Mon Feb 13 22:01:53 2023

```
@tab 导入规则
先删除规则：
```sh
[root@localhost ~] iptables -D INPUT 6
[root@localhost ~] iptables -nL
Chain INPUT (policy ACCEPT)
target     prot opt source               destination         
ACCEPT     all  --  0.0.0.0/0            0.0.0.0/0            state RELATED,ESTABLISHED
ACCEPT     icmp --  0.0.0.0/0            0.0.0.0/0           
ACCEPT     all  --  0.0.0.0/0            0.0.0.0/0           
ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0            state NEW tcp dpt:22
REJECT     all  --  0.0.0.0/0            0.0.0.0/0            reject-with icmp-host-prohibited
```
然后导入
```sh
[root@localhost ~] iptables-restore < /etc/sysconfig/iptables
[root@localhost ~] iptables -nL
Chain INPUT (policy ACCEPT)
target     prot opt source               destination         
ACCEPT     all  --  0.0.0.0/0            0.0.0.0/0            state RELATED,ESTABLISHED
ACCEPT     icmp --  0.0.0.0/0            0.0.0.0/0           
ACCEPT     all  --  0.0.0.0/0            0.0.0.0/0           
ACCEPT     tcp  --  0.0.0.0/0            0.0.0.0/0            state NEW tcp dpt:22
REJECT     all  --  0.0.0.0/0            0.0.0.0/0            reject-with icmp-host-prohibited
DROP       all  --  192.168.0.100        0.0.0.0/0           

```
:::
