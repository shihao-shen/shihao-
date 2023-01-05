---
# 当前页面内容标题
title: SMTP 协议
# sidebar: heading
# 当前页面图标
icon: note
# 分类
category:
    - 应用层
    - 协议
tag:
    - SMTP
sticky: false
# 是否收藏在博客主题的文章列表中，当填入数字时，数字越大，排名越靠前。
star: false
# 是否将该文章添加至文章列表中
article: true
# 是否将该文章添加至时间线中
timeline: true
# sidebar: heading
order: 10
date: 2023-01-05
# 浏览量
pageview: true
---

# 📖 什么是 SMTP 协议?

SMTP协议是简单邮件传输协议的缩写，是在 TCP/IP 协议下进行发送邮件的协议。SMTP是基于命令和响应模式进行工作的，并使用 ASCII 文本进行通信。

SMTP协议最初由 John Licklider 在 1970 年代设计，最初被用于 ARPANET 内部的邮件传输。1981 年，SMTP 协议被提交到国际标准化组织（ISO）进行标准化，并在 1982 年被正式发布为标准。

随着互联网的普及，SMTP协议已成为互联网上大多数邮件系统的主要协议，并在许多其他的电子邮件系统中得到广泛使用。

## 📑 协议结构

SMTP协议的结构包括以下几部分：

1. 命令行：SMTP协议使用命令行来发送指令，命令行以CRLF(回车换行)结尾。
2. 响应码：SMTP协议使用响应码来表示命令的执行结果。响应码由三位数字组成，第一位数字表示响应的类别，后两位数字表示具体的状态。
3. 头部字段：SMTP协议使用头部字段来储存邮件的相关信息，例如发件人、收件人、主题等。
4. 消息主体：消息主体是邮件的正文内容。
5. 终止符：SMTP协议使用终止符来表示邮件的结束。

例如，下面是一个简单的SMTP报文的例子，该报文表示将一封邮件从用户 "[sender@example.com](mailto:sender@example.com)" 发送到用户 "[recipient@example.com](mailto:recipient@example.com)"。

```yaml
HELO example.com
MAIL FROM:<sender@example.com>
RCPT TO:<recipient@example.com>
DATA
Subject: Hello World

This is the message body.
.
```

在这个报文中，HELO命令用于向服务器确认身份，MAIL FROM命令指定邮件的发件人，RCPT TO命令指定邮件的收件人，DATA命令表示邮件正文的开始，最后一行以一个句点(.)开头表示邮件正文的结束。

## 📑 工作原理

SMTP使用TCP协议进行通信，通常使用端口25。

当一封电子邮件从发送者发出时，它会先到达发件人所在的SMTP服务器。SMTP服务器会检查发件人地址的有效性，然后将邮件转发到收件人所在的SMTP服务器。收件人的SMTP服务器会再次检查收件人地址的有效性，然后将邮件转发给收件人的电子邮件客户端（如Outlook或Gmail）。

邮件发送过程中，SMTP服务器之间会使用一些命令进行通信，如HELO、MAIL FROM、RCPT TO、DATA和QUIT。这些命令用于确定邮件的发送方、收件方、主题等信息。

SMTP协议有一些限制，比如不能发送二进制文件或大型附件，也不能保证邮件传输的安全性。因此，SMTP协议通常会与其他协议（如POP或IMAP）配合使用，以提供更好的邮件服务。

## 📑 小结

SMTP是用于在互联网上发送电子邮件的协议。它最初是在1982年由Jon Postel发明的。SMTP协议由命令和响应组成，使用ASCII文本进行通信。SMTP协议的工作原理是，在发件人和收件人之间传输电子邮件，并使用基于文本的命令来控制消息的传输过程。