package <%=fullApp%>.controller;

import com.chehejia.common.model.response.Response;
import io.swagger.annotations.Api;
import io.swagger.annotations.ApiOperation;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

/**
 * 用于生成SWAGGER文档中的全局状态码
 *
 */
@Api(tags = "order_status", description = "订单状态码列表")
@RestController
public class OrderStatusGenerator {

    @ApiOperation(value = "状态码列表")
    @RequestMapping(value = "/order_status", method = RequestMethod.OPTIONS)
    public Response requireStatusCodes() {
        return null;
    }

}
