import React, {useState} from "react";

import {useSimulatorOptionsContext} from "layouts/providers";

import {Input, InputRange} from "components";
import TradeButton from "../TradeButton";

const StopLimit:React.FC = () => {
    const {cryptoType} = useSimulatorOptionsContext()

    const [stopUSDT,setStopUSDT] = useState("")
    const [limitUSDT,setLimitUSDT] = useState("")
    const [quantityCrypto,setQuantityCrypto] = useState("")
    const [percent,setPercent] = useState(0)
    const [totalUSDT,setTotalUSDT] = useState("")

    const tradeInLimitOrder = ()=> {

    }

    return(
        <div className="spot_stop-limit">
            <Input
                name="stop"
                type="number"
                value={stopUSDT}
                placeholder="Stop (USDT)"
                onChange={(e) => setStopUSDT(e.target.value)}
            />
            <Input
                name="limit"
                type="number"
                value={limitUSDT}
                placeholder="Limit (USDT)"
                onChange={(e) => setLimitUSDT(e.target.value)}
            />
            <Input
                name="quantity"
                value={quantityCrypto}
                type="number"
                placeholder={`Quantity (${cryptoType})`}
                onChange={(e) => setQuantityCrypto(e.target.value)}
            />
            <InputRange value={percent} onChange={(e) => setPercent(e as any)}/>
            <Input
                name="total"
                value={totalUSDT}
                type="number"
                placeholder='Total (USDT)'
                onChange={(e) => setTotalUSDT(e.target.value)}
            />
            <TradeButton onClick={tradeInLimitOrder}/>
        </div>
    )
}

export default StopLimit