import React from "react";
import classNames from "classnames";
import { useSimulatorTradingContext} from "layouts/providers";

import "./style.scss"

const TradeButton: React.FC<any> = ({onClick, disabled}) => {
    const {process} = useSimulatorTradingContext()

    const btnStyle = classNames('right-bar_trading-confirm-btn',{"active-buy": process === "buy"}, {"active-sell": process === "sell"})

    return (
        <button disabled={disabled} onClick={()=>onClick(process)} className={btnStyle}>{process === "buy" ? "BUY" : "SELL"}</button>
    )
}

export default TradeButton