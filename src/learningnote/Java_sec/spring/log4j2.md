---
# 当前页面内容标题
title: Log4j2
# sidebar: heading
# 当前页面图标
icon: note
# 分类
category:
    - java
tag:
    - log4j2
sticky: false
# 是否收藏在博客主题的文章列表中，当填入数字时，数字越大，排名越靠前。
star: false
# 是否将该文章添加至文章列表中
article: true
# 是否将该文章添加至时间线中
timeline: true
# sidebar: heading
order: 2
date: 2023-02-15
# 浏览量
pageview: true
---

Apache Log4j 2是Apache的开源的一个项目，主要功能是可以将日志指定传输到控制台、文件、GUI组件等地方。同时可以自定义日志格式，通过配置文件进行修改。

官网地址: [Log4j – Apache Log4j 2](https://logging.apache.org/log4j/2.x/)

## 导入log4j

在`pom.xml`中添加下面配置

```
<dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-core</artifactId>
    <version>2.19.0</version>
</dependency>
<dependency>
    <groupId>org.apache.logging.log4j</groupId>
    <artifactId>log4j-slf4j-impl</artifactId>
    <version>2.19.0</version>
</dependency>
```

在`resources`中创建`log4j2.xml`文件

```xml
<?xml version="1.0" encoding="UTF-8"?>
<Configuration status="WARN">
    <Loggers>
        <!-- 默认打印日志级别为 error -->
        <!--
            level指定日志级别，从低到高的优先级
            TRACE < DEBUG < INFO < WARN < ERROR < FATAL
            trace：追踪，相当于追踪程序的执行
            debug：调试，一般在开发中，都将其设置为最低的日志级别
            info：信息，输出重要信息，使用较多
            warn：警告，输出警告的信息
            error：错误，输出错误信息
            fatal：严重错误
        -->
        <Root level="DEBUG">
            <appender-ref ref="spring6log"/>
            <appender-ref ref="RoolingFile"/>
            <appender-ref ref="log"/>
        </Root>
    </Loggers>
    <Appenders>
        <!-- 默认打印到控制台 -->
        <Console name="spring6log" target="SYSTEM_OUT">
            <!-- 默认打印格式 -->
            <PatternLayout pattern="%d{HH:mm:ss.SSS} [%t] %-3level %logger{1024} - %msg%n"/>
        </Console>
        <!-- filename为日志输出路径，append为是否追加到日志文件中，否则重写文件 -->
        <File name="log" fileName="G:/编程开发/JAVA/Spring6/spring-first/src/log/app.log" append="false">
            <PatternLayout pattern="%d{HH:mm:ss.SSS} $-5level %class{36} %L %M - %msg%xEx%n"/>
        </File>
        <!-- RollingFile 同样是日志文件输出，但是支持对日志文件的大小监控，如果日志大于设定的最大值，则会将日志文件打包 -->
        <RollingFile name="RollingFile" fileName="G:/编程开发/JAVA/Spring6/spring-first/src/log/test.log"
        filePattern="G:/编程开发/JAVA/Spring6/spring-first/src/log/$${date:yyyy=MM}/app-%d{MM-dd-yyyy}-%i.log.gz">
            <PatternLayout pattern="$d{yyyy-MM-dd 'at' HH:mm:ss z} %-5level %class{36} %L %M - %msg%xEx%n"/>
            
            <SizeBasedTriggeringPolicy size="50MB"/>
            <!--默认最多同一文件夹下7个文件，这里设置20-->
            <DefaultRolloverStrategy max="20"/>
        </RollingFile>
    </Appenders>
</Configuration>
```

## 输出日志

直接运行测试，可以看到多了三行的日志报告

![Snipaste_2023-02-15_01-28-52](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/Snipaste_2023-02-15_01-28-52.png)

在log文件中，也生成了两个日志文件

![Snipaste_2023-02-15_01-29-36](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/Snipaste_2023-02-15_01-29-36.png)

## 手动输出

修改`TestUser`如下

```java
package com.atguigu.spring6;
import org.junit.jupiter.api.Test;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.context.ApplicationContext;
import org.springframework.context.support.ClassPathXmlApplicationContext;

public class TestUser {
    private final Logger logger = LoggerFactory.getLogger(TestUser.class);
    @Test
    public void testUserObject(){
        // 加载spring配置文件
        ApplicationContext context = new ClassPathXmlApplicationContext("bean.xml");
        // 获取创建对象
        User user = (User) context.getBean("user");
        System.out.println(user);
        // 使用对象调用方法
        user.add();

        logger.info("调用User成功！");
    }
}
```

