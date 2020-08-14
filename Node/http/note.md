### 什么是HTTP？应用层
- 通常的网络是在TCP/IP协议族的基础上来运作的，http是一个子集

### TCP/IP协议族（HTTP应用层协议在传输层的基础上增加了一些自己的内容）
- 协议简单来说就是通信的规则。例如：通信时谁先发起请求，怎样结束，如何进行通信。把互联网相关的协议统称起来称为TCP/IP

### 协议分层（OSI协议分层）
- 物理层 、 数据链路层  (统称为链路层，网线、硬件)
- 网络层   （识别路线，找到要访问的ip地址，找到目标）
- 传输层 （传输层常见的协议有：tcp协议（可靠，http基于tcp）和udp协议（快、可能存在丢包的情况，一般用于dns解析））   
- 会话层、表示层、应用层 （统称为应用层）
 
### http特点
- http 是不保存状态的协议，使用cookie来管理状态
- http 1.1 使用长连接的形式 keep-alive不会断开链接，复用的策略
- 默认管线化 （不是一个个请求，而是并发请求）。针对同一个域名

### http缺点
- 不安全，无法验证返回数据的完整性，解决方案 https

### http的发起
- 浏览器
- postman
- curl 默认需要先安装git
    - curl -v www.baidu,com （-v是希望看到详细信息的意思）
    - curl -v -X POST www.baidu.com （-X 指定发送请求的形式）
    - curl -v --data a=1 www.baidu.com （--data 指定要发给接口的数据）

### http的请求方法 （根据不同的请求方式来写接口叫restful风格）
- get 通过url来传递数据 （获取） 
- post 通过请求体传递数据（增加） 
- delete 删除                  
- put 修改
- options （预检请求，只有在跨域的情况下复杂请求会发）
> get和post都是简单请求，如果增加了自定义了header就会变成复杂请求，其他方法都是复杂请求 如果发送的是复杂请求默认会发送options请求。

### 请求中 数据分为三部分（请求报文）
- 请求行（可以通过?传递参数） 请求方法 请求路径（pathname后面，hash前面的内容） http version
    ```
    GET    /   HTTP/1.1
    ```
- 请求头（可以传递数据，自定义的header）
    ```
    Host: www.baidu.com
    User-Agent: curl/7.65.3
    Accept: */*
    Range:bytes=0-5
    ```
- 请求体（可以传数据）

### 响应中  数据分为三部分
- 响应行  http version  状态码  响应短语
    ```
    HTTP：1.1  302  Moved Temporarily
    ```
- 响应头  一些自定义响应信息。如cookie、主机ip、server类型
- 响应体  返回给浏览器的内容


