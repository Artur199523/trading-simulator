import React from "react";

import {useFuturesTradingModalContext, useSimulatorTradingChartDetailsContext} from "layouts/providers";
import {MODALS} from "utils";

import {ModalWindowTemplate} from "components";

import "./style.scss"

const RiskAlert: React.FC = () => {
    const {setCurrentModal,dataForModal,setDataForModal} = useFuturesTradingModalContext()
    const {setShortPositionDataTPSL, setLongPositionDataTPSL} = useSimulatorTradingChartDetailsContext()

    const confirm = () => {
        setShortPositionDataTPSL(null)
        setLongPositionDataTPSL(null)
        setCurrentModal(MODALS.CONFIRM_POSITION)
        setDataForModal(dataForModal)
    }

    return (
        <ModalWindowTemplate show={true} title="Risk Alert" confirmCallback={confirm} cancelCallback={() => setCurrentModal(MODALS.CLOSE)}>
            <div className="futures-modal_risk-alert">
                <p>The TP/SL you set is opposite to the direction of the order and will not take effect. Continue to place your order?</p>
            </div>
        </ModalWindowTemplate>
    )
}

export default RiskAlert