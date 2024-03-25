import React, {memo} from "react";

import {useFuturesTradingModalContext} from "layouts/providers";
import {showNotification, TRADE_POSITION} from "utils";

import {CheckBox} from "components/index";
import {TPSLInterface} from "../type";

const TPSL: React.FC<TPSLInterface> = ({orderValue, confirmed, position}) => {
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
            <CheckBox
                extent="small"
                checked={confirmed}
                name="TP/LS"
                onChange={() => checkBoxClick()}
            >
                {confirmed ? "TP / SL (Entire position)" : "Take Profit / Stop Loss"}
            </CheckBox>
            {confirmed && <PositionMark position={position}/>}
        </div>
    )
}

export default memo(TPSL)

const PositionMark: React.FC<{ position: TRADE_POSITION }> = ({position}) => {
    return (
        <span className={`futures_tp-sl_position-mark ${position}`}>
            {position}
        </span>
    )
}