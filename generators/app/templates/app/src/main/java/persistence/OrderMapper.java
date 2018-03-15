package <%=fullApp%>.persistence;

import com.chehejia.common.MyBatisRepository;
import <%=fullApp%>.domain.Order;
import com.chehejia.common.persistence.CrudMapper;

@SuppressWarnings("InterfaceNeverImplemented")
@MyBatisRepository
public interface OrderMapper extends CrudMapper<Order> {

}