import React, {memo} from "react";

import {useSimulatorOptionsContext, useSimulatorPlayerInfoContext, useSimulatorTradingContext} from "layouts/providers";
import {fixedNumber} from "utils";

import "./style.scss"

const Balance: React.FC = () => {
    const {balanceUSDT, balanceTradeableCrypto} = useSimulatorPlayerInfoContext()
    const {process} = useSimulatorTradingContext()
    const {cryptoType} = useSimulatorOptionsContext()

    return (
        <div className="right-bar_balance">
            {process === "buy"
                ? <div><span>Available Balance</span> <span>{fixedNumber(balanceUSDT, 1)} USDT</span></div>
                : <div><span>Available Balance</span> <span>{fixedNumber(balanceTradeableCrypto, 2)} {cryptoType}</span></div>
            }
        </div>
    )
}

export default memo(Balance)