import React from "react";

import {format} from "date-fns";

import {useSimulatorTradingChartDetailsContext} from "layouts/providers";
import {fixedNumber, interruptionRef, TRADE_HISTORY} from "utils";

import {FlexibleTable} from "components";

import Contracts from "../components/Contracts";
import TradeType from "../components/TradeType";

const TradeHistory: React.FC = () => {
    const {tradeHistory} = useSimulatorTradingChartDetailsContext()

    const convertData = () => {
        const data = interruptionRef(tradeHistory)

        return data.map((order) => {
            const {contracts, color, filled_price_order_price, filled_total, trade_type, transaction_time} = order
            const {filled_price, order_price} = filled_price_order_price
            const {filled, total} = filled_total

            order.filled_total = `${fixedNumber(filled, 2)}/${fixedNumber(total, 2)}`
            order.transaction_time = format(transaction_time, "yyyy-MMM-dd hh:mm:ss")
            order.contracts = <Contracts value={contracts} color={color}/>
            order.trade_type = <TradeType value={trade_type} color={color}/>
            order.filled_price_order_price = `${filled_price}/${order_price}`

            return order
        })
    }

    return <FlexibleTable header={TRADE_HISTORY} body={convertData()}/>
}

export default TradeHistory