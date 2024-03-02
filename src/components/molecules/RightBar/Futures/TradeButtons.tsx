import React from "react";
import {TradeButtonsITF} from "./type";
import "./style.scss"
const TradeButtons: React.FC<TradeButtonsITF> = ({onClick}) => {
    return (
        <div className="futures_trade-buttons">
            <button onClick={() => onClick("buy/long")}>Buy/Long</button>
            <button onClick={() => onClick("sell/short")}>Sell/Short</button>
        </div>
    )
}

export default TradeButtons