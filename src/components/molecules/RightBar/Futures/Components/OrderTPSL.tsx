import React from "react";

import {useFuturesTradingModalContext, useSimulatorTradingChartDetailsContext} from "layouts/providers";
import {CALL_ENVIRONMENT, MODALS} from "utils";

import {ConfirmedTPSLDataForModalITF, ConfirmPositionDataForModalWithTPSLITF} from "../type";

import {Edit} from "assets/svg";
import "../../style.scss"

const OrderTPSL = () => {
    const {setCurrentModal} = useFuturesTradingModalContext<ConfirmPositionDataForModalWithTPSLITF>()
    const {setDataForModal: setDataForModalTPSL} = useFuturesTradingModalContext<ConfirmedTPSLDataForModalITF>()
    const {
        confirmedShortPositionDataTPSL,
        confirmedLongPositionDataTPSL,
        confirmedShortPositionData,
        confirmedLongPositionData
    } = useSimulatorTradingChartDetailsContext()

    const isTPSL = !!confirmedShortPositionDataTPSL || !!confirmedLongPositionDataTPSL
    const currentTPSL = confirmedShortPositionDataTPSL ? confirmedShortPositionDataTPSL : confirmedLongPositionDataTPSL
    const currentConfirmedData = confirmedLongPositionData ? confirmedLongPositionData : confirmedShortPositionData

    const profitTriggerPrice = isTPSL ? currentTPSL.profit_trigger_price ? currentTPSL.profit_trigger_price : "--" : ""
    const stopTriggerPrice = isTPSL ? currentTPSL.stop_trigger_price ? currentTPSL.stop_trigger_price : "--" : ""

    const openTPSLModal = () => {
        setCurrentModal(MODALS.TP_SL)
        setDataForModalTPSL({orderValue: currentConfirmedData.value, tradePosition: currentConfirmedData.position, call: CALL_ENVIRONMENT.INSIDE})
    }

    return (
        <div className="futures_order-tpsl">
            {isTPSL
                ? <div className="futures_order-tpsl_details">
                    <div><span>{profitTriggerPrice}</span> / <span>{stopTriggerPrice}</span></div>
                    <button onClick={() => openTPSLModal()}><Edit/></button>
                </div>
                : <button onClick={() => openTPSLModal()}>+ Add</button>}
        </div>
    )
}

export default OrderTPSL