import React from "react";

import {useFuturesTradingModalContext, useSimulatorTradingChartDetailsContext} from "layouts/providers";
import {MODALS, showNotification, TRADE_POSITION} from "utils";
import {OrderClosedByITF} from "../type";

const OrderClosedBy: React.FC<OrderClosedByITF> = ({positionType}) => {
    const {setCurrentModal} = useFuturesTradingModalContext()
    const {confirmedShortPositionData, confirmedLongPositionData} = useSimulatorTradingChartDetailsContext()

    const closePositionMarket = () => {
        setCurrentModal(MODALS.CLOSE_POSITION_MARKET)
        const currentConfirmPositionData = positionType === TRADE_POSITION.LONG ? confirmedLongPositionData : confirmedShortPositionData

        console.log(currentConfirmPositionData)
    }
//@TODO continue for closing the position
    return (<div>
        <button onClick={() => showNotification("Not available yet", "info", 0)}>Limit</button>
        &nbsp;
        <button onClick={() => closePositionMarket()}>Market</button>
    </div>)
}

export default OrderClosedBy