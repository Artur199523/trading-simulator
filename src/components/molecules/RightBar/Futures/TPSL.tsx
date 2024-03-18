import React, {memo} from "react";

import {useFuturesTradingModalContext} from "layouts/providers";
import {showNotification} from "utils";

import {CheckBox} from "components";

const TPSL: React.FC<{ orderValue: string }> = ({orderValue}) => {
    const {setCurrentModal, setDataForModal} = useFuturesTradingModalContext()

    const checkBoxClick = () => {
        if (Number(orderValue) < 10) {
            showNotification("Order value less then need for trade", "error", 0)
        } else {
            setCurrentModal("TP/SL")
            setDataForModal({orderValue})
        }
    }

    return (
        <div className="futures_tp-sl">
            <CheckBox extent="medium" checked={false} name="TP/LS" onChange={() => checkBoxClick()}>Take Profit / Stop Loss</CheckBox>
        </div>
    )
}

export default memo(TPSL)