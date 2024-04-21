import classNames from "classnames";
import React, {memo} from "react";

import {useFuturesTradingModalContext, useHiddenBlocksContext, useSimulatorTradingContext} from "layouts/providers";
import {HEDGING, HIDDEN_BLOCKS, MODALS, POSITION_MODE} from "utils";

import {Futures, Spot, TabContent, TabItem} from "components";

import "./style.scss";

const RightBar: React.FC = () => {
    const {process, setProcess, tradingType, marginMode, adjustLeverage} = useSimulatorTradingContext()
    const {currentHedgingModePositionType, setCurrentHedgingModePositionType, positionMode} = useSimulatorTradingContext()
    const {setHiddenBlock} = useHiddenBlocksContext()
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
                {positionMode === POSITION_MODE.HEDGE && <div className="right-bar_futures_hedging-mode-tabs">
                    <TabItem activeTab={currentHedgingModePositionType} id={HEDGING.OPEN} setActiveTab={setCurrentHedgingModePositionType}>Open</TabItem>
                    <TabItem activeTab={currentHedgingModePositionType} id={HEDGING.CLOSE} setActiveTab={setCurrentHedgingModePositionType}>Close</TabItem>
                </div>}
                <div className="right-bar_futures_trading-btn">
                    <button onClick={() => setHiddenBlock(HIDDEN_BLOCKS.MARGIN_MODE)}>{marginMode}</button>
                    <button onClick={() => setCurrentModal(MODALS.ADJUST_LEVERAGE)}>{adjustLeverage}x</button>
                </div>
                <Futures/>
            </TabContent>
        </div>
    )
}

export default memo(RightBar)