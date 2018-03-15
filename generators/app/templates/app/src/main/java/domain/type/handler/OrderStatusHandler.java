package <%=fullApp%>.domain.type.handler;

import com.chehejia.common.domain.type.handler.GenericTypeHandler;
import <%=fullApp%>.domain.type.OrderStatus;

/**
 * @author Jinxin
 */
public class OrderStatusHandler extends GenericTypeHandler<OrderStatus> {

    @Override
    public int getEnumIntegerValue(OrderStatus parameter) {
        return parameter.getCode();
    }
}
