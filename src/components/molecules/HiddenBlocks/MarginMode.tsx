import classNames from "classnames";
import React, {useRef} from "react";

import {CROSS_MARGIN_DATA, HIDDEN_BLOCKS, ISOLATED_MARGIN_DATA, MARGIN_MODE, PORTFOLIO_MARGIN_DATA, showNotification} from "utils";
import {useHiddenBlocksContext, useSimulatorTradingContext} from "layouts/providers";
import {useOnClickOutSide} from "hooks";

import MarginItem from "./Components/MarginItem";

import {Arrow} from "assets/svg";
import "./style.scss"

const MarginMode: React.FC<{ className: string }> = ({className}) => {
    const {setHiddenBlock, hiddenBlock} = useHiddenBlocksContext()
    const {marginMode, setMarginMode} = useSimulatorTradingContext()

    const ordersBlockRef = useRef(null)

    const marginModeStyle = classNames("hidden-block_margin-mode", className)

    const checkingForHidde = () => {
        if (hiddenBlock === HIDDEN_BLOCKS.MARGIN_MODE) {
            setHiddenBlock(HIDDEN_BLOCKS.SETTINGS)
        }
    }

    const chooseSettings = (mode: MARGIN_MODE) => {
        if(mode !== MARGIN_MODE.CROSS){
            setHiddenBlock(HIDDEN_BLOCKS.SETTINGS)
            showNotification(`Not available yet`, "info", 0)
        }else{
            setMarginMode(mode)
            setHiddenBlock(HIDDEN_BLOCKS.SETTINGS)
            showNotification(`Activated Successfully ${mode}-Margin mode`, "success", 0)
        }
    }

    useOnClickOutSide(ordersBlockRef, checkingForHidde)

    return (
        <div ref={ordersBlockRef} className={marginModeStyle}>
            <div className="hidden-block_margin-mode_head">
                <button onClick={() => checkingForHidde()}><span><Arrow/></span>Choose Margin Mode</button>
            </div>
            <div className="hidden-block_margin-mode_items">
                <MarginItem
                    title="Isolated Margin"
                    underTitle="(Regular User)"
                    data={ISOLATED_MARGIN_DATA}
                    mode={MARGIN_MODE.ISOLATED}
                    isActive={marginMode === MARGIN_MODE.ISOLATED}
                    callBackSettings={(mode) => chooseSettings(mode)}
                    callBackRequirement={() => alert()}
                />
                <MarginItem
                    title="Cross Margin"
                    data={CROSS_MARGIN_DATA}
                    mode={MARGIN_MODE.CROSS}
                    underTitle="(Regular User)"
                    isActive={marginMode === MARGIN_MODE.CROSS}
                    callBackSettings={(mode) => chooseSettings(mode)}
                    callBackRequirement={() => alert()}
                />
                <MarginItem
                    title="Portfolio Margin"
                    data={PORTFOLIO_MARGIN_DATA}
                    mode={MARGIN_MODE.PORTFOLIO}
                    underTitle="(Professional Derivatives Trader)"
                    isActive={marginMode === MARGIN_MODE.PORTFOLIO}
                    callBackSettings={(mode) => chooseSettings(mode)}
                    callBackRequirement={() => alert()}
                />
            </div>
        </div>
    )
}

export default MarginMode