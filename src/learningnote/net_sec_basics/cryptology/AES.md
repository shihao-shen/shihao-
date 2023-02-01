---
# 当前页面内容标题
title: AES 
# sidebar: heading
# 当前页面图标
icon: note
# 分类
category:
    - 对称加密算法
    - 加密算法
tag:
    - AES
sticky: false
# 是否收藏在博客主题的文章列表中，当填入数字时，数字越大，排名越靠前。
star: false
# 是否将该文章添加至文章列表中
article: true
# 是否将该文章添加至时间线中
timeline: true
# sidebar: heading
order: 1
date: 2022-01-06
# 浏览量
pageview: true
---

# 📖 什么是AES？

AES（Advanced Encryption Standard）是高级加密标准，是目前世界上最流行的加密算法。AES的前身是Rijndael加密算法，由美国密码学家约瑟夫·莱因达尔（Joan Daemen）和荷兰密码学家阿尔弗雷德·莱因达尔（Vincent Rijmen）于1997年提出。

2001年，美国国家标准与技术研究所（NIST）正式将Rijndael加密算法作为新的高级加密标准，即AES算法。由于AES算法的高安全性和快速加密速度，它很快就成为了目前世界上最流行的加密算法，并得到了广泛的应用。

## 📑 加密流程

AES加密算法的基本流程如下：

1. 密钥生成：对于不同的密钥长度，AES算法使用不同的密钥扩展算法。
2. 初始置换：AES算法对明文进行初始置换，将明文分成若干个状态向量。
3. 密钥加：将密钥与状态向量进行异或运算。
4. 字节替代：将异或后的结果进行字节替代，使用S盒进行转换。
5. 行移位：将转换后的结果进行行移位。
6. 列混淆：将行移位后的结果进行列混淆。
7. 密钥加：将第6步的结果与密钥进行异或运算。
8. 重复步骤3-7：将第7步的结果再次进行字节替代、行移位、列混淆以及密钥加运算。
9. 最终置换：将加密完成的状态向量进行最终置换，得到密文。

## 📑 应用场景

AES是一种对称加密算法，被广泛应用于数据加密、数字信封、数据完整性检查、认证等方面。

AES的优点在于其具有高安全性、高效率、灵活的密钥长度设置等特点。

相比其他对称加密算法，AES具有更高的安全性和更高的效率。例如，与DES相比，AES具有更高的安全性，并且在计算机上的运行速度也要快得多。

在实际应用中，AES广泛应用于各种信息安全领域，如加密电子邮件、文件加密、加密通信等。同时，AES的安全性和效率也得到了广泛认可，已经成为目前主流的对称加密算法之一5

## 📑 代码实现

python 在 Windows下使用AES时要安装的是pycryptodome 模块

> pip install pycryptodome

python 在 Linux下使用AES时要安装的是pycrypto模块

> pip install pycrypto

```python
from Crypto.Cipher import AES

def encrypt(key, plaintext):
    cipher = AES.new(key, AES.MODE_EAX)
    ciphertext, tag = cipher.encrypt_and_digest(plaintext)
    return [cipher.nonce, tag, ciphertext]

def decrypt(key, nonce, tag, ciphertext):
    cipher = AES.new(key, AES.MODE_EAX, nonce)
    plaintext = cipher.decrypt_and_verify(ciphertext, tag)
    return plaintext

key = b'Sixteen byte key'
plaintext = b'Attack at dawn'

encrypted_data = encrypt(key, plaintext)
decrypted_data = decrypt(key, *encrypted_data)

assert decrypted_data == plaintext
```

在上面的代码中，encrypt函数接收两个参数：密钥和明文。它使用AES.new函数创建一个AES对象，并使用encrypt_and_digest函数对明文进行加密和计算摘要。最后，它返回一个包含加密结果的列表。

decrypt函数接收四个参数：密钥，nonce，tag和密文。它使用AES.new函数创建一个AES对象，并使用decrypt_and_verify函数对密文进行解密和验证