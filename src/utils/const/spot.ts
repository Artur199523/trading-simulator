import {SPOT_ORDERS_HEADERS} from "../enums/spot";

export const SPOT_ALL_ORDERS = [
    {value: SPOT_ORDERS_HEADERS.SYMBOL, displayName: "Symbol"},
    {value: SPOT_ORDERS_HEADERS.SIDE, displayName: "Side"},
    {value: SPOT_ORDERS_HEADERS.TYPE, displayName: "Type"},
    {value: SPOT_ORDERS_HEADERS.QUANTITY, displayName: "Quantity", isFixed: 2},
    {value: SPOT_ORDERS_HEADERS.LIMIT_PRICE, displayName: "Limit Price", isFixed: 2, isFormat: true},
    {value: SPOT_ORDERS_HEADERS.STOP_PRICE, displayName: "Stop Price", isFixed: 2, isFormat: true},
    {value: SPOT_ORDERS_HEADERS.LAST, displayName: "Last"},
    {value: SPOT_ORDERS_HEADERS.STATUS, displayName: "Status"},
    {value: SPOT_ORDERS_HEADERS.ORDER_ID, displayName: "Order No"},
    {value: SPOT_ORDERS_HEADERS.ORDER_TIME, displayName: "Order Time"},
]

export const SPOT_WORKING_ACTION = {value: SPOT_ORDERS_HEADERS.ACTION, displayName: "Action"}