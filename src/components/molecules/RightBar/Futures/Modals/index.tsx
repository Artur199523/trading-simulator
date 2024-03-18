import React from "react";
import {useFuturesTradingModalContext} from "layouts/providers";

import OrderPlacementPreferences from "./OrderPlacementPreferences";
import AdjustLeverage from "./AdjustLeverage";
import MarginMode from "./MargineMode";
import TPSL from "./TPSL";

const FuturesTradingModals = () => {
    const {currentModal} = useFuturesTradingModalContext()

    return (
        <React.Fragment>
            {
                {
                    "margin-mode":
                        <MarginMode/>,
                    "adjust-leverage":
                        <AdjustLeverage/>,
                    "order-placement-preferences":
                        <OrderPlacementPreferences/>,
                    "TP/SL":
                        <TPSL/>
                }[currentModal]
            }
        </React.Fragment>
    )
}

export default FuturesTradingModals