import React from "react"

import {useSimulatorOptionsContext, useSimulatorTradingChartDetailsContext, useSimulatorTradingContext} from "layouts/providers";
import {calculationOrderCostLongPosition, calculationOrderCostShortPosition} from "utils";

import {OrderValueITF} from "../type";

const OrderValueInfo: React.FC<OrderValueITF> = ({orderValue, orderPrice}) => {
    const {currentCryptoData} = useSimulatorTradingChartDetailsContext()
    const {adjustLeverage} = useSimulatorTradingContext()
    const {cryptoType} = useSimulatorOptionsContext()

    const orderCurrentPrice = orderPrice ?? currentCryptoData.close

    const orderValueQuantity = orderValue ? (orderValue / orderCurrentPrice).toFixed(2) : "--"
    const orderCostLong = orderValue ? calculationOrderCostLongPosition(orderValue, adjustLeverage, 0.055).toFixed(2) : "--"
    const orderCostShort = orderValue ? calculationOrderCostShortPosition(orderValue, adjustLeverage, 0.055) : "--"

    return (
        <div className="futures_order-value-info">
            <div className="futures_order-value-info_quantity">
                <div>Qty</div>
                <div><span>{orderValueQuantity}</span> / <span>{orderValueQuantity}</span> {cryptoType}</div>
            </div>
            <div className="futures_order-value-info_cost">
                <div>Cost</div>
                <div><span>{orderCostLong}</span> / <span>{orderCostShort} </span> USDT</div>
            </div>
        </div>
    )
}

export default OrderValueInfo