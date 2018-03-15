

<p align="center">Spring Boot Project Generator</p>


本项目为公司内部生成springBoot项目的测试脚手架。因为不涉及到公司项目属性，所以不遵从保密原则。

可用于springCloud，dubbo，dubbox，web，webservice等等项目。


## 主要功能 

- 聚合了Spring Cloud全家桶的基本功能. 
- 自定义package,避免RD不规范的复制项目来占用scope.
- springCloud，dubbo，dubbox，web，webservice等一站全有，如需拆分请自行控制。
- 可选项支持拓展(eg:config/redis/mysql/等)
- Dockerize支持
- 数据访问代码生成
- 一应俱全的UT/IT/压测配置（待完成）
- 更多的feature示例代码见git@git.chj.com:jinxin/wms.git. 


## USAGE
依赖 euraka,config-service两个服务，如不会git@git.chj.com:jinxin/wms.git，下载启动。

```
brew install node
npm install -g yo
npm install -g generator-chehejia-springboot
yo generator-chehejia-springboot
# 至此就安装成功了，下面是运行需要的依赖，比如建库建表
# ...
docker pull mysql
docker run --name mysql -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mysql
# 建库
使用软件访问mysql,新建一个database,名字是在创建过程中自己写的库名. 
支持flywaydb自动建表功能,只需建库不用建表，后续自己加表也建议直接写sql在/resource/db/migration/下.具体查看flywaydb的使用说明
# 即可使用RootApplication启动项目
```

## 开发环境
- MySQL 5.7.17
- Java8 with JCE
- Spring Cloud Edgware.RELEASE
- Spring Boot 1.5.9.RELEASE

## 模块说明
### app-web
    rest服务,web服务,rpc服务,ws服务等各种服务均可以放在此项目中，也可以根据使用方式进行项目拆分，但项目结构是一致的。
#### package结构
    ```
    ├─app
    │  │  
    │  ├─config----------------配置引入
    │  │ 
    │  ├─controller-----------------api入口
    │  │ 
    │  ├─domain-----------------数据持久对象,数据状态枚举
    │  │ 
    │  ├─exception---------------异常类型
    │  │   
    │  ├─model-------------------外部交互对象封装即状态枚举
    │  │   │
    │  │   ├─request-------------请求外部服务的对象封装
    │  │   │
    │  │   └─response-------------返回给外部服务的对象封装
    │  │
    │  ├─persistence---------------持久层
    │  │
    │  ├─service------------------服务层
    │  │
    │  └─Application--------------启动类入口
    │
    ```
### common-utils
    项目中用到的公共切面（日志，验证，请求等），公共model(request,response,swagger),公共持久层service层(crudMapper,CrudService),公共utils等。
### eureka-registry-ms
    eureka注册中心
### config-ms
    配置中心

## 运行
### 1.修改host
```shell
192.168.47.102 eureka
127.0.0.1 my_mysql
``` 
### 2.建库
- order库
    'jdbc:mysql://my_mysql:3306/order?useLegacyDatetimeCode=false&serverTimezone=Asia/Hong_Kong&useSSL=false'
- 首次启动时通过Flyway自动初始化数据库。

### 3.启动程序
    run RootApplication.java

## 功能说明

### 时间
    相信大家应该都知道，在实体Entity里面，可以使用java.sql.Date、java.sql.Timestamp、java.util.Date来映射到数据库的date、timestamp、datetime等字段
    但是，java.sql.Date、java.sql.Timestamp、java.util.Date这些类都不好用，很多方法都过时了。
    Java8里面新出来了一些API，LocalDate、LocalTime、LocalDateTime OffsetDateTime 非常好用
    OffsetDateTime类实际上组合了LocalDateTime类和ZoneOffset类。用来表示包含和格林威治或UTC时差的完整日期（年、月、日）和时间（时、分、秒、纳秒）信息。
    mybatis的支持：
    <groupId>org.mybatis</groupId> 
    <artifactId>mybatis-typehandlers-jsr310</artifactId> 
    配置好这个依赖之后，就可以把Entity里面的Date替换成LocalDate、LocalDateTime了
    查看generatorConfig.xml
    <columnOverride column="create_time" javaType="java.time.OffsetDateTime" isGeneratedAlways="true"/>

### Orika ----bean转换
    Orika是一个简单、快速的JavaBean拷贝框架，它能够递归地将数据从一个JavaBean复制到另一个JavaBean，这在多层应用开发中是非常有用的。在一般的测试中，Orika几乎和手工编写的代码一样高效，而且比Dozer的性能要高得多。
    简单封装orika, 实现深度转换Bean<->Bean的Mapper.
    请使用OrikaMapper来实现Domain<->dto<->pojo的相互转换
### JSON ----com.fasterxml.jackson
    @JsonNaming(PropertyNamingStrategy.LowerCaseStrategy.class)
    @JsonInclude(JsonInclude.Include.NON_NULL)
    @JsonIgnoreProperties(value = {"hibernateLazyInitializer", "handler", "fieldHandler"}, ignoreUnknown = true)
    转化并不使用camel而用snake策略:
    productId 变量的转换差别
    camel:ProductId
    snake:product_id
### valid
    @URL @Email @Length @NotBlank @NotEmpty 。。。。。还有很多google it
    
### FaultBarrier
    封装成实体ErrorEntity后转换成JSON输出
### Shift.fatal
    异常不要throw,要Shift.fatal
### 多个通用切面
#### HibernateValidatorAspect ---- 统一验证切面，不用自己处理验证异常
    校验参数合法性, 自动向Map封装错误信息.自动将错误信息返回给前台
#### RequestIdStuffAspect ---- RequestId生成
    凡是RequestHeader中不带requestId的，在response中都会返回：
      "headers" : {
        "X-Request-Id" : "x-cbb44ba3-bb4b-4f8a-9005-9f040e383e07",
        "X-Application-Context" : "chehejia-test-zzzz:9090"
      }
#### RequestLoggingAspect ---- 日志切面
```

    REQUEST->
    {
      "request_id" : "x-d6a1cde1-1bcd-466f-9e6f-f381fc2090d4",
      "url" : "http://127.0.0.1:9090/api/v1/orders",
      "method" : "POST",
      "params_map" : { },
      "headers" : {
        "Origin" : "http://127.0.0.1:9090",
        "Cookie" : "UM_distinctid=15e762fe8aea9-092b8d9b519d-31637e01-1aeaa0-15e762fe8af943; CNZZDATA1260466344=1557656829-1505219424-http%253A%252F%252F127.0.0.1%253A8080%252F%7C1505219424; CNZZDATA1258389938=1095694787-1507603191-http%253A%252F%252F127.0.0.1%253A8086%252F%7C1508747828; wp-settings-time-1=1509730271; cookie_lang=1",
        "Accept" : "application/json;charset=UTF-8",
        "User-Agent" : "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_13_3) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/63.0.3239.132 Safari/537.36",
        "Connection" : "keep-alive",
        "Referer" : "http://127.0.0.1:9090/swagger-ui.html",
        "Host" : "127.0.0.1:9090",
        "Accept-Language" : "zh-CN,zh;q=0.9,en;q=0.8",
        "Accept-Encoding" : "gzip, deflate, br",
        "Content-Length" : "37",
        "Content-Type" : "application/json;charset=UTF-8"
      },
      "api_desc" : "下单",
      "request_body" : {
        "product_id" : 1,
        "user_id" : 1
      },
      "request_time" : "2018-01-31T09:59:15.825+08:00",
      "response_time" : "2018-01-31T09:59:20.897+08:00",
      "character_encoding" : "UTF-8",
      "content_length" : 37,
      "remote_host" : "127.0.0.1",
      "remote_port" : 65431
    }
    RESPONSE->
     {
      "headers" : {
        "X-Request-Id" : "x-d6a1cde1-1bcd-466f-9e6f-f381fc2090d4",
        "X-Application-Context" : "chehejia-test-zzzz:9090"
      },
      "response_body" : {
        "code" : 42006,
        "msg" : "余额不足"
      }
    }

```
### dubbo 
    引入dubbo-spring-boot-starter
    使用方法:
    https://github.com/dubbo/dubbo-spring-boot-project
    亮点：
    starter自动引入了dubbo-spring-boot-actuator，启动方法需配置endpoints.dubbo.enabled = true
    Actuator endpoint dubbo supports Spring Web MVC Endpoints :
    /dubbo	            GET	Exposes Dubbo's meta data	       application/json
    /dubbo/properties	GET	Exposes all Dubbo's Properties	   application/json
    /dubbo/services	    GET	Exposes all Dubbo's ServiceBean	   application/json
    /dubbo/references	GET	Exposes all Dubbo's ReferenceBean  application/json
    /dubbo/configs	    GET	Exposes all Dubbo's *Config	       application/json
    /dubbo/shutdown	    POST Shutdown Dubbo services	       application/json

## 备忘 --发布

```
npm publish .
npm install -g generator-chehejia-springboot
```

