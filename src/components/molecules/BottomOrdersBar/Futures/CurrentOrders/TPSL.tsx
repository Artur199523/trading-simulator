import React, {memo} from "react";
import {format} from "date-fns";

import {CURRENT_ORDER_TP_SL, interruptionRef, ORDER_STATUS, showNotification, TRADE_TYPE, TRIGGER_PRICE_TYPE} from "utils";
import {useSimulatorTradingChartDetailsContext} from "layouts/providers";

import Contracts from "../components/Contracts";
import {FlexibleTable} from "components";

import {CurrentOrdersTPSLITF, OrderHistoryTPSLITF} from "layouts/providers/type";
import TradeType from "../components/TradeType";

const TPSL: React.FC = () => {

    const {
        currentOrdersTPSL,
        serOrderHistoryTPSL,
        setCurrentOrdersTPSL,
        setConfirmedLongPositionDataTPSL,
        setConfirmedShortPositionDataTPSL
    } = useSimulatorTradingChartDetailsContext()

    const removeOrder = (orderIndex: number, order: CurrentOrdersTPSLITF) => {
        const {contracts, color, quantity_value, trigger_price, order_price, trade_type, order_No} = order

        setCurrentOrdersTPSL(prev => prev.filter((order, index) => index !== orderIndex))

        const generatedHistory: OrderHistoryTPSLITF = {
            color: color,
            order_No: order_No,
            contracts: contracts,
            trade_type: trade_type,
            order_time: new Date(),
            status: ORDER_STATUS.CANCELED,
            trigger_price: trigger_price.tp,
            trigger_price_type: TRIGGER_PRICE_TYPE.PROFIT,
            filled_actual_qty: {filled: 0, actual_qty: Number(quantity_value)},
            filled_price_order_price: {filled_price: "--", order_price: order_price}
        }

        if (trade_type === TRADE_TYPE.CLOSE_LONG) {
            setConfirmedLongPositionDataTPSL(null)
        } else {
            setConfirmedShortPositionDataTPSL(null)
        }

        serOrderHistoryTPSL(prev =>
            [{...generatedHistory}, {...generatedHistory, trigger_price: trigger_price.sl, trigger_price_type: TRIGGER_PRICE_TYPE.STOP}, ...prev]
        )

        showNotification("Order removed successfully", "success", 0)
    }

    const convertData = () => {
        const data = interruptionRef(currentOrdersTPSL)

        return data.map((order, index: number) => {
            const currentOrderCopy = interruptionRef(order)

            const {contracts, color, quantity, trigger_price, order_price, trade_type, order_time, order_No} = order

            order.quantity = quantity
            order.order_No = order_No
            order.order_price = order_price
            order.order_time = format(order_time, "yyyy-MMM-dd hh:mm:ss")
            order.trigger_price = `TP ${trigger_price.tp} / SL ${trigger_price.sl}`
            order.contracts = <Contracts value={contracts as string} color={color}/>
            order.trade_type = <TradeType value={trade_type as TRADE_TYPE} color={color}/>
            order.action = <button onClick={() => removeOrder(index, currentOrderCopy)}>Cancel</button>

            return order
        })
    }

    return <FlexibleTable header={CURRENT_ORDER_TP_SL} body={convertData()}/>
}

export default memo(TPSL)