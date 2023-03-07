---
# 当前页面内容标题
title: Hello Spring boot3
# sidebar: heading
# 当前页面图标
icon: note
# 分类
category:
    - java
tag:
    - spring boot
sticky: false
# 是否收藏在博客主题的文章列表中，当填入数字时，数字越大，排名越靠前。
star: false
# 是否将该文章添加至文章列表中
article: true
# 是否将该文章添加至时间线中
timeline: true
# sidebar: heading
order: 2
date: 2023-03-06
# 浏览量
pageview: true
---

## 什么是Spring Boot？

`Spring Boot`是一个基于`spring`框架的一个快速开发平台，它自动集成了Spring MVC，Tomcat等服务器和常用的库，这意味着你可以省去很多繁琐的配置工作，并可以快速的构建出一个可运行的web应用程序。

## 创建Spring Boot项目

进入`IDEA`，`New Project`，填写项目信息

![2023-03-06_11-15-53](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/2023-03-06_11-15-53.png)

:::info

注意：Spring Boot 3.0 最低要求 Java 17

:::

选择依赖，然后`create`创建项目

![2023-03-06_11-32-22](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/2023-03-06_11-32-22.png)

然后等待下载依赖，就可以了

![2023-03-06_11-34-25](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/2023-03-06_11-34-25.png)

运行`Blog`

![2023-03-06_11-44-41](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/2023-03-06_11-44-41.png)

## 创建控制器

在 `com.site.blog` 包下创建 `IndexController.java`

```java
package com.site.blog;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
public class IndexController {
    
    @RequestMapping("/hello")
    public String helloBoot(){
        return "Hello Spring Boot3";
    }
}
```

访问`http://127.0.0.1:8080/hello`

![2023-03-06_11-51-21](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/2023-03-06_11-51-21.png)

::: info

RequestMapping注解，会将客户端的请求映射到 MVC 和 RESET 控制器中，简单来说就是用来处理客户端的请求

:::

### 客户端请求

获取 `URI` 变量值，主要实现是在 `RequestMapping` 设置 `URI` 为 `"/{id}/{name}"` ，然后可以通过`@PathVariable`，来获取 `URI` 路径变量值，也就是 `id` 和 `name` 

```java
@RequestMapping(value = "/{id}/{name}")
public String index(@PathVariable int id, @PathVariable String name){
    return "{id:"+id+",name:"+name+"}";
}
```

![2023-03-06_15-07-22](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/2023-03-06_15-07-22.png)

通过设置 `RequestMapping` 中的 `method` 参数，来设置客户端使用的请求方式

```java
@RequestMapping(value = "/", method = RequestMethod.GET)
public String index(@RequestParam(value = "id", required = false, defaultValue = "1") int id,
                    @RequestParam(value = "name", required = false) String name){
    return "{id:"+id+",name:"+name+"}";
}
```

:::info

@RequestParam(value="参数名", required="默认必须", defaultValue="默认值") 

:::

## 创建视图

这里使用的模板引擎是`thymeleaf`，我比较关注和在意的是`thymeleaf`的模板是以`html`为基础，也就是说他的后缀为`.html`，可以被浏览器直接读取，并不像其他的模板引擎，有特定的后缀，浏览器需要通过后端才可以对这些模板进行分析。

下面开始引入`thymeleaf`，打开`pom.xml`，添加下面依赖

```xml
<dependency>
	<groupId>org.springframework.boot</groupId>
	<artifactId>spring-boot-starter-thymeleaf</artifactId>
</dependency>
```

在`src/main/resources/templates/` 创建 `index.html`

```html
<!DOCTYPE html>
<html lang="en">
<!--在创建文件后需要添加下面的这个属性-->
<html xmlns:th="http://www.thymeleaf.org">
<head>
    <meta charset="UTF-8">
    <title>Shihao.icu</title>
</head>
<body>
    <div>
        <p th:text="${name}"></p>
        <p th:text="${age}"></p>
    </div>
</body>
</html>
```

:::info

spring规定模板一般存在`templates`中，静态资源一般存在`static`文件夹中

:::

修改`application.yaml`

```yaml
spring:
	thymeleaf:
		cache: true
```

::: info

设置`thymeleaf`缓存，为`true`时，所有静态资源会被缓存，修改静态资源时，需要重启服务，为`false`时则相反

:::

修改`IndexController`控制器

```java
package com.site.blog;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.RequestMapping;

import org.springframework.ui.Model;

@Controller
public class IndexController {
    @RequestMapping(value = "/index.html")
    public String index(Model model){
		model.addAttribute("name", "shihao");
        model.addAttribute("age", 18);
        // 对应index.htm模板
        return "index";
    }
}
```

执行效果：

![image-20230307100332176](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20230307100332176.png)
