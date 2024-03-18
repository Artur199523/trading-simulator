import React from "react";

import {useSimulatorTradingContext} from "layouts/providers";

import {TradeButtonsITF} from "./type";
import "./style.scss"

const TradeButtons: React.FC<TradeButtonsITF> = ({onClick}) => {
    const {currentHedgingModePositionType} = useSimulatorTradingContext()

    return (
        <div className="futures_trade-buttons">
            <button onClick={() => onClick({hedgingType: currentHedgingModePositionType, position: "long"})}>
                {currentHedgingModePositionType} Long
            </button>
            <button onClick={() => onClick({hedgingType: currentHedgingModePositionType, position: "short"})}>
                {currentHedgingModePositionType} Short
            </button>
        </div>
    )
}

export default TradeButtons