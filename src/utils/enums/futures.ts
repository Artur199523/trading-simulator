export enum TRIGGERS_TEXT {
    ROI = "ROI (%)",
    CHANGE = "Change (%)",
    PL = "P&L"
}

export enum TRIGGERS {
    ROI = "ROI",
    CHANGE = "CHANGE",
    PL = "PL"
}

export enum TRADE_POSITION {
    LONG = "Long",
    SHORT = "Short"
}

export enum ORDER_TYPE {
    PROFIT = "profit",
    STOP = "stop"
}

export enum HEDGING {
    OPEN = "open",
    CLOSE = "close"
}

export enum MARGIN_MODE {
    CROSS = "Cross",
    ISOLATED = "Isolated",
    PORTFOLIO = "Portfolio"
}

export enum MODALS {
    CLOSE = "",
    TP_SL = "TP/SL",
    RISK_ALERT = "risk-alert",
    MARGIN_MODE = "margin-mode",
    POSITION_MODE = "position-mode",
    ADJUST_LEVERAGE = "adjust-leverage",
    CONFIRM_POSITION = "confirm-position",
    CLOSE_POSITION_MARKET = "close-position-market",
    ORDER_PLACEMENT_PREFERENCES = "order-placement-preferences"
}

export enum POSITION_MODE {
    HEDGE = "hedge",
    ONE_WAY = "one_way"
}

export enum TRAD_TYPE {
    LIMIT = "limit",
    MARKET = "market"
}

export enum POSITION_HEADERS {
    IM = "im",
    MM = "mm",
    TP_SL = "tp_sl",
    VALUE = "value",
    QUANTITY = "quantity",
    CLOSE_BY = "close_by",
    CONTRACTS = "contracts",
    MMR_CLOSE = "mmr_close",
    MARK_PRICE = "mark_price",
    ENTRY_PRICE = "entry_price",
    REALIZED_PL = "realized_pl",
    UNREALIZED_PL = "unrealized_pl",
    TRAILING_STOP = "trailing_stop",
    LIQUIDITY_PRICE = "liquidity_price",
    REVERSE_POSITION = "reverse_position"
}

export enum ORDER_ACTIVE_TAB {
    PL = "pl",
    POSITION = "position",
    CURRENT_ORDERS = "current_orders",
    ORDER_HISTORY = "order_history",
    TRADE_HISTORY = "trade_history",
}

export enum CALL_ENVIRONMENT {
    OUTSIDE = "outside",
    INSIDE = "inside"
}

export enum TRADE_TYPE {
    CLOSE_LONG = "Close Long",
    CLOSE_SHORT = "Close Short",
    OPEN_LONG = "Open Long",
    OPEN_SHORT = "Open Short"
}

export enum EXIST_TYPE {
    TRADE = "Trade"
}

export enum ORDER_STATUS {
    FILLED = "Filled",
    CANCELED = "Canceled",
}

export enum ORDER_HISTORY_MARKET_LIMIT_HEADERS {
    FILLED_PRICE_ORDER_PRICE = "filled_price_order_price",
    CONTRACTS = "contracts",
    FILLED_TOTAL = "filled_total",
    TRADE_TYPE = "trade_type",
    ORDER_TYPE = "order_type",
    STATUS = "status",
    ORDER_NO = "order_No",
    ORDER_TIME = "order_time",
}

export enum ORDER_HISTORY_ACTIVE_TAB {
    LIMIT_MARKET = "limit_market",
    CONDITIONAL = "conditional",
    TP_SL = "tp_sl",
    TRAILING_STOP = "trailing_stop",
    MMR_CLOSE = "mmr_close",
}

export enum CURRENT_ORDERS_ACTIVE_TAB {
    ACTIVE = "active",
    CONDITIONAL = "conditional",
    TP_SL = "tp_sl",
    TRAILING_STOP = "trailing_stop",
    MMR_CLOSE = "mmr_close",
}

export enum ORDER_HISTORY_GLOBAL_HEADERS {
    CONTRACTS = "contracts",
    FILLED_ACTUAL_QTY = "filled_actual_qty",
    FILLED_PRICE_ORDER_PRICE = "filled_price_order_price",
    TRIGGER_PRICE = "trigger_price",
    TRADE_TYPE = "trade_type",
    STATUS = "status",
    ORDER_NO = "order_No",
    ORDER_TIME = "order_time"
}

export enum TRADE_HISTORY_HEADERS {
    CONTRACTS = "contracts",
    FILLED_TOTAL = "filled_total",
    FILLED_PRICE_ORDER_PRICE = "filled_price_order_price",
    TRADE_TYPE = "trade_type",
    ORDER_TYPE = "order_type",
    FILLED_TYPE = "filled_type",
    TRANSACTION_ID = "transaction_id",
    TRANSACTION_TIME = "transaction_time"
}

export enum PROFIT_LOSS_HEADERS {
    CONTRACTS = "contracts",
    QUANTITY = "quantity",
    ENTRY_PRICE = "entry_price",
    EXIT_PRICE = "exit_price",
    TRADE_TYPE = "trade_type",
    CLOSED_PL = "closed_pl",
    EXIT_TYPE = "exit_type",
    TRADE_TIME = "trade_time",
}

export enum CURRENT_ORDER_ACTIVE_HEADERS {
    CONTRACTS = "contracts",
    QUANTITY = "quantity",
    ORDER_PRICE = "order_price",
    FILLED_TOTAL = "filled_total",
    TP_SL = "tp_sl",
    TRADE_TYPE = "trade_type",
    ORDER_TYPE = "order_type",
    REDUCE_ONLY = "reduce_only",
    STATUS = "status",
    ORDER_NO = "order_No",
    ORDER_TIME = "order_time",
    ACTION = "action"
}

export enum CURRENT_ORDER_CONDITIONAL_HEADERS {
    CONTRACTS = "contracts",
    QUANTITY = "quantity",
    TRIGGER_PRICE = "trigger_price",
    PRICE_DISTANCE = "price_distance",
    ORDER_PRICE = "order_price",
    TP_SL = "tp_sl",
    TRADE_TYPE = "trade_type",
    REDUCE_ONLY = "reduce_only",
    STATUS = "status",
    ORDER_NO = "order_No",
    ORDER_TIME = "order_time",
    ACTION = "action",
}

export enum CURRENT_ORDER_TP_SL_HEADERS {
    CONTRACTS = "contracts",
    QUANTITY = "quantity",
    TRIGGER_PRICE = "trigger_price",
    ORDER_PRICE = "order_price",
    TRADE_TYPE = "trade_type",
    ORDER_NO = "order_No",
    ORDER_TIME = "order_time",
    ACTION = "action",
}

export enum CURRENT_ORDER_TRAILING_STOP_HEADERS {
    CONTRACTS = "contracts",
    QUANTITY = "quantity",
    ORDER_PRICE = "order_price",
    TRIGGER_PRICE = "trigger_price",
    PRICE_DISTANCE = "price_distance",
    RETRACEMENT = "retracement",
    ACTIVATION_PRICE = "activity_price",
    TRADE_TYPE = "trade_type",
    STATUS = "status",
    ORDER_NO = "order_No",
    ORDER_TIME = "order_time",
    ACTION = "action",
}

export enum CURRENT_ORDER_MMR_CLOSE_HEADERS {
    CONTRACTS = "contracts",
    QUANTITY = "quantity",
    TRIGGER_MMR = "trigger_mmr",
    ORDER_PRICE = "order_price",
    TRADE_TYPE = "trade_type",
    STATUS = "status",
    ORDER_NO = "order_No",
    ORDER_TIME = "order_time",
    ACTION = "action",
}