---
# 当前页面内容标题
title: spring 入门
# sidebar: heading
# 当前页面图标
icon: note
# 分类
category:
    - java
tag:
    - spring
sticky: false
# 是否收藏在博客主题的文章列表中，当填入数字时，数字越大，排名越靠前。
star: false
# 是否将该文章添加至文章列表中
article: true
# 是否将该文章添加至时间线中
timeline: true
# sidebar: heading
order: 1
date: 2023-02-15
# 浏览量
pageview: true
---

JDK 的兼容版本：JDK 17-21 (expected)

## 一、创建Spring项目

使用软件：

![Snipaste_2023-02-15_00-15-42](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/Snipaste_2023-02-15_00-15-42.png)

点击`File》Project`，设置名称`Spring6`，语言`java`，使用`Maven`仓库，选择版本17的`JDK`

![Snipaste_2023-02-15_00-20-23](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/Snipaste_2023-02-15_00-20-23.png)

## 二、创建子项目

右键`Spring6`，选择`New》Module`：

![Snipaste_2023-02-15_00-25-34](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/Snipaste_2023-02-15_00-25-34.png)

输入配置信息：

![Snipaste_2023-02-15_00-26-38](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/Snipaste_2023-02-15_00-26-38.png)

创建如下目录

![Snipaste_2023-02-15_00-28-52](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/Snipaste_2023-02-15_00-28-52.png)

## 三、入门案例

导入`spring-framework`，在`spring-first`目录下的`pom.xml`文件中，`<project>`标签里添加下面的配置

```xml
<dependencies>
    <dependency>
        <groupId>org.springframework</groupId>
        <artifactId>spring-context</artifactId>
        <version>6.0.2</version>
    </dependency>
    <dependency>
        <groupId>org.junit.jupiter</groupId>
        <artifactId>junit-jupiter-api</artifactId>
        <version>5.6.3</version>
    </dependency>
</dependencies>
```

重新加载`pom.xml`

![Snipaste_2023-02-15_00-36-01](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/Snipaste_2023-02-15_00-36-01.png)

创建`User`类

```java
package com.atguigu.spring6;

public class User {
    public User() {
        System.out.println("构造函数执行");
    }
    public void add(){
        System.out.println("你好spring6");
    }
}
```

创建配置文件`bean.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<beans xmlns="http://www.springframework.org/schema/beans"
       xmlns:xsi="http://www.w3.org/2001/XMLSchema-instance"
       xsi:schemaLocation="http://www.springframework.org/schema/beans http://www.springframework.org/schema/beans/spring-beans.xsd">
    <bean id="user" class="com.atguigu.spring6.User"/>
    <!--
		bean标签是用来创建指定对象
			id：唯一id
			class：为类对象路径，即包路径+对象名称（com.atguigu.spring6.User）
	-->
</beans>
```

创建`TestUser`类，并开始允许

```java
package com.atguigu.spring6;
import org.junit.jupiter.api.Test;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class TestUser {
    @Test
    public void testUserObject(){
        // 加载spring配置文件
        ApplicationContext context = new ClassPathXmlApplicationContext("bean.xml");
        // 获取创建对象
        User user = (User) context.getBean("user");
        System.out.println(user);
        // 使用对象调用方法
        user.add();
    }
}
```

![Snipaste_2023-02-15_00-39-51](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/Snipaste_2023-02-15_00-39-51.png)
