import React,{memo} from "react";
import {useSimulatorPlayerInfoContext} from "layouts/providers";
const MarginRatioBlock: React.FC = () => {
    const {balanceUSDT} = useSimulatorPlayerInfoContext()

    return (
        <div className="futures_margin-ration">
            <h3>Unified Trading Account</h3>
            <div>
                <span>Margin Balance</span>
                <span>{balanceUSDT.toFixed(2)} USDT</span>
            </div>
            <div>
                <span>Available Balance</span>
                <span>{balanceUSDT.toFixed(2)} USDT</span>
            </div>
        </div>
    )
}

export default memo(MarginRatioBlock)