import React from "react";

import {useSimulatorTradingContext} from "layouts/providers";

import FuturesOrders from "./Futures";

const BottomOrdersBar = () => {
    const {tradingType} = useSimulatorTradingContext()
    return (
        <div className="bottom-order-bar">
            {tradingType === "spot"
                ? ""
                : <FuturesOrders/>}
        </div>
    )
}

export default BottomOrdersBar