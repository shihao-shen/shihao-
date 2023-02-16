---
# 当前页面内容标题
title: 命令注入漏洞
# 当前页面图标
icon: "hot"
# 分类
sticky: false
# 是否收藏在博客主题的文章列表中，当填入数字时，数字越大，排名越靠前。
star: false
# 是否将该文章添加至文章列表中
article: false
# 是否将该文章添加至时间线中
timeline: false
index: false
date: 2022-02-08
dir:
    link: true
---
## 漏洞描述

命令注入漏洞就是后端代码使用了高危函数（PHP的eval，assert等），并且函数的参数可控的情况下，造成的命令注入漏洞。

## 漏洞原理

以下方代码为例（Windows环境）：

```php
<?php
    system("ping ".$_GET['ip']);
?>
```

访问以下链接：

```
http://127.0.0.1/ping.php?ip=8.8.8.8
```

![image-20230209230350158](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20230209230350158.png)

可以看到，服务器正常的ping了8.8.8.8

但是如果将8.8.8.8改成8.8.8.8|dir后，返回了当前的目录信息

![image-20230209230921587](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20230209230921587.png)

## PHP高危函数

**eval()：**将字符串按照 PHP 代码来计算。

```php
<?php @eval($_POST['cmd'])?>
```

**assert()：**直接将传入的参数当成PHP代码直接，不需要以分号结尾

```php
<?php @assert($_POST['cmd'])?>
```

**preg_replace('正则规则','替换字符'，'目标字符')：**正则匹配，但是模式为/e时，可以将**替换字符**当成PHP代码执行

```php
<?php preg_replace("/test/e",$_POST["cmd"],"jutst test");?>
```

**call_user_func()：**调用回调函数，并把一个数组参数作为回调函数的参数

```php
<?php call_user_func("assert",$_POST['cmd']);?>
```

**call_user_func_array()：** 一种特别的调用函数的方法

```php
<?php
    $cmd=$_POST['cmd'];
    $array[0]=$cmd;
    call_user_func_array("assert",$array);
?>
```

**create_function：**创建匿名函数执行代码

```php
<?php $func =create_function('',$_POST['cmd']);$func();?>
```

**array_map()：**函数将用户自定义函数作用到数组中的每个值上，并返回用户自定义函数作用后的带有新值的数组。

```php
<?php 
    $array[0]=$_POST['cmd'];
    echo array_map($_GET['func'],$array);
?>
```

**system()：**执行外部程序，并且显示输出

```php
<?php @system('ls');?>
```

**passthru()：**执行外部程序并且显示原始输出

```php
<?php
passthru ('echo $PATH');
?>
```

**exec()：**执行一个外部程序

```php
<?php
// 输出运行中的 php/httpd 进程的创建者用户名
// （在可以执行 "whoami" 命令的系统上）
$output=null;
$retval=null;
exec('whoami', $output, $retval);
echo "Returned with status $retval and output:\n";
print_r($output);
?>
```

**pcntl_exec()：**在当前进程空间执行指定程序

```php
<?php pcntl_exec(“/bin/bash”, array(“/tmp/b4dboy.sh”));?>
```

**shell_exec()：** 通过 shell 执行命令并将完整的输出以字符串的方式返回

```php
<?php
$output = shell_exec('ls -lart');
echo "<pre>$output</pre>";
?>
```

**popen()：**打开进程文件指针

```php
<?php
$file = popen("/bin/ls","r");
//some code to be executed
pclose($file);
?>
```

**``(反引号)：**反引号中间插代命令，执行系统命令，等价于shell_exec函数

```php
<?php
echo `ping www.baidu.com`;
```

**phpinfo()：**输出关于 PHP 配置的信息

```
<?php phpinfo()?>
```

### 修复建议

尽量不要使用以上的代码和高危函数，迫不得已的情况下最好对这些函数的参数进行严格的校验，例如上面的示例，就需要判断其是否为ip地址

```php
<?php
	function is_ip($str){
        $ip = explode('.', $str);
        if(count($ip) === 4){
            for($i = 0; $i < 4; $i++){
                if($ip[$i] > 255 || $ip[$i] < 1 || !is_numeric($ip[3])){
                    echo "请输入正确的ip";
                    exit;
                }
            }
        }else{
            echo "请输入正确的ip";
            exit;
        }
    }
    is_ip($_GET['ip']);
    system("ping ".$_GET['ip']);
?>
```

