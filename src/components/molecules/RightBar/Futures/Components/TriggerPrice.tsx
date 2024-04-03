import React from "react";
import {useSimulatorTradingContext} from "layouts/providers";

const TriggerPrice:React.FC = () => {
    const {longPositionData,shortPositionData} = useSimulatorTradingContext()

    const currentActivePosition = longPositionData ? longPositionData : shortPositionData
    const stopTrigger = currentActivePosition.stop_trigger_price ? currentActivePosition.stop_trigger_price : "--"
    const profitTrigger = currentActivePosition.profit_trigger_price ? currentActivePosition.profit_trigger_price : "--"

    return(
        <div className="futures_trigger-price">
            <div>Trigger Price</div>
            <div>{profitTrigger} / {stopTrigger}</div>
        </div>
    )
}

export default TriggerPrice