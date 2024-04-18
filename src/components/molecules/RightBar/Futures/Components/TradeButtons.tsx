import React from "react";

import {useSimulatorTradingContext} from "layouts/providers";
import {POSITION_MODE, TRADE_POSITION} from "utils";

import {TradeButtonsITF} from "../type";

import "../style.scss"

const TradeButtons: React.FC<TradeButtonsITF> = ({onClick}) => {
    const {currentHedgingModePositionType, positionMode} = useSimulatorTradingContext()

    const longButtonText = positionMode === POSITION_MODE.HEDGE ? `${currentHedgingModePositionType} Long` : "Buy / Long"
    const shortButtonText = positionMode === POSITION_MODE.HEDGE ? `${currentHedgingModePositionType} Short` : "Sell / Short"

    return (
        <div className="futures_trade-buttons">
            <button onClick={() => onClick({hedgingType: currentHedgingModePositionType, position: TRADE_POSITION.LONG})}>
                {longButtonText}
            </button>
            <button onClick={() => onClick({hedgingType: currentHedgingModePositionType, position: TRADE_POSITION.SHORT})}>
                {shortButtonText}
            </button>
        </div>
    )
}

export default TradeButtons