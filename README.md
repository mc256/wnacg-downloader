# wnacg-downloader
绅士漫画下载器，这是node.js版本。

## 安装
1. 确保你安装了node.js。
2. ```npm install -g request```
3. ```npm install -g cheerio```

## 使用
1. 到漫画主页，找到网址中的唯一id（一般为5位长数字）。
2. 编辑 wnacg.js ，将需要下载的id填入main函数中的clist列表。
3. 运行脚本。

## 特点
+ 自动建立文件夹，自动排序命名，利于显示。
+ 多张图片并行下载，效率高。
+ 支持使用代理，可以编辑proxy变量为代理端口。
+ 可以一次下载多部作品。
+ 可以看到下载进度。
