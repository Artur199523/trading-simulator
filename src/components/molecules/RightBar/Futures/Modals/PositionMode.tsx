import React, {useEffect, useState} from "react";

import {useFuturesTradingModalContext, useHiddenBlocksContext, useSimulatorTradingContext} from "layouts/providers";
import {HIDDEN_BLOCKS, MODALS, POSITION_MODE, showNotification} from "utils";

import {CheckBox, ModalWindowTemplate} from "components";

import "./style.scss"

const PositionMode: React.FC = () => {
    const {setCurrentModal} = useFuturesTradingModalContext()
    const {setPositionMode, positionMode} = useSimulatorTradingContext()
    const {setHiddenBlock} = useHiddenBlocksContext()

    const [isChecked, setIsChecked] = useState<POSITION_MODE>(POSITION_MODE.ONE_WAY);

    useEffect(() => {
        setIsChecked(positionMode)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [])

    const confirmPreference = () => {
        if (isChecked === POSITION_MODE.HEDGE) {
            showNotification("Not available", "info", 0)
        } else {
            if (isChecked !== positionMode) {
                setPositionMode(isChecked)
                setCurrentModal(MODALS.CLOSE)
                setHiddenBlock(HIDDEN_BLOCKS.CLOSE)
                showNotification("Position mode switched successfully", "success", 0)
            }
        }
    }

    return (
        <ModalWindowTemplate show={true} title="Position Mode" confirmCallback={confirmPreference} cancelCallback={() => setCurrentModal(MODALS.CLOSE)}>
            <div className="futures-modal_position-mode_check-item">
                <div className="futures-modal_position-mode_check-item_checkbox">
                    <CheckBox
                        name="one_way"
                        extent="medium"
                        checked={isChecked === POSITION_MODE.ONE_WAY}
                        onChange={() => setIsChecked(POSITION_MODE.ONE_WAY)}
                    >
                        One-Way Mode
                    </CheckBox>
                </div>
                <p>Under one-way mode, you can hold either a long or a short position of a contract.</p>
            </div>
            <div className="futures-modal_position-mode_check-item">
                <CheckBox
                    name="hedge"
                    extent="medium"
                    checked={isChecked === POSITION_MODE.HEDGE}
                    onChange={() => setIsChecked(POSITION_MODE.HEDGE)}
                >
                    Hedge Mode
                </CheckBox>
                <div className="futures-modal_position-mode_check-item_checkbox">
                </div>
                <p>Under hedge mode, you can hold both long and short positions simultaneously of a contract.</p>
            </div>
            <div className="futures-modal_position-mode_note">
                <p>It is not allowed to switch between one-way mode and hedge mode while holding position(s) or active order(s). The setting applies to the
                    current Derivatives pair only.</p>
                <p></p>
            </div>
        </ModalWindowTemplate>
    )
}

export default PositionMode