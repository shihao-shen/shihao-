---
# 当前页面内容标题
title: TCP 协议
# sidebar: heading
# 当前页面图标
icon: note
# 分类
category:
    - 传输层
    - 协议
tag:
    - TCP
sticky: false
# 是否收藏在博客主题的文章列表中，当填入数字时，数字越大，排名越靠前。
star: false
# 是否将该文章添加至文章列表中
article: true
# 是否将该文章添加至时间线中
timeline: true
# sidebar: heading
order: 5
date: 2023-01-05
# 浏览量
pageview: true
---

# 📖 什么是TCP协议?

TCP（Transmission Control Protocol）协议是一种面向连接的、可靠的传输层协议，它是因特网协议族（Internet Protocol Suite）中的核心协议之一。

TCP协议的主要作用是在两台计算机之间建立可靠的连接，并通过该连接传输数据。 与UDP（User Datagram Protocol）协议不同，TCP协议提供了数据包检验和、流量控制、拥塞控制和拆分/重组功能，可以保证数据在传输过程中不丢失、不重复、不乱序。

## 📑 字段结构

<style type="text/css">
.tg  {border-collapse:collapse;border-spacing:0;margin:0px auto;}
.tg td{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  overflow:hidden;padding:10px 5px;word-break:normal;}
.tg th{border-color:black;border-style:solid;border-width:1px;font-family:Arial, sans-serif;font-size:14px;
  font-weight:normal;overflow:hidden;padding:10px 5px;word-break:normal;}
.tg .tg-ixsl{background-color:#92d9c2;border-color:inherit;color:#ffffff;font-weight:bold;text-align:center;vertical-align:middle}
.tg .tg-m5b7{background-color:#92d9c2;border-color:inherit;color:#ffffff;font-weight:bold;text-align:left;vertical-align:middle}
</style>
<table class="tg" style="undefined;table-layout: fixed; width: 100%">
<colgroup text-align="center">
<col style="width: 74px">
<col style="width: 47px">
<col style="width: 26px">
<col style="width: 26px">
<col style="width: 23px">
<col style="width: 26px">
<col style="width: 26px">
<col style="width: 26px">
<col style="width: 273px">
</colgroup>
<tbody>
  <tr >
      <td class="tg-ixsl" colspan="8"><center>源端口号（16）</center></td>
    <td class="tg-ixsl"><center>目的端口号（16）</center></td>
  </tr>
  <tr>
    <td class="tg-ixsl" colspan="9"><center>序列号（32）</center></td>
  </tr>
  <tr>
  	<td class="tg-ixsl" colspan="9"><center>确认序列号（32）</center></td>
  </tr>
  <tr>
    <td class="tg-m5b7"><center>首部长度<br>   （4）</center></td>
    <td class="tg-m5b7">保留位(6)</td>
    <td class="tg-m5b7">U<br>R<br>G</td>
    <td class="tg-m5b7">A<br>C<br>K</td>
    <td class="tg-m5b7">P<br>S<br>H</td>
    <td class="tg-m5b7">R<br>S<br>T</td>
    <td class="tg-m5b7">S<br>Y<br>N</td>
    <td class="tg-m5b7">F<br>I<br>N</td>
    <td class="tg-ixsl"><center>窗口大小（16）</center></td>
  </tr>
  <tr>
      <td class="tg-ixsl" colspan="8"><center>校验和（16）</center></td>
      <td class="tg-ixsl"><center>紧急指针（16）</center></td>
  </tr>
  <tr>
      <td class="tg-ixsl" colspan="9"><center>选项</center></td>
  </tr>
</tbody>
</table>

- 源端口（16位）：0~65535，指定本地应用程序的端口号
- 目的端口（16位）：0~65535，指定对端计算机程序的端口号
- 序列号（32位）：客户端和服务端向连时，客户端会随机生成一个随机数（0x0~0xFFFFFFFF）,这个数据数就是当前发送数据首位的序列号，经过三次握手后，该值会加1（相当于发送了一个字节），而相对于数据下标来说，相当于数据的第一位，也就是下标为0
- 确认序列号（32位）：期望对端使用的序列号，如果对端传输过来的数据丢失或数据别篡改，则可以继续要求对端发送这个数据包
- 首部长度（4位）：取值范围5~15位，范围太小，无法完全表示首部的长度，所以乘于4后，取值范围为20~60，单位为字节
- 保留位（6位）：为0，主要用于tcp后续的扩展
- flags（6位）：
  - URG：紧急指针是否有效
  - ACK：确认序号是否有效
  - PSH：推送标志位，表示该数据需要尽快交到应用层
  - RST：表示是否需要重连
  - SYN：发起一个新的连接
  - FIN：表示释放一个连接
- 窗口大小（16位）：用于流量控制，表示期望下次接收的最大长度
- 校验和（16位）：带伪头部的TCP报头校验和
- 紧急指针（16位）：它是一个偏移量(也就是先发的包长度)，和报文序号字段中的值相加表示紧急数据最后一个字节的序号选项:可能包括"窗口扩大因子"、"时间戳"等选项
- option（可选项）：

## 📑 工作原理

1. 建立连接：发送方向接收方发送连接请求报文段，接收方收到请求后会回复确认报文段。 发送方收到确认报文段后，连接建立完成。
2. 数据传输：在连接建立之后，发送方和接收方可以开始传输数据。 每个数据包都会被封装成一个报文段，并按照一定顺序发送。 接收方收到报文段后，会回复一个确认报文段，告诉发送方这个报文段已经收到。
3. 断开连接：当发送方和接收方都完成数据传输后，可以选择断开连接。 发送方向接收方发送断开连接请求报文段，接收方收到请求后会回复确认报文段。 发送方收到确认报文段后，连接断开完成。

### 📑 三次握手

TCP的三次握手是一种在双方建立连接之前，确保连接建立正确的过程。

流程如下：

1. A发送连接请求报文段。 这一步中，A向B发送一个数据包，其中包含了一个SYN（synchronize）标志，表示连接请求。
2. B收到A的连接请求报文段后，回复一个确认报文段。 这一步中，B向A发送一个数据包，其中包含了一个SYN（synchronize）标志和一个ACK（syn + 1）标志，表示已经收到了连接请求。
3. A收到B的确认报文段后，发送一个确认报文段。 这一步中，A向B发送一个数据包，其中包含了一个ACK（SYN + 1）标志，表示已经收到了B的确认报文段。

### 📑 四次挥手

TCP的四次挥手是在TCP的三次握手的基础上增加了一步，用于在关闭连接时确认连接已经关闭。

流程如下：

1. A发送连接关闭请求报文段。 这一步中，A向B发送一个数据包，其中包含了一个FIN（finish）标志，表示连接关闭请求。
2. B收到A的连接关闭请求报文段后，回复一个确认报文段。 这一步中，B向A发送一个数据包，其中包含了一个ACK（acknowledgement）标志，表示已经收到了连接关闭请求。
3. A收到B的确认报文段后，发送一个确认报文段。 这一步中，A向B发送一个数据包，其中包含了一个ACK标志，表示已经收到了B的确认报文段。
4. B收到A的确认报文段后，连接关闭。

### 📑 特殊标志

在TCP的四次挥手过程中，每一步中都会在TCP的数据包头部添加一些特殊的字段，表示握手的状态。 这些字段包括：

- FIN（finish）标志：表示连接关闭请求。
- ACK（acknowledgement）标志：表示已经收到了连接关闭请求。
- Sequence Number（序列号）字段：表示数据包中的数据的序号。
- Acknowledgement Number（确认号）字段：表示收到的最后一个数据包的序号。

## 📑 应用场景

由于TCP协议提供了可靠的数据传输，因此它常常被用在需要保证数据完整性的应用中。 常见的应用场景包括：

- Web浏览器和Web服务器之间的通信
- 电子邮件客户端和邮件服务器之间的通信
- FTP（File Transfer Protocol）文件传输
- Telnet远程登录
- SSH（Secure Shell）安全终端连接

## 📑 小结

TCP协议是一种重要的传输层协议，它解决了数据在网络传输过程中可能遇到的丢失、重复、乱序等问题。 它的工作流程主要包括连接建立、数据传输、连接断开三个阶段。 TCP协议的应用场景非常广泛，在日常生活中我们经常会使用到它。