---
# 当前页面内容标题
title: 跨站脚本攻击（XSS）
# sidebar: heading
# 当前页面图标
icon: note
# 分类
category:
    - WEB安全
tag:
    - XSS
sticky: false
# 是否收藏在博客主题的文章列表中，当填入数字时，数字越大，排名越靠前。
star: false
# 是否将该文章添加至文章列表中
article: true
# 是否将该文章添加至时间线中
timeline: true
# sidebar: heading
order: 2
date: 2022-02-08
# 浏览量
pageview: true
---

## 漏洞描述

XSS（Cross-Site Scripting）指的是跨站脚本攻击，是一种网络安全漏洞，允许攻击者在用户的Web浏览器中执行任意代码。

攻击者通常通过植入恶意脚本代码，例如JavaScript或HTML，来攻击目标网站。这些恶意脚本代码可能包含收集用户数据（例如密码）的代码，或在网站上显示假的内容，以欺骗用户。

为了防范XSS攻击，开发人员应该对用户输入的数据进行严格的验证和过滤，并使用安全的编程技巧来防止恶意脚本代码的执行。

![image-20230208154629163](/XSS/image-20230208154629163.png)

XSS可以分为持久类型和非持久类型两种类型，也可以分为存储型、反射型和DOM三种类型

三种类型的XSS攻击都具有危害性，因此应该对其进行防范。

## 攻击原理

首先，为了演示，使用的数据库名称为：test

```sql
create database test;
```

表为：message

```sql
CREATE TABLE `test`.`message` ( `text` VARCHAR(255) NULL DEFAULT NULL ) ENGINE = MyISAM;
```

### 存储型 XSS

存储型XSS攻击通过将恶意脚本代码存储在目标网站上，例如论坛帖子或博客评论，然后当其他用户浏览相关内容时，恶意脚本代码就会在其Web浏览器中自动执行。

下面是一个有存储型XSS漏洞的代码（test.php）：

```php
<html>
<body>

<form action="./test.php" method="post">
Comment: <input name="text"></input><br>
<input type="submit" value="Submit">
</form>
<div id = "message">

</div>
<h2>Comments</h2>

<?php
$conn = mysqli_connect("localhost", "root", "123456", "test");
if(isset($_POST['text'])){
    $insert_sql = "INSERT INTO message (text) VALUES ('". $_POST['text'] ."');";
    // 为了简单演示，就不对用户输入进行编码或转义
    mysqli_query($conn, $insert_sql);
}

$select_sql = "SELECT * FROM message";
$result = mysqli_query($conn, $select_sql);
while ($row = mysqli_fetch_assoc($result)) {
    echo "message: " . $row["text"]  . "<br>";
}
?>

</body>
</html>
```

下面是正常的评论

![image-20230208171639527](/XSS/image-20230208171639527.png)

payload：

```
<script>alert('XSS')</script>
```

![image-20230208172452144](/XSS/image-20230208172452144.png)

查看源代码，恶意代码已经植入服务器的数据库，因此当其他用户访问这个页面时就会触发恶意代码

![image-20230208172550937](/XSS/image-20230208172550937.png)

### 反射型 XSS

反射型XSS攻击通过将恶意脚本代码作为参数提交到目标网站，以便直接在网页上显示。此时，当用户浏览网页时，恶意脚本代码就会在其Web浏览器中自动执行。

下面是反射型XSS的代码案例（test.php）：

```php
<!DOCTYPE html>
<html>
<head>
	<title>Reflective XSS Example</title>
</head>
<body>

<h1>Reflective XSS Example</h1>

<?php 
	if(isset($_GET["name"])) {
		$name = $_GET["name"];
		echo "<h2>Hello, $name!</h2>";
	}
?>

<form>
	<input type="text" name="name">
	<input type="submit" value="Submit">
</form>

</body>
</html>
```

![image-20230208173611427](/XSS/image-20230208173611427.png)

payload:

```html
x <script>alert('XSS')</script>
```

![image-20230208174440096](/XSS/image-20230208174440096.png)

### DOM 型XSS

这种类型的 XSS 漏洞发生在网页将用户输入的数据插入到网页 DOM 树结构中时，如果没有进行适当的过滤和转义，那么用户输入的恶意脚本就可以在客户端执行，从而绕过了服务器端的检查。

```html
<!DOCTYPE html>
<html>
<head>
	<title>DOM XSS Example</title>
</head>
<body>
<script>
  var name = prompt('Enter your name:');
  document.write("<p>Hello, " + name + "!</p>");
</script>
</body>
</html>
```

payload:

```html
x <script>alert('XSS')</script>
```

![image-20230208181304326](/XSS/image-20230208181304326.png)

DOM型XSS攻击：DOM型XSS是指攻击者将恶意代码注入到页面中，并在客户端浏览器中运行。与反射型XSS不同，DOM型XSS不依赖服务器端。

## XSS 防护

1. 输入验证和转义：验证用户的输入并进行转义，以防止攻击代码的执行。

   ```js
   > encodeURIComponent("<scritp>alert('xss')</script>")
   < "%3Cscritp%3Ealert('xss')%3C%2Fscript%3E"
   ```

2. 使用HTTP-only Cookies：使用HTTP-only Cookies可以限制JavaScript访问Cookies数据，以防止XSS攻击。

   ```php
   <?php
   setcookie("cookie_name", "cookie_value", time() + 3600, "/", "", false, true);
   ?>
   ```

3. 使用Content Security Policy (CSP)：CSP可以告诉浏览器不允许执行任何来自不受信任来源的脚本，从而保护应用程序免受XSS攻击。

   ```url
   <meta http-equiv="Content-Security-Policy" content="default-src 'self'; img-src https://*; child-src 'none';">
   具体看：https://www.php.cn/manual/view/35533.html
   ```

   