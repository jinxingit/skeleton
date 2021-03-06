package <%=fullApp%>.model.request;

import com.chehejia.common.model.request.RestfulRequest;
import com.fasterxml.jackson.annotation.JsonIgnoreProperties;
import com.fasterxml.jackson.annotation.JsonInclude;
import com.fasterxml.jackson.databind.PropertyNamingStrategy;
import com.fasterxml.jackson.databind.annotation.JsonNaming;
import io.swagger.annotations.ApiModelProperty;
import lombok.*;

import javax.validation.constraints.Max;
import javax.validation.constraints.Min;
import javax.validation.constraints.NotNull;

/**
 * @author Jinxin
 */
@Getter
@Setter
@NoArgsConstructor
@ToString
@EqualsAndHashCode(callSuper = true)
@JsonNaming(PropertyNamingStrategy.SnakeCaseStrategy.class)
@JsonInclude(JsonInclude.Include.NON_NULL)
@JsonIgnoreProperties(value = {"hibernateLazyInitializer", "handler", "fieldHandler"}, ignoreUnknown = true)
public class PlaceOrderRequest extends RestfulRequest {

    private static final long serialVersionUID = -7089168357959601473L;

    @NotNull
    @Min(1)
    @ApiModelProperty(value = "产品ID", required = true, example = "1")
    private Long productId;

    @NotNull
    @Min(1)
    @Max(100)
    @ApiModelProperty(value = "用户ID", required = true, example = "1")
    private Long userId;

}
