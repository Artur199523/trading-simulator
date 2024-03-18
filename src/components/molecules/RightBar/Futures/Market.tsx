import React, {memo, useState} from "react";

import {useFuturesTradingModalContext} from "layouts/providers";

import {Input, InputRange} from "components";
import TradeButtons from "./TradeButtons";
import TPSL from "./TPSL";

import {StartTradeInitialOptions} from "./type";

const Market: React.FC = () => {
    const [orderValue, setOrderValue] = useState("")
    const [percentRange, setPercentRange] = useState(0)

    const {setCurrentModal} = useFuturesTradingModalContext()

    const orderValueHandle = (percent: string) => {
        setOrderValue(percent)
    }

    const percentRangeHandle = (percent: number) => {
        setPercentRange(percent)
    }

    const startTrade = (process: StartTradeInitialOptions) => {
        console.log(process)
    }

    return (
        <div className="futures_market">
            <Input
                name="quantity"
                type="number"
                value={orderValue}
                placeholder="USDT"
                labelText="Order by Value"
                labelClickCallback={() => setCurrentModal("order-placement-preferences")}
                onChange={(e) => orderValueHandle(e.target.value)}
            />

            <InputRange value={percentRange} onChange={(e) => percentRangeHandle(e as any)}/>
            <TPSL orderValue={orderValue}/>
            <TradeButtons onClick={startTrade}/>
        </div>
    )
}

export default memo(Market)