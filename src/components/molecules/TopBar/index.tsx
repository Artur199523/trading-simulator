import classNames from "classnames";
import React,{memo} from "react";

import {useSimulatorTradingContext} from "layouts/providers";

import "./style.scss"

const TopBar: React.FC = () => {
    const {setTradingType, tradingType} = useSimulatorTradingContext()

    const activeSpot = classNames({"active": tradingType === "spot"})
    const activeFutures = classNames({"active": tradingType === "futures"})

    return (
        <div className="top-bar">
            <button className={activeSpot} onClick={() => setTradingType("spot")}>Spot</button>
            <button className={activeFutures} onClick={() => setTradingType("futures")}>Futures</button>
        </div>
    )
}

export default memo(TopBar)