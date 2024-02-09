import React, {memo} from "react";

import {useSimulatorOptionsContext, useSimulatorPlayerInfoContext, useSimulatorTradingContext} from "layouts/providers";

import "./style.scss"

const Balance: React.FC = () => {
    const {balanceUSDT, balanceTradeableCrypto} = useSimulatorPlayerInfoContext()
    const {process} = useSimulatorTradingContext()
    const {cryptoType} = useSimulatorOptionsContext()

    return (
        <div className="right-bar_balance">
            {process === "buy"
                ? <div className="spot_market_balance">Available: <span>{balanceUSDT} USDT</span></div>
                : <div className="spot_market_balance">Available: <span>{balanceTradeableCrypto} {cryptoType}</span></div>
            }
        </div>
    )
}

export default memo(Balance)