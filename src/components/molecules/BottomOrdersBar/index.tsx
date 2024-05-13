import React from "react";

import {useSimulatorTradingContext} from "layouts/providers";

import FuturesOrders from "./Futures";
import SpotOrders from "./Spot";

const BottomOrdersBar = () => {
    const {tradingType} = useSimulatorTradingContext()
    return (
        <div className="bottom-order-bar">
            {tradingType === "spot"
                ? <SpotOrders/>
                : <FuturesOrders/>}
        </div>
    )
}

export default BottomOrdersBar