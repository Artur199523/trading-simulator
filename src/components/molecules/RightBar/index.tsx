import React, {memo} from "react";

import {useFuturesTradingModalContext, useSimulatorTradingContext} from "layouts/providers";

import {TabContent, Spot, Futures} from "components";

import "./style.scss"
import classNames from "classnames";

const RightBar: React.FC = () => {
    const {process, setProcess, tradingType, marginMode, adjustLeverage} = useSimulatorTradingContext()
    const {setCurrentModal} = useFuturesTradingModalContext()
    const buyBtnStyle = classNames({"active-buy": process === "buy"})
    const sellBtnStyle = classNames({"active-sell": process === "sell"})

    return (
        <div className="right-bar">
            <TabContent id="spot" activeTab={tradingType}>
                <div className="right-bar_spot-trading-btn">
                    <button className={buyBtnStyle} onClick={() => setProcess("buy")}>Buy</button>
                    <button className={sellBtnStyle} onClick={() => setProcess("sell")}>Sell</button>
                </div>
                <Spot/>
            </TabContent>
            <TabContent id="futures" activeTab={tradingType}>
                <div className="right-bar_futures-trading-btn">
                    <button onClick={() => setCurrentModal("margin-mode")}>{marginMode}</button>
                    <button onClick={()=>setCurrentModal("adjust-leverage")}>{adjustLeverage}x</button>
                </div>
                <Futures/>
            </TabContent>
        </div>
    )
}

export default memo(RightBar)