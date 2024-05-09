import React, {memo} from "react";
import {format} from "date-fns";

import {fixedNumber, interruptionRef, ORDER_HISTORY_TP_SL, TRADE_TYPE, TRIGGER_PRICE_TYPE} from "utils";
import {useSimulatorTradingChartDetailsContext} from "layouts/providers";

import Contracts from "../components/Contracts";
import {FlexibleTable} from "components";

import TradeType from "../components/TradeType";

const TPSL: React.FC = () => {
    const {orderHistoryTPSL} = useSimulatorTradingChartDetailsContext()

    const convertData = () => {
        const data = interruptionRef(orderHistoryTPSL)

        return data.map((order) => {
            const {color, status, order_No, contracts, trade_type, order_time, trigger_price, trigger_price_type} = order
            const {filled_price, order_price} = order.filled_price_order_price
            const {filled, actual_qty} = order.filled_actual_qty

            order.status = status
            order.order_No = order_No
            order.filled_actual_qty = `${filled}/${fixedNumber(actual_qty, 2)}`
            order.contracts = <Contracts value={contracts} color={color}/>
            order.filled_price_order_price = `${filled_price}/${order_price}`
            order.order_time = format(order_time, "yyyy-MMM-dd hh:mm:ss")
            order.trade_type = <TradeType value={trade_type as TRADE_TYPE} color={color}/>
            order.trigger_price = trigger_price_type === TRIGGER_PRICE_TYPE.PROFIT ? `<=${trigger_price}` : `>=${trigger_price}`

            return order
        })
    }

    return <FlexibleTable header={ORDER_HISTORY_TP_SL} body={convertData()}/>
}

export default memo(TPSL)