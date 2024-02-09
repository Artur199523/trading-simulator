import React ,{memo}from "react";

import {useSimulatorContext, useSimulatorTradingContext} from "layouts/providers";

import {TabContent, Spot, Futures} from "components";

import "./style.scss"
import classNames from "classnames";

const RightBar: React.FC = () => {
    // const {tradingType, setProcess, process} = useSimulatorContext()
    const {process,setProcess,tradingType} = useSimulatorTradingContext()

    console.log(process)

    const buyBtnStyle = classNames({"active-buy": process === "buy"})
    const sellBtnStyle = classNames({"active-sell": process === "sell"})

    return (
        <div className="right-bar">
            <div className="right-bar_trading-btn">
                <button className={buyBtnStyle} onClick={() => setProcess("buy")}>Buy</button>
                <button className={sellBtnStyle} onClick={() => setProcess("sell")}>Sell</button>
            </div>
            <TabContent id="spot" activeTab={tradingType}>
                <Spot/>
            </TabContent>
            <TabContent id="futures" activeTab={tradingType}>
                <Futures/>
            </TabContent>
        </div>
    )
}

export default memo(RightBar)