import React from "react";
import {useFuturesTradingModalContext} from "layouts/providers";
import MarginMode from "./MargineMode";
import AdjustLeverage from "./AdjustLeverage";

const FuturesTradingModals = () => {
    const {currentModal} = useFuturesTradingModalContext()

    return (
        <React.Fragment>
            {
                {
                    "margin-mode":
                        <MarginMode/>,
                    "adjust-leverage":
                        <AdjustLeverage/>
                }[currentModal]
            }
        </React.Fragment>
    )
}

export default FuturesTradingModals