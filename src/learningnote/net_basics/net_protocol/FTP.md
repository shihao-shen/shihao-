---
# 当前页面内容标题
title: FTP 协议
# sidebar: heading
# 当前页面图标
icon: note
# 分类
category:
    - 应用层
    - 协议
tag:
    - FTP
sticky: false
# 是否收藏在博客主题的文章列表中，当填入数字时，数字越大，排名越靠前。
star: false
# 是否将该文章添加至文章列表中
article: true
# 是否将该文章添加至时间线中
timeline: true
# sidebar: heading
order: 9
date: 2023-01-04
# 浏览量
pageview: true
---

# 📖 什么是 FTP 协议

FTP（文件传输协议）是一种用于在网络上传输文件的协议。它在客户端和服务器端之间建立了两个连接，一个用于数据传输，另一个用于命令和状态信息。

FTP有很多优点：

- 它是一种简单的协议，易于理解和使用。
- 它支持二进制文件和文本文件的传输。
- 它支持文件的简单操作，如复制、移动、删除等。
- 它支持目录的简单操作，如创建、删除、重命名等。

FTP协议使用端口20和21。FTP的缺点之一是它是明文传输，传输的内容可能会被第三方截获，比如网络管理员或者黑客。为了防止这种情况，可以使用SSL/TLS加密传输，也可以使用SFTP（SSH File Transfer Protocol）协议进行传输，该协议使用加密方式进行传输。

## 📑 协议结构

FTP协议主要由两个部分组成：**命令**和**数据传输**。

命令部分的内容是客户端向服务端发送的请求，用于告诉服务端客户端希望执行的操作。命令部分的内容通过20端口进行传输。

数据传输部分的内容是客户端或服务端发送的文件或目录的内容，用于实际传输数据的地方。数据传输部分的内容通过21端口进行传输。

## 📑 工作流程

FTP协议的工作流程为：

1. 客户端连接到FTP服务器，并使用用户名和密码登录。
2. 客户端使用**FTP命令**发送请求给FTP服务器。
3. FTP服务器使用**FTP响应**回复客户端的请求。
4. 客户端和FTP服务器之间发送文件或目录列表。
5. 客户端断开与FTP服务器的连接。

FTP协议允许客户端对服务器上的文件进行多种操作，如上传、下载、更改文件名等。

<!-- ## 📑 搭建FTP服务器

在 CentOS 7 搭建 FTP 服务器，可以按照以下步骤操作：

1. 安装 vsftpd 软件包：sudo yum install vsftpd

2. 配置 vsftpd：编辑 /etc/vsftpd/vsftpd.conf 文件，修改相关配置。

   - `anonymous_enable`：控制是否允许匿名用户登录。可选值为 YES 或 NO。
   - `local_enable`：控制是否允许本地用户登录。可选值为 YES 或 NO。
   - `write_enable`：控制是否允许用户进行文件上传和删除操作。可选值为 YES 或 NO。
   - `local_umask`：设置本地用户上传文件的默认权限。可选值为 022、002 等。
   - `dirmessage_enable`：控制是否在用户进入新目录时显示该目录的 .message 文件内容。可选值为 YES 或 NO。
   - `xferlog_enable`：控制是否记录文件传输日志。可选值为 YES 或 NO。
   - `connect_from_port_20`：控制是否使用端口 20 进行数据传输。可选值为 YES 或 NO。
   - `xferlog_file`：设置文件传输日志文件的路径。可选值为 /var/log/xferlog 等。
   - `xferlog_std_format`：控制文件传输日志的格式。可选值为 YES 或 NO。
   - `idle_session_timeout`：设置用户空闲超时时间。取值范围0-3600。
   - `data_connection_timeout`：设置数据连接，取值范围0-3600。

3. 创建用户：使用 useradd 命令创建 FTP 用户。

   ```sh
   # 创建一个用户（我的系统里本身就有ftp这个用户）
   adduser ftp -M -s /sbin/nologin
   ```

4. 设置密码：使用 passwd 命令为用户设置密码。

   ```sh
   # 设置用户密码
   passwd ftp
   ```

5. 启动 vsftpd 服务：sudo systemctl start vsftpd

6. 设置开机启动：sudo systemctl enable vsftpd
 -->


## 📑 小结

- FTP是一种文件传输协议，它使用20和21端口进行通信。
- FTP的协议结构由命令行、数据行和控制信息三部分组成。
- FTP的工作流程包括三个阶段：连接建立、认证和数据传输。