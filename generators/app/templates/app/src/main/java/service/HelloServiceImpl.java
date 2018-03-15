package <%=fullApp%>.service;

import com.alibaba.dubbo.config.annotation.Service;
import lombok.extern.slf4j.Slf4j;

/**
 * 测试实现类
 *
 * @author jinxin
 * @create 2018-01-24-下午4:05
 */
@Slf4j
@Service(
    version = "1.0.0",
    application = "${dubbo.application.id}",
    protocol = "${dubbo.protocol.id}",
    registry = "${dubbo.registry.id}"
)
public class HelloServiceImpl implements HelloService {

    @Override
    public void sayHello(String name) {
        log.info("你好啊!{}",name);
    }
}
