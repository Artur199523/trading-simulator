import React, {useRef, useState} from "react";
import classNames from "classnames";

import {
    useHiddenBlocksContext,
    useSimulatorOptionsContext,
    useSimulatorTradingContext,
    useFuturesTradingModalContext
} from "layouts/providers";
import {HIDDEN_BLOCKS, MODALS, POSITION_MODE} from "utils";

import {SettingsITF} from "./type";

import {Arrow, ArrowBottom, Close} from "assets/svg";
import "./style.scss"

const Settings: React.FC<SettingsITF> = ({className}) => {
    const {cryptoType} = useSimulatorOptionsContext()
    const {setHiddenBlock} = useHiddenBlocksContext()
    const {setCurrentModal} = useFuturesTradingModalContext()
    const {positionMode, marginMode} = useSimulatorTradingContext()

    const [isOpenRiskLimitBlock, setIsOpenRiskLimitBlock] = useState(false)

    const ordersBlockRef = useRef(null)

    const settingsStyle = classNames("hidden-block_settings", className)
    const riskLimitBlockStyle = classNames("hidden-block_settings_trades_risk-limits", {"open-risk-block": isOpenRiskLimitBlock})

    const PositionModeText = positionMode === POSITION_MODE.ONE_WAY ? "One-Way Mode" : "Hedge Mode"

    return (
        <div ref={ordersBlockRef} className={settingsStyle}>
            <div className="hidden-block_settings_head">
                <h4>Preference</h4>
                <button onClick={() => setHiddenBlock(HIDDEN_BLOCKS.CLOSE)}><Close/></button>
            </div>
            <div className="hidden-block_settings_margin">
                <h5>Margin</h5>
                <div className="hidden-block_settings_margin_margin-mode">
                    <span>Margin mode</span>
                    <button onClick={() => setHiddenBlock(HIDDEN_BLOCKS.MARGIN_MODE)}>{marginMode} Margin <Arrow/></button>
                </div>
            </div>
            <div className="hidden-block_settings_trades">
                <h5>{`Trades (Apply to ${cryptoType}USDT Only)`}</h5>
                <div className="hidden-block_settings_trades_position-mode">
                    <span>Position Mode</span>
                    <button onClick={() => setCurrentModal(MODALS.POSITION_MODE)}>{PositionModeText} <Arrow/></button>
                </div>
                <div className={riskLimitBlockStyle}>
                    <div className="hidden-block_settings_trades_risk-limits_head">
                        <span>Risk Limits</span>
                        <button onClick={() => setIsOpenRiskLimitBlock(!isOpenRiskLimitBlock)}><ArrowBottom/></button>
                    </div>
                    {isOpenRiskLimitBlock && <div className="hidden-block_settings_trades_risk-limits_block">
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default Settings