import React from "react";

import {useSimulatorTradingContext} from "layouts/providers";
import {TRADE_POSITION} from "utils";

import {TradeButtonsITF} from "../type";

import "../style.scss"

const TradeButtons: React.FC<TradeButtonsITF> = ({onClick}) => {
    const {currentHedgingModePositionType} = useSimulatorTradingContext()

    return (
        <div className="futures_trade-buttons">
            <button onClick={() => onClick({hedgingType: currentHedgingModePositionType, position: TRADE_POSITION.LONG})}>
                {currentHedgingModePositionType} Long
            </button>
            <button onClick={() => onClick({hedgingType: currentHedgingModePositionType, position: TRADE_POSITION.SHORT})}>
                {currentHedgingModePositionType} Short
            </button>
        </div>
    )
}

export default TradeButtons