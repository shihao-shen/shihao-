---
# 当前页面内容标题
title: SQL注入
# sidebar: heading
# 当前页面图标
icon: note
# 分类
category:
    - WEB安全
tag:
    - SQL注入
sticky: false
# 是否收藏在博客主题的文章列表中，当填入数字时，数字越大，排名越靠前。
star: false
# 是否将该文章添加至文章列表中
article: true
# 是否将该文章添加至时间线中
timeline: true
# sidebar: heading
order: 1
date: 2022-02-08
# 浏览量
pageview: true
---

## 漏洞描述

SQL注入是一种常见的网络攻击，其通过向Web应用程序的SQL查询中插入恶意代码来破坏数据库。当Web应用程序不正确地过滤用户输入时，很容易受到SQL注入攻击。

SQL注入攻击可以分为以下几种类型：

1. 数字型SQL注入：这种注入技巧通过向数字字段输入恶意代码来攻击数据库。
2. 字符型SQL注入：这种注入技巧通过向字符字段输入恶意代码来攻击数据库。
3. UNION查询SQL注入：这种注入技巧通过使用UNION关键字来合并两个不同的查询结果。
4. Blind SQL注入：这种注入技巧通过不直接显示查询结果来攻击数据库。
5. Time-based SQL注入：这种注入技巧通过监视SQL语句的执行时间来攻击数据库。
6. Error-based SQL注入：这种注入技巧通过使用数据库错误消息来攻击数据库。

下面是各个数据库的sql备忘录链接：

[SQL injection cheat sheet | Web Security Academy (portswigger.net)](https://portswigger.net/web-security/sql-injection/cheat-sheet)

## 漏洞原理

SQL注入漏洞的原理是Web应用程序在构建SQL查询时，不正确地过滤用户输入。这导致了攻击者可以插入恶意的SQL代码，并通过Web应用程序执行这些代码来破坏数据库。

比如，如果Web应用程序的代码在构建SQL查询时直接将用户输入的数据作为查询的一部分，那么攻击者可以通过插入恶意代码来破坏数据库。比如，如果查询语句是：

```sql
SELECT * FROM users WHERE username = '$username' AND password = '$password';
```

如果攻击者在输入的用户名字段中插入如下代码：

```
' OR '1'='1
```

那么构建的查询语句将是：

```sql
SELECT * FROM users WHERE username = '' OR '1'='1' AND password = '$password';
```

这将导致查询返回整个用户表，因为该语句是始终为真的。

为了防止SQL注入漏洞，Web应用程序必须正确地过滤用户输入，并使用参数化查询或预处理语句来防止SQL注入。

## 实现案例

以下是一个简单的SQL注入的漏洞PHP代码示例：

```php
<?php

$conn = mysqli_connect("localhost", "root", "123456", "mysql");

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$username = $_GET['username'];
$sql = "SELECT * FROM user WHERE user = '$username'";

echo "SQL语句：".$sql;
if ($result = mysqli_query($conn, $sql)) {
    while($row = mysqli_fetch_assoc($result)) {
		print_r("<br>password: ". $row['authentication_string']);

    }
} else {
    echo "<br>No results found";
}

mysqli_close($conn);
?>
```

正常查询：

```
http://127.0.0.1/test.php?username=root
```

![image-20230208143210532](/SQL%E6%B3%A8%E5%85%A5/image-20230208143210532.png)

如果攻击者输入如下URL：

```
http://127.0.0.1/test.php?username=root' OR '1'='1
```

![image-20230208143244901](/SQL%E6%B3%A8%E5%85%A5/image-20230208143244901.png)

这将导致查询返回整个用户表。

## 如何防护

为了防止SQL注入，应用程序必须正确地过滤用户输入，并使用参数化查询：

```php
<?php

$conn = mysqli_connect("localhost", "root", "123456", "mysql");

if (!$conn) {
    die("Connection failed: " . mysqli_connect_error());
}

$username = $_GET['username'];
$sql = "SELECT * FROM user WHERE user = ?";
$stmt = mysqli_prepare($conn, $sql);
mysqli_stmt_bind_param($stmt, "s", $username);
echo "SQL语句：".$sql;
if (mysqli_stmt_execute($stmt)) {
	$result = mysqli_stmt_get_result($stmt);
    while($row = mysqli_fetch_assoc($result)) {
		print_r("<br>password: ". $row['authentication_string']);

    }
} else {
    echo "<br>No results found";
}

mysqli_close($conn);
?>
```

![image-20230208143927099](/SQL%E6%B3%A8%E5%85%A5/image-20230208143927099.png)

这种方法会将变量作为占位符而不是直接嵌入SQL语句中。因此，即使攻击者输入恶意代码，也不会影响SQL语句的执行。
