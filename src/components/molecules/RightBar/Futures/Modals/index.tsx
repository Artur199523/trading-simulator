import React from "react";

import {useFuturesTradingModalContext} from "layouts/providers";
import {MODALS} from "utils";

import OrderPlacementPreferences from "./OrderPlacementPreferences";
import ClosePositionMarket from "./ClosePositionMarket";
import ConfirmPosition from "./ConfirmPosition";
import AdjustLeverage from "./AdjustLeverage";
import PositionMode from "./PositionMode";
import MarginMode from "./MargineMode";
import RiskAlert from "./RiskAlert";
import TPSL from "./TPSL";

const FuturesTradingModals = () => {
    const {currentModal} = useFuturesTradingModalContext()

    return (
        <React.Fragment>
            {
                {
                    [MODALS.TP_SL]:
                        <TPSL/>,
                    [MODALS.RISK_ALERT]:
                        <RiskAlert/>,
                    [MODALS.MARGIN_MODE]:
                        <MarginMode/>,
                    [MODALS.POSITION_MODE]:
                        <PositionMode/>,
                    [MODALS.ADJUST_LEVERAGE]:
                        <AdjustLeverage/>,
                    [MODALS.CONFIRM_POSITION]:
                        <ConfirmPosition/>,
                    [MODALS.CLOSE_POSITION_MARKET]:
                        <ClosePositionMarket/>,
                    [MODALS.ORDER_PLACEMENT_PREFERENCES]:
                        <OrderPlacementPreferences/>
                }[currentModal]
            }
        </React.Fragment>
    )
}

export default FuturesTradingModals