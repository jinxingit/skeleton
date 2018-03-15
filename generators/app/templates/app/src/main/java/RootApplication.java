package com.chehejia;

<% if (mysql) { %>
import com.chehejia.common.MyBatisRepository;
<% } %>
import lombok.extern.slf4j.Slf4j;
import org.mybatis.spring.annotation.MapperScan;
import org.springframework.boot.SpringApplication;
<% if (eureka) { %>
import org.springframework.cloud.client.SpringCloudApplication;
import org.springframework.cloud.netflix.feign.EnableFeignClients;
<% } else { %>
import org.springframework.boot.autoconfigure.SpringBootApplication;
<% } %>
import org.springframework.core.env.Environment;
import java.net.InetAddress;
@Slf4j
<% if (eureka) { %>
@EnableFeignClients
@SpringCloudApplication
<% } else { %>
@SpringBootApplication
<% } %>
<% if (mysql) { %>
@MapperScan(basePackages = "<%=fullApp%>.persistence", annotationClass = MyBatisRepository.class)
<% } %>
public class RootApplication {

    public static void main(String[] args) throws Exception{
        SpringApplication app = new SpringApplication(RootApplication.class);
        //ApplicationContext ctx = app.run(args);
        Environment env = app.run(args).getEnvironment();

        log.info("\n----------------------------------------------------------\n\t" +
                        "<%=fullApp%> Application '{}' is running! Access URLs:\n\t" +
                        "Local: \t\thttp://127.0.0.1:{}\n\t" +
                        "External: \thttp://{}:{}\n\t" +
                        "Swagger API:http://127.0.0.1:{}/swagger-ui.html\n\t" +
                        "Druid index:http://127.0.0.1:{}/druid/index.html\n" +
                        "----------------------------------------------------------",
                env.getProperty("spring.application.name"),
                env.getProperty("server.port"),
                InetAddress.getLocalHost().getHostAddress(),
                env.getProperty("server.port"),
                env.getProperty("server.port"),
                env.getProperty("server.port"));
    }
}
