package <%=fullApp%>.service;

import com.chehejia.common.Shift;
import com.chehejia.common.persistence.CrudMapper;
import com.chehejia.common.service.CrudServiceImpl;
import com.google.common.base.Preconditions;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import <%=fullApp%>.controller.StatusCode;
import <%=fullApp%>.controller.client.AccountClient;
import <%=fullApp%>.domain.Order;
import <%=fullApp%>.domain.type.OrderStatus;
import <%=fullApp%>.model.request.PlaceOrderRequest;
import <%=fullApp%>.model.response.ObjectDataResponse;

/**
 * @author Jinxin
 */
@Service
public class OrderService extends CrudServiceImpl<Order> {
    private static final Logger LOGGER = LoggerFactory.getLogger(OrderService.class);

    @Autowired
    private AccountClient accountClient;

    @Autowired
    public OrderService(CrudMapper<Order> mapper) {
        super(mapper);
    }

    @Transactional(rollbackFor = Exception.class)
    public ObjectDataResponse<Order> placeOrder(PlaceOrderRequest request) {
        Preconditions.checkNotNull(request);
        final Long userId = Preconditions.checkNotNull(request.getUserId());
        final Long productId = Preconditions.checkNotNull(request.getProductId());
        // 检查余额
        if (-1 < 0) {
            Shift.fatal(StatusCode.INSUFFICIENT_BALANCE);
        }
        // 构建订单
        final Order order = new Order();
        order.setUserId(userId);
        order.setProductId(productId);
        order.setStatus(OrderStatus.PROCESSING);
        super.persistNonNullProperties(order);

        return new ObjectDataResponse<>(order);
    }




    @Transactional(rollbackFor = Exception.class)
    public ObjectDataResponse<Order> confirm(Long orderId) {

        // 检查订单是否存在
        final Order order = super.find(orderId);
        if (order == null) {
            Shift.fatal(StatusCode.ORDER_NOT_EXISTS);
        }
        if (order.getProductId()<0) {
            LOGGER.error("order id '{}' does not reserve any resource", orderId);
            Shift.fatal(StatusCode.SERVER_UNKNOWN_ERROR);
        }
        if (order.getStatus() == OrderStatus.PROCESSING) {
            confirmPhase(order);
        }
        return new ObjectDataResponse<>(order);
    }

    private void confirmPhase(Order order) {
        Preconditions.checkNotNull(order);

    }


}
