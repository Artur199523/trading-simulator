import React, {useState} from "react";

import {useFuturesTradingModalContext, useSimulatorOptionsContext, useSimulatorTradingContext} from "layouts/providers";

import {ModalWindow, Button} from "components";

import {MarginModeT} from "layouts/providers/type";

import "./style.scss"

const MarginMode: React.FC = () => {
    const {cryptoType} = useSimulatorOptionsContext()
    const {setCurrentModal} = useFuturesTradingModalContext()
    const {marginMode, setMarginMode} = useSimulatorTradingContext()
    const [currentMode, setCurrenMode] = useState<MarginModeT>(marginMode)

    const confirmMode = () => {
        setMarginMode(currentMode)
        setCurrentModal("")
    }

    return (
        <ModalWindow show={true} title={`${cryptoType}USDT Perpetual Margin Mode`}>
            <div className="futures-modal_head-btns">
                <button className={currentMode === "cross" ? "active" : ""} onClick={() => setCurrenMode("cross")}>Cross</button>
                <button className={currentMode === "isolated" ? "active" : ""} onClick={() => setCurrenMode("isolated")}>Isolated</button>
            </div>
            <div className="futures-modal_content">
                <p>· Switching the margin mode will only apply it to the selected contract.</p>
                <p>Cross Margin Mode: All cross positions under the same margin asset share the same asset cross margin balance. In the event of liquidation,
                    your assets full margin balance along with any remaining open positions under the asset may be forfeited.</p>
                <p>Isolated Margin Mode: Manage your risk on individual positions by restricting the amount of margin allocated to each. If the margin ratio of
                    a position reached 100%, the position will be liquidated. Margin can be added or removed to positions using this mode.</p>
            </div>
            <div className="futures-modal_btns">
                <Button onClick={() => setCurrentModal("")}>Cancel</Button>
                <Button onClick={confirmMode} view="two">Confirm</Button>
            </div>
        </ModalWindow>
    )
}

export default MarginMode