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