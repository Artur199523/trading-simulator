import React, {useState} from "react";

import {useFuturesTradingModalContext, useSimulatorOptionsContext, useSimulatorTradingContext} from "layouts/providers";
import {MARGIN_MODE, MODALS} from "utils";

import {Button, ModalWindow} from "components";

import "./style.scss"
import classNames from "classnames";

const MarginMode: React.FC = () => {
    const {cryptoType} = useSimulatorOptionsContext()
    const {marginMode, setMarginMode} = useSimulatorTradingContext()
    const {setCurrentModal} = useFuturesTradingModalContext()

    const [currentMode, setCurrenMode] = useState<MARGIN_MODE>(marginMode)

    const confirmMode = () => {
        setMarginMode(currentMode)
        setCurrentModal(MODALS.CLOSE)
    }

    const crossStyle = classNames({"active":currentMode === MARGIN_MODE.CROSS})
    const isolatedStyle = classNames({"active":currentMode === MARGIN_MODE.ISOLATED})

    return (
        <ModalWindow show={true} title={`${cryptoType}USDT Perpetual Margin Mode`}>
            <div className="futures-modal_head-btns">
                <button className={crossStyle} onClick={() => setCurrenMode(MARGIN_MODE.CROSS)}>Cross</button>
                <button className={isolatedStyle} onClick={() => setCurrenMode(MARGIN_MODE.ISOLATED)}>Isolated</button>
            </div>
            <div className="futures-modal_content">
                <p>· Switching the margin mode will only apply it to the selected contract.</p>
                <p>Cross Margin Mode: All cross positions under the same margin asset share the same asset cross margin balance. In the event of liquidation,
                    your assets full margin balance along with any remaining open positions under the asset may be forfeited.</p>
                <p>Isolated Margin Mode: Manage your risk on individual positions by restricting the amount of margin allocated to each. If the margin ratio of
                    a position reached 100%, the position will be liquidated. Margin can be added or removed to positions using this mode.</p>
            </div>
            <div className="futures-modal_btns">
                <Button onClick={() => setCurrentModal(MODALS.CLOSE)}>Cancel</Button>
                <Button onClick={confirmMode} view="two">Confirm</Button>
            </div>
        </ModalWindow>
    )
}

export default MarginMode