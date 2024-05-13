export enum SPOT_ORDERS_HEADERS {
    SYMBOL = "symbol",
    SIDE = "side",
    TYPE = "type",
    QUANTITY = "quantity",
    LIMIT_PRICE = "limit_price",
    STOP_PRICE = "stop_price",
    LAST = "last",
    TOTAL = "total",
    STATUS = "status",
    ORDER_ID = "order_id",
    ORDER_TIME = "date",
    ACTION = "action"
}

export enum SPOT_ORDER_STATUS {
    WORKING = "Working",
    CANCELLED = "Cancelled",
    FILLED = "Filled",
}

export enum SPOT_ORDERS_TABS {
    ALL = "all",
    WORKING = "working",
    CANCELLED = "cancelled",
    FILLED = "filLed",
}

export enum TRAD_TYPE_NAME {
    LIMIT = "Limit",
    MARKET = "Market"
}
