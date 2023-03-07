---
# 当前页面内容标题
title: Spring报错合集
# sidebar: heading
# 当前页面图标
icon: note
# 分类
category:
    - 日常
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
date: 2023-03-06
# 浏览量
pageview: true
---

## 未连接数据库

报错：

```
Description:

Failed to configure a DataSource: 'url' attribute is not specified and no embedded datasource could be configured.

Reason: Failed to determine a suitable driver class

```

解决：

```java
# 不连接数据库的情况下，将@SpringBootApplication改写为
import org.springframework.boot.autoconfigure.jdbc.DataSourceAutoConfiguration;

@SpringBootApplication(exclude= {DataSourceAutoConfiguration.class})
```
