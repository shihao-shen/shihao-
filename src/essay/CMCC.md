---
# 当前页面内容标题
title: CMCC入侵排查
# sidebar: heading
# 当前页面图标
icon: note
# 分类
category:
    - 日常
tabs: 
    - 靶场练习
    - 入侵排查
sticky: false
# 是否收藏在博客主题的文章列表中，当填入数字时，数字越大，排名越靠前。
star: false
# 是否将该文章添加至文章列表中
article: true
# 是否将该文章添加至时间线中
timeline: true
# sidebar: heading
date: 2023-02-16
# 浏览量
pageview: true
---
# CMCC入侵排查

## 一、项目概述

### 1.1 评估范围

主机：192.168.235.154

系统：ubuntu

## 二、入侵检测

### 2.1 历史命令检测

没有历史记录

```sh
root@7fe96420fc56:~# history 
    1  history 
```

### 2.2 用户账号分析

发现backdoor的UID为0

![image-20221112111402848](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221112111402848.png)



### 2.3 检测异常端口和异常

首先查看CPU占用率过高的进程

**`ps aux`**

![image-20221111170205144](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221111170205144.png)

**`top`**

![image-20221111170227091](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221111170227091.png)

使用`ps`和`top`，均没有发现CPU占用率过高的进程

使用`netstat -anplt | more`，在这里发现本机正在连接外网的一个IP（123.251.166.100），从`State`为`SYN_SENT`可以看出，本机未连接成功，且一直存在，说明有进程在一直请求连接。

![image-20221111170503193](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221111170503193.png)

通过`netstat`可以看到，这两个连接的进程分别是74和61，名字为`trojan`，百度搜索发现trojan是一个用来将通信流量伪装成互联网上最常见的https流量，起到防止流量被检测和干扰的工具

项目位置：[https://github.com/trojan-gfw/trojan](https://github.com/trojan-gfw/trojan)

获取进程路径

```sh
root@81392bf48bf9:/# ll /proc/74
```

`cwd`：进程运行目录

`exe`：执行程序的绝对路径

![image-20221111171918744](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221111171918744.png)

查看`/usr/share/trojan/trojan*`文件内容，都是二进制，只能看到一个23.251.166.100的ip地址和debian的版本

![image-20221111174009909](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221111174009909.png)

### 2.4 检测系统服务

![image-20221111174353505](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221111174353505.png)

查看`/etc/systemd/system`下的服务，没有发现可疑的服务

![image-20221112101518350](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221112101518350.png)

### 2.5 检测网站根目录

进入`/var/www/html`，在这里发现一个一句话木马文件

![image-20221112093029006](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221112093029006.png)

### 2.6 检测日志文件

![image-20221112102010827](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221112102010827.png)

这些日志文件中，并没有攻击者的连接记录

![image-20221112102154586](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221112102154586.png)

### 2.7 检测开机启动项

```sh
cat /etc/rc.local
```

![image-20221112113220588](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221112113220588.png)

**nohup**： 英文全称 no hang up（不挂起），用于在系统后台不挂断地运行命令，退出终端不会影响程序的运行。

nohup后台运行trojan，并将回显丢弃

### 2.8 检查redis

进入redis控制台，没有设置密码

![image-20221112114041208](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221112114041208.png)

使用RESP连接

![image-20221112114137682](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221112114137682-1668224498330-1.png)

没有任何键值

### 2.9 分析排除结果

apache日志被清空，网站根目录存在一句话木马，且`ping.php`存在命令注入漏洞！检查端口和进程发现`trojan`反弹shell木马，且开机自启动。通过进程可以发现连接的IP为123.251.166.100，端口为8000，为国外加拿大的IP，后面检查用户权限发现，发现backdoor的UID为0，拥有root权限。

因为使用一句话木马连接的服务器，所以用户应该是www-data，所以需要提权，但是未发现提权脚本

![image-20221112142937531](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221112142937531.png)

排查过程中发现，服务器存在命令注入漏洞，redis无密码的漏洞。	



## 三、服务器安全加固

### 3.1 木马清除

请求一句话木马

![image-20221112143757007](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221112143757007.png)

清除反弹shell木马

![image-20221112143903252](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221112143903252.png)

关闭木马进程

```sh
root@81392bf48bf9:/etc/cron.d# kill 74
root@81392bf48bf9:/etc/cron.d# kill 61
```

清除定时任务

```sh
root@7fe96420fc56:/var/www/html# vim /etc/rc.local
```

![image-20221112144209398](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221112144209398.png)

### 3.2 用户管理

禁止backdoor登录

```sh
root@7fe96420fc56:/var/www/html# usermod --shell /bin/nologin backdoor
```

升级root密码复杂度

![image-20221112144734435](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221112144734435.png)

设置密码策略

![image-20221112161122624](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221112161122624.png)

![image-20221112161201666](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221112161201666.png)

### 3.3 SSH安全配置

回到宿主机，进入SSH配置文件

```sh
xctf@ubuntu:~/cmcc1$ vim /etc/ssh/sshd_config
```

禁止root用户登录

![image-20221112163008293](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221112163008293.png)

屏蔽登录banner信息

![image-20221112163051946](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221112163051946.png)

使用秘钥进行 ssh 登录

![image-20221112163159144](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221112163159144.png)

### 3.4 redis安全配置

修改redis配置文件

```sh
root@7fe96420fc56:~# find / -name redis.conf
/etc/redis/redis.conf
root@7fe96420fc56:~# vim /etc/redis/redis.conf
```

设置密码

![image-20221112163504052](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221112163504052.png)

禁用或重命名危险命令

![image-20221112163708016](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221112163708016.png)

### 3.5 php安全配置

禁用高危函数，保留`shell_exec`

![image-20221112170404094](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221112170404094.png)

