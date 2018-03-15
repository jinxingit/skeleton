# <%=projectName%> 

刚刚生成的项目并不能直接运行,我们需要准备一个mysql环境.

我们可以

```
docker pull mysql
docker run --name mysql -e MYSQL_ROOT_PASSWORD=root -p 3306:3306 -d mysql
```

在本地简单的启动一个mysql实例用于测试工程

使用软件访问mysql,新建一个database,名字是在创建过程中自己写的库名. 

支持flywaydb自动建表功能,只需建库不用建表，后续自己加表也建议直接写sql在/resource/db/migration/下.具体查看flywaydb的使用说明

将项目导入idea,推荐环境是jdk8

运行RootApplication进行项目启动.
