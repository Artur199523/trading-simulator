import React, {memo} from "react";
import {format} from "date-fns";

import {useSimulatorTradingChartDetailsContext} from "layouts/providers";
import {CURRENT_ORDER_TP_SL, interruptionRef, TRADE_TYPE} from "utils";

import Contracts from "../components/Contracts";
import TradeType from "../components/TradeType";
import {FlexibleTable} from "components";

const TPSL: React.FC = () => {

    const {currentOrdersTPSL} = useSimulatorTradingChartDetailsContext()
console.log(currentOrdersTPSL)
    const convertData = () => {
        const data = interruptionRef(currentOrdersTPSL)

        return data.map((order) => {
            const {contracts, color, quantity, trigger_price, order_price, trade_type, order_time, order_No} = order

            order.trigger_price = `TP ${trigger_price.tp} / SL ${trigger_price.sl}`
            order.quantity = quantity
            order.order_price = order_price
            order.order_time = format(order_time, "yyyy-MMM-dd hh:mm:ss")
            order.contracts = <Contracts value={contracts as string} color={color}/>
            order.trade_type = <TradeType value={trade_type as TRADE_TYPE} color={color}/>
            order.order_No = order_No
            order.action = <button>Cancel</button>

            return order
        })
    }

    return <FlexibleTable header={CURRENT_ORDER_TP_SL} body={convertData()}/>
}

export default memo(TPSL)