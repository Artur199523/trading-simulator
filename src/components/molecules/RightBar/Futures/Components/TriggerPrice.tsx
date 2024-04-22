import React from "react";
import {useSimulatorTradingChartDetailsContext} from "layouts/providers";

const TriggerPrice: React.FC = () => {
    const {longPositionDataTPSL, shortPositionDataTPSL} = useSimulatorTradingChartDetailsContext()

    const currentActivePosition = longPositionDataTPSL ? longPositionDataTPSL : shortPositionDataTPSL
    const stopTrigger = currentActivePosition.stop_trigger_price ? currentActivePosition.stop_trigger_price : "--"
    const profitTrigger = currentActivePosition.profit_trigger_price ? currentActivePosition.profit_trigger_price : "--"

    return (
        <div className="futures_trigger-price">
            <div>Trigger Price</div>
            <div>{profitTrigger} / {stopTrigger}</div>
        </div>
    )
}

export default TriggerPrice