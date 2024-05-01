import React from "react";

import {useSimulatorTradingChartDetailsContext} from "layouts/providers";
import {fixedNumber, interruptionRef, ORDER_HISTORY_MARKET_LIMIT} from "utils";

import Contracts from "./components/Contracts";
import TradeType from "./components/TradeType";
import {FlexibleTable} from "components";
import {format} from "date-fns";

const LimitMarket: React.FC = () => {
    const {orderHistoryLimitMarket} = useSimulatorTradingChartDetailsContext()

    const convertData = () => {
        const data = interruptionRef(orderHistoryLimitMarket)
        return data.map((order) => {
            const {contracts, color, filled_price_order_price, filled_total, trade_type, order_time} = order
            const {filled_price, order_price} = filled_price_order_price
            const {filled, total} = filled_total

            order.filled_total = `${fixedNumber(filled, 2)}/${fixedNumber(total, 2)}`
            order.order_time = format(order_time, "yyyy-MMM-dd hh:mm:ss")
            order.contracts = <Contracts value={contracts} color={color}/>
            order.trade_type = <TradeType value={trade_type} color={color}/>
            order.filled_price_order_price = `${filled_price}/${order_price}`

            return order
        })
    }

    return <FlexibleTable header={ORDER_HISTORY_MARKET_LIMIT} body={convertData()}/>
}

export default LimitMarket