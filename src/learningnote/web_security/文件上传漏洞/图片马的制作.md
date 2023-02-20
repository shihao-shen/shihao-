# PHP图片木马注入

原理：利用文件包含漏洞，通过`includ`外带，对图片进行解析时，会将里面的字符串当作php来处理，如果里面包含了一句话木马，就会被执行。


## 方法一

<img src="https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220927233037356.png" alt="image-20220927232900296" style="zoom:33%;" />

使用win10的copy，首先准备一句话木马和图片

运行命令

```cmd
copy 2.png/b+cmd.php/a mm.jpg
```

![image-20220927233037356](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220927233249547.png)

<img src="https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220927232900296.png" alt="image-20220927233249547" style="zoom:50%;" />

## 方法二

直接写，使用

（不要使用文本编辑器）打开图片

![image-20220928100116006](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220928001701878.png)

然后在x82和sub之间添加代码

![image-20220928001701878](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20220928100116006.png)

## 方法三

Linux系统制作图片马

```
cat file1.txt file2.jpg >> file3.jpg
```



