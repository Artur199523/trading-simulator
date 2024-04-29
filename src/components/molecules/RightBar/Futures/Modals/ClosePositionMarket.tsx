import React from "react";

import {useFuturesTradingModalContext} from "layouts/providers";
import {MODALS} from "utils";

import {ModalWindowTemplate} from "components";

import "./style.scss"

const ClosPositionMarket: React.FC = () => {
    const {setCurrentModal, dataForModal} = useFuturesTradingModalContext()


    const confirmPreference = () => {

    }

    return (
        <ModalWindowTemplate show={true} title="Market Close" confirmCallback={confirmPreference} cancelCallback={() => setCurrentModal(MODALS.CLOSE)}>
            <div className="futures-modal_close-position_market">

            </div>
        </ModalWindowTemplate>
    )
}

export default ClosPositionMarket