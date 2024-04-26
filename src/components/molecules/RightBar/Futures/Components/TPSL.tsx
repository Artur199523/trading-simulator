import React, {memo} from "react";

import {CALL_ENVIRONMENT, MODALS, showNotification, TRADE_POSITION} from "utils";
import {useFuturesTradingModalContext} from "layouts/providers";

import {CheckBox} from "components";

import {TPSLDataForModalITF, TPSLInterface} from "../type";

const TPSL: React.FC<TPSLInterface> = ({orderValue, orderPrice, confirmed, position, tradType}) => {
    const {setCurrentModal, setDataForModal} = useFuturesTradingModalContext<TPSLDataForModalITF>()

    const checkBoxClick = () => {
        if (orderPrice !== undefined) {
            if (Number(orderPrice) < 10) {
                showNotification("Order price less then need for trade", "error", 0)

                return
            }
        }

        if (Number(orderValue) < 10) {
            showNotification("Order value less then need for trade", "error", 0)
        } else {
            setCurrentModal(MODALS.TP_SL)
            setDataForModal({orderValue, orderPrice, tradType, call: CALL_ENVIRONMENT.OUTSIDE})
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