---
# 当前页面内容标题
title: HTTP 协议
# sidebar: heading
# 当前页面图标
icon: note
# 分类
category:
    - 应用层
    - 协议
tag:
    - HTTP   
sticky: false
# 是否收藏在博客主题的文章列表中，当填入数字时，数字越大，排名越靠前。
star: false
# 是否将该文章添加至文章列表中
article: true
# 是否将该文章添加至时间线中
timeline: true
# sidebar: heading
order: 7
date: 2022-01-04
# 浏览量
pageview: true
---

# 📖 什么是IP协议？

HTTP全称为超文本传输协议（HyperText Transfer Protocol）。它是一种应用层协议，通过在TCP协议的基础上传输超文本数据。

超文本数据包含HTML标记，它允许文本之间包含超链接，从而使客户端可以浏览整个网站。

## 📑 协议结构

HTTP协议是一个基于请求/响应模型的协议。客户端向服务端发送请求，服务端返回响应。

一个HTTP请求由三部分组成：

- 请求行：包含请求方法、请求URL、协议版本信息。
- 请求头：包含请求的附加信息。
- 请求正文：包含请求的实体内容。

下面是通过`wireshark`捕获的HTTP数据包

```pascal
HTTP/1.1 200 OK	# 请求头
----------------请求头----------------
Server: nginx/1.23.3	
Date: Wed, 04 Jan 2023 12:25:23 GMT
Content-Type: application/javascript
Content-Length: 225
Last-Modified: Mon, 02 Jan 2023 14:03:02 GMT
Connection: keep-alive
ETag: "63b2e416-e1"
Accept-Ranges: bytes
-------------------------------------

----------------请求体----------------
import{_ as e}from"./_plugin-vue_export-helper.cdc0426e.js";import{o as t,c}from"./app.96e86159.js";const o={};function r(n,_){return t(),c("div")}const f=e(o,[["render",r],["__file","index.html.vue"]]);export{f as default};
-------------------------------------
```

注：请求头和请求体之间需要空一行

### 📑 请求行

HTTP 请求行包含了三个部分：

- 请求方法：这是客户端想对服务器执行的操作。常见的请求方法有 GET、HEAD、POST 和 PUT。
- 请求 URI：这是客户端想要访问的资源的统一资源标识符 (URI)。
- HTTP 版本：这是使用的 HTTP 版本。通常使用的是 HTTP/1.1。

下面是服务器允许客户端访问响应资源时发送的请求行

```url
HTTP/1.1 200 OK
```

这表示服务器使用的是 HTTP 1.1 协议，并且响应了客户端的请求。状态码 200 表示请求成功，状态描述 OK 表示请求正常处理完毕。

所以如果一个请求行里只有 HTTP 版本、状态码和 OK，那么这是一个 HTTP 响应报文的请求行。

下面是一个 GET 请求的 HTTP 请求行：

```url
GET /index.html HTTP/1.1
```

在这个请求行中，请求方法是 GET，请求 URI 是 /index.html，HTTP 版本是 HTTP/1.1。

### 📑请求头

HTTP协议的请求头是包含有关HTTP请求的元信息的一部分，请求头的主要功能是告诉服务器有关客户端软件、文档类型和文档的元信息，以及有关客户端支持的其他协议的信息。

常用的请求头如下表所示：

| 字段名          | 描述                         |
| --------------- | ---------------------------- |
| Accept          | 指定客户端能够接收的内容类型 |
| Accept-Charset  | 指定客户端能够接收的字符集   |
| Accept-Encoding | 指定客户端能够接收的内容编码 |
| Accept-Language | 指定客户端能够接收的自然语言 |
| Accept-Datetime | 指定客户端能够接收的日期时间 |
| Authorization   | 基本身份验证信息             |
| Cache-Control   | 指定请求/响应链上的缓存机制  |
| Connection      | 表示是否需要持久连接         |
| Cookie          | HTTP Cookies                 |
| Content-Length  | 请求的内容长度               |
| Content-Type    | 请求的与实体对应的MIME信息   |
| Date            | 请求发送的日期和时间         |
| Expect          | 请求的特定的服               |

### 📑请求体

HTTP的请求体用来发送请求的数据。它的形式可以是多种类型的实体内容，比如文本、文件或表单数据等。

请求体通常使用Content-Type字段来指定它的类型。例如，如果请求体是文本，则Content-Type字段可以设置为'text/plain'。如果请求体是文件，则Content-Type字段可以设置为'application/octet-stream'。

Content-Length字段用来指定请求体的长度，以字节为单位。这个字段用于服务器端处理请求时分配足够的内存空间。

例如，在发送一个POST请求时，请求体可能包含表单数据：

```url
POST /form HTTP/1.1 
Content-Type: application/x-www-form-urlencoded 
Content-Length: 27

name=John&age=30&submit=Submit
```

在这个例子中，Content-Type字段指定请求体的类型是'application/x-www-form-urlencoded'，Content-Length字段指定请求体的长度是27字节，而请求体本身就是表

## 📑 工作原理

HTTP协议的工作流程大致如下：

1. 客户端发送一个HTTP请求给服务器。
2. 服务器接收到请求，并根据请求中的URL，调用相应的服务程序来处理请求。
3. 服务器处理完请求后，返回一个HTTP响应给客户端。
4. 客户端接收到响应后，根据响应的内容来更新界面或执行其他操作。

在HTTP协议中，客户端和服务器之间的通信是基于请求-响应模式的，也就是说，客户端需要主动发送请求给服务器，服务器才会返回响应。

## 📑 小结

HTTP在社会上的应用是极广的，但是由于它在传输过程中没有加密的机制，因此它的数据安全性是非常薄弱的，而且HTTP还存在一些其他的缺点，如无法实现断点续传和其他功能的限制。解决办法是使用HTTPS协议，它在HTTP的基础上增加了SSL/TLS加密机制，使得数据传输过程更加安全。