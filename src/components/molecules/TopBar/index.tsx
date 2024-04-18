import classNames from "classnames";
import React, {memo} from "react";

import {useHiddenBlocksContext, useSimulatorTradingContext} from "layouts/providers";
import {HIDDEN_BLOCKS} from "utils";

import {Settings} from "assets/svg";
import "./style.scss"

const TopBar: React.FC = () => {
    const {setTradingType, tradingType} = useSimulatorTradingContext()
    const {setHiddenBlock} = useHiddenBlocksContext()

    const activeSpot = classNames({"active": tradingType === "spot"})
    const activeFutures = classNames({"active": tradingType === "futures"})

    return (
        <div className="top-bar">
            <div className="top-bar_trading-types">
                <button className={activeSpot} onClick={() => setTradingType("spot")}>Spot</button>
                <button className={activeFutures} onClick={() => setTradingType("futures")}>Futures</button>
            </div>
            <div className="top-bar_settings">
                <button onClick={() => setHiddenBlock(HIDDEN_BLOCKS.SETTINGS)}><Settings/></button>
            </div>
        </div>
    )
}

export default memo(TopBar)