package <%=fullApp%>.domain.type;

/**
 * @author Jinxin
 */
public enum OrderStatus {

    PROCESSING(0), DONE(1), TIMEOUT(2), CONFLICT(3);

    private final int code;

    OrderStatus(int code) {
        this.code = code;
    }

    public int getCode() {
        return code;
    }

}
