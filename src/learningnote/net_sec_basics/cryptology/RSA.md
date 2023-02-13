---
# 当前页面内容标题
title: RSA 
# sidebar: heading
# 当前页面图标
icon: note
# 分类
category:
    - 非对称加密算法
    - 加密算法
tag:
    - RSA
sticky: false
# 是否收藏在博客主题的文章列表中，当填入数字时，数字越大，排名越靠前。
star: false
# 是否将该文章添加至文章列表中
article: true
# 是否将该文章添加至时间线中
timeline: true
# sidebar: heading
order: 2
date: 2022-01-06
# 浏览量
pageview: true
---

# 📖 什么是RSA？

RSA是一种公钥加密算法，同时也是一种数论算法。它的名字来自于三位创始人：Ron Rivest, Adi Shamir 和 Leonard Adleman。

![](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/arl.jpg)

在RSA加密算法中，有两个密钥：公钥和私钥。公钥可以公开，私钥必须保密。发送者使用公钥加密消息，接收者使用私钥解密。由于私钥是保密的，所以只有接收者能够解密消息，这就保证了消息的安全性。

## 📑 加密流程

RSA的加密流程如下：

1. 首先，选择两个大质数 $p$ 和 $q$ 作为秘钥的一部分。
2. 计算出 $n=p\times q$ 。
3. 选择一个大质数 $e$ ，使得 $e$ 和 $\phi(n)=(p-1)\times(q-1)$ 互质。$\phi(n)$ 即欧拉函数。
4. 计算出 $d$ ，使得 $d\times e\equiv 1\pmod{\phi(n)}$ 。
5. 公钥为 $(e,n)$ ，私钥为 $(d,n)$ 。

明文 $m$ 要加密成密文 $c$ ，使用公钥 $(e,n)$ ，则 $c\equiv m^e\pmod{n}$ 。

解密时，使用私钥 $(d,n)$ ，则 $m\equiv c^d\pmod{n}$ 。

举个例子，假设 $p=7$ ， $q=11$ ， $e=5$ ，则 $n=77$ ， $\phi(n)=60$ ， $d=37$ 。

假设要加密的明文 $m=3$ ，则密文 $c\equiv 3^5\pmod{77}=6$ 。

解密时，$m\equiv 6^{37}\pmod{77}=3$ 。

## 📑 应用场景

RSA加密算法常用在数据传输安全和电子商务等领域。

例如，在数据传输安全方面，使用RSA加密算法可以保证数据在传输过程中的安全性。在电子商务方面，RSA可以用来保证在线交易的安全性，保证数据在传输过程中的安全性。

此外，RSA加密算法还可以用于数字签名的场景，用来保证数字文件的完整性和真实性。

## 📑 代码实现

使用python库 cryptography ，实现RSA

1. 首先需要生成RSA密钥对，包括公钥和私钥。这可以使用 cryptography 库中的 RSA.generate_private_key() 函数实现。
2. 然后使用公钥对要加密的消息进行加密。可以使用公钥的 encrypt() 方法实现。
3. 对加密后的消息使用私钥进行解密。可以使用私钥的 decrypt() 方法实现。

下面是一个使用 cryptography 库实现RSA加密的示例代码：

```python
# 首先，需要安装 cryptography 库
# 在命令行中输入 pip install cryptography 安装即可

# 导入 RSA 加密所需的模块
from cryptography.hazmat.primitives.asymmetric import rsa, padding
from cryptography.hazmat.primitives import serialization, hashes

# 生成一对 RSA 公钥和私钥
private_key = rsa.generate_private_key(
    public_exponent=65537,
    key_size=2048
)

# 序列化私钥
private_pem = private_key.private_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PrivateFormat.PKCS8,
    encryption_algorithm=serialization.NoEncryption()
)

# 序列化公钥
public_pem = private_key.public_key().public_bytes(
    encoding=serialization.Encoding.PEM,
    format=serialization.PublicFormat.SubjectPublicKeyInfo
)

# 加密数据
data = b"Hello, World!"
ciphertext = private_key.public_key().encrypt(
    data,
    padding.OAEP(
        mgf=padding.MGF1(algorithm=hashes.SHA256()),
        algorithm=hashes.SHA256(),
        label=None
    )
)

# 解密数据
plaintext = private_key.decrypt(
    ciphertext,
    padding.OAEP(
        mgf=padding.MGF1(algorithm=hashes.SHA256()),
        algorithm=hashes.SHA256(),
        label=None
    )
)

# 打印结果
print("Original Data:", data)
print("Ciphertext:", ciphertext)
print("Decrypted Data:", plaintext)
```

