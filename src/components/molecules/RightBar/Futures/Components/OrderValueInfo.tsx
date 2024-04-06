import React from "react"
import {OrderValueITF} from "../type";
import {useSimulatorOptionsContext, useSimulatorTradingChartDetailsContext, useSimulatorTradingContext} from "layouts/providers";

const OrderValueInfo: React.FC<OrderValueITF> = ({orderValue,orderPrice}) => {
    const {currentCryptoData} = useSimulatorTradingChartDetailsContext()
    const {adjustLeverage} = useSimulatorTradingContext()
    const {cryptoType} = useSimulatorOptionsContext()

    const orderCurrentPrice = orderPrice ?? currentCryptoData.close

    const orderValueQuantity = orderValue ? (orderValue / orderCurrentPrice).toFixed(2) : "--"
    const orderValueCost = orderValue ? (orderValue / adjustLeverage).toFixed(2) : "--"

    return (
        <div className="futures_order-value-info">
            <div className="futures_order-value-info_quantity">
                <div>Qty</div>
                <div><span>{orderValueQuantity}</span> / <span>{orderValueQuantity}</span> {cryptoType}</div>
            </div>
            <div className="futures_order-value-info_cost">
                <div>Cost</div>
                <div><span>{orderValueCost}</span> / <span>{orderValueCost} </span> USDT</div>
            </div>
        </div>
    )
}

export default OrderValueInfo