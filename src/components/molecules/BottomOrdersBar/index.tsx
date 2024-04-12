import React from "react";
import {useSimulatorTradingContext} from "layouts/providers";

import FuturesOrders from "./Futures";
import {BottomBar} from "components";

const BottomOrdersBar = () => {
    const {tradingType} = useSimulatorTradingContext()
    return (
        <div className="bottom-order-bar">
            {tradingType === "spot"
                ? <BottomBar/>
                : <FuturesOrders/>}
        </div>
    )
}

export default BottomOrdersBar