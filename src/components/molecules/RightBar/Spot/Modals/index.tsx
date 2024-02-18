import React from "react";
import {useStopOrderLimitModalContext} from "layouts/providers";
import StopLimitOrderConfirm from "./StopLimitOrderConfirm";

const Modals = () => {
    const {currentModal} = useStopOrderLimitModalContext()

    return (
        <React.Fragment>
            {
                {
                    "order-confirm":
                        <StopLimitOrderConfirm/>
                }[currentModal]
            }
        </React.Fragment>
    )
}

export default Modals