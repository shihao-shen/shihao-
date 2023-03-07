---
# 当前页面内容标题
title: 熊海cms系统-渗透测试
# sidebar: heading
# 当前页面图标
icon: note
# 分类
category:
    - 日常
tag:
    - 渗透测试
    - cms
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
# 一、 项目概述

## 1.1 评估范围

| **项目**     |                           **内容**                           | **备注** |
| ------------ | :----------------------------------------------------------: | -------- |
| 授权渗透范围 |                   http://192.168.235.1:81/                   |          |
| 授权时间     |                     2022年10月10日-24日                      |          |
| 测试机IP     |                        192.168.235.1                         |          |
| 测试方法     |                        手工+工具+白盒                        |          |
| 测试工具     | BurpSuite、kalilinux、Seay源代码审计系统、冰蝎、sqlmap、Fiddler |          |
| 注意事项     | 渗透测试前客户需备份网站所有程序及数据，<br />保证网站在渗透测试过程中被技术性破坏的情况下仍能通过备份恢复。  <br />不得在渗透测试期间提供业务服务，避免产生的新数据丢失。 |          |

## 1.2 漏洞综述

本次渗透测试共发现漏洞2个，其中严重漏洞1个，中危1个，目标总体安全评价为差。

本次测试主要漏洞列表见下。

| **序号** | **漏洞名称**        | **危害程度** |
| -------- | ------------------- | ------------ |
| 1        | SQL注入             | 严重         |
| 2        | Admin后台弱密码爆破 | 中危         |
| 3        | 评论区的SQL注入     | 严重         |
| 4        | 验证码绕过          | 高危         |

# 二、  漏洞说明

## 2.1 查看文章时的SQL注入漏洞

### 2.1.1漏洞概要

| **类目** | **内容**                                                     | **备注** |
| -------- | ------------------------------------------------------------ | -------- |
| 漏洞位置 | url: http://192.168.235.1:81/?r=content&cid=16<br />  dir: xhcms\files\content.php 第8行 |          |
| 漏洞类型 | SQL注入                                                      |          |
| 严重性   | 高危                                                         |          |
| 主要危害 | 数据库信息泄露                                               |          |
| 其他信息 |                                                              |          |

### 2.1.2漏洞详情

使用sqlmap对数据库进行扫描

![img](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/{C8053F2F-C363-476F-BD75-8402D38CBF0B})

得到两个结果，分别是报错和时间注入

![img](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/{69F1D12D-D02E-475D-880A-40D2B39B5E9F})

获取数据库名称

![img](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/clip_image002-1665984271214-10.jpg)

![image-20221017143856634](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/{D731D5A8-1C43-4187-93B4-82A045D0472A})

获取表名称

![img](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/clip_image008.jpg)

![img](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/clip_image002.jpg)

获取表信息

![img](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221017143856634.png)

![img](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/clip_image012-1665984227706-5.jpg)

获取sql-shell

![img](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/clip_image002-1665986801294-22.jpg)

### 2.1.3修复建议

造成注入的原因是没有对cid进行校验和过滤，所以只需要对输入的id进行整形转换，就可以解决这个问题

```php
$id=$_GET['cid']// 改：$id=number_format($_GET['cid']) or die("无效ID");
$query = "SELECT * FROM content WHERE id='$id'";
```

## 2.2 后台密码爆破

### 2.2.1漏洞概要

| **类目** | **内容**                                                     | **备注** |
| -------- | ------------------------------------------------------------ | -------- |
| 漏洞位置 | url：http://150.158.194.26/admin/?r=login<br />dir：xhcms\admin\files\login.php<br />第9行 |          |
| 漏洞类型 | 密码爆破                                                     |          |
| 严重性   | 中危                                                         |          |
| 主要危害 | 密码泄露，敏感信息泄露和业务管理被操控                       |          |
| 其他信息 |                                                              |          |

### 2.2.2漏洞详情

使用Burp对登录的请求进行抓包

![img](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/clip_image010.jpg)

发送到intruder，实施爆破，成功获取密码

![img](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221017143552944.png)



### 2.2.3修复建议

对用户登录次数进行限制，或使用短信、验证码、滑动验证码和邮箱来进行验证

给`/xhcms/admin/files/login.php`添加验证码

![image-20221017143552944](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/clip_image002-1665986828204-24.jpg)

开启session会话，给`/xhcms/admin/files/login.php`添加验证码验证

![image-20221017143456468](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221017143456468.png)



## 2.3 评论区的SQL注入

### 2.3.1漏洞概要

| **类目** | **内容**                                                     | **备注**  |
| -------- | ------------------------------------------------------------ | --------- |
| 漏洞位置 | http://127.0.0.1/?r=content&cid=14<br />/xhcms/file/submit.php | 第9和11行 |
| 漏洞类型 | sql注入                                                      |           |
| 严重性   | 严重                                                         |           |
| 主要危害 | 敏感信息泄露，上传XSS存储型攻击代码                          |           |
| 其他信息 |                                                              |           |

### 2.3.2漏洞详情

编辑评论信息，然后使用Burp抓包

![image-20221017170716876](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221017170716876.png)

![image-20221017170806655](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221017170806655.png)

这里面cid和tz都可以随意更改，且没有任何校验和过滤，下面是`payload`

**cid：**

```sql
14','shihao','1424741814@qq.com','','79','PC','192.168.235.1',(select group_concat(table_name) result from information_schema.TABLES),/*
```

**tz：**

```php
*/'
```

![image-20221017171905293](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221017171957053.png)

查看网页

![image-20221017171957053](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221017172225227.png)

注入XSS

![image-20221017172225227](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221017171905293.png)

![image-20221017172237932](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221017172237932.png)

### 2.3.3修复建议

应该对GET、POST和REQUEST这些从前端接收，尤其是需要存储到数据库中的值进行校验和过滤

。。。

## 2.4 验证码绕过

### 2.4.1漏洞概要

| **类目** | **内容**                                                     | **备注** |
| -------- | ------------------------------------------------------------ | -------- |
| 漏洞位置 | http://127.0.0.1/?r=content&cid=14<br />/xhcms/file/submit.php | 第15行   |
| 漏洞类型 | 验证码绕过                                                   |          |
| 严重性   | 高危                                                         |          |
| 主要危害 | 无限制发送留言                                               |          |
| 其他信息 |                                                              |          |

### 2.4.2漏洞详情

因为验证码是需要通过前端区请求`code.class.php`，来获取验证码，存储在`session`里的验证码才会更新

所以，只需要抓包，利用Burp的Intruder就可以一直发评论

![image-20221017173338773](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221017173649708.png)

设置1000的发送次数

![image-20221017173414927](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221017173414927.png)

查看表

![image-20221017173649708](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221017200549299.png)

### 2.4.3修复建议

应该在判断失败后就对验证码进行更新，而不是被动的等待请求

## 2.5 后台无密码登录

### 2.5.1漏洞概要

| **类目** | **内容**                                                     | **备注** |
| -------- | ------------------------------------------------------------ | -------- |
| 漏洞位置 | http://192.168.235.1:81/admin/?r=login<br />/xhcms/admin/files/login.php | 第10行   |
| 漏洞类型 | sql注入                                                      |          |
| 严重性   | 严重                                                         |          |
| 主要危害 | admin后台无密码登录，敏感信息泄露等                          |          |
| 其他信息 |                                                              |          |

### 2.5.2漏洞详情

没有对用户输入进行转义，导致的sql注入漏洞。

![image-20221017200549299](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221017173338773.png)

并且使用第一次搜索的结果进行密码判断

![image-20221017200747456](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221017201038167.png)

设计Payload：

```SQL
' union select 1,'admin','admin','202cb962ac59075b964b07152d234b70',5,6,7,8 limit 1#
```

`202cb962ac59075b964b07152d234b70`为123使用md5加密的结果

![image-20221017201008766](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221017201008766.png)

登录成功：

![image-20221017201038167](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221017200747456.png)

### 2.5.3修复建议

对用户输入的账号和密码进行转义，或限制输入长度

# 三、  测试总结及建议

本次渗透测试未对系统做出任何更改，上传的测试shell已删除。本次测试给出的主要综合建议如下：

1. 前端的JS应做加密混淆处理，重要信息不应暴露在JS中
2. 建议，把文件上传目录设置无脚本执行权限，uploadvideo、uploadimage、catchimage、uploadscrawl、uploadfile、等等目录都设置上无脚本权限。
3. 设置图片目录为只读，禁止写入。
4. 修改程序的源代码，对crawlerhandler源文件进行文件上传格式的严格 过滤与判断。
5. 对数据库进行严格监控
6. 对户提交数据信息严格把关，多次筛选过滤
7. 用户内数据内容进行加密
8. 代码层最佳防御sql漏洞方案：采用sql语句预编译和绑定变量，是防御 sql注入的最佳方法