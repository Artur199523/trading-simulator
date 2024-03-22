import React, {memo, useState} from "react";

import {useFuturesTradingModalContext} from "layouts/providers";

import TradeButtons from "./Components/TradeButtons";
import {Input, InputRangeSlider} from "components";
import TPSL from "./Components/TPSL";

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
                rightText="USDT"
                value={orderValue}
                labelText="Order by Value"
                labelClickCallback={() => setCurrentModal("order-placement-preferences")}
                onChange={(e) => orderValueHandle(e.target.value)}
            />
            <InputRangeSlider
                max={100}
                division={4}
                name="percent"
                value={percentRange}
                onChange={(event) => percentRangeHandle(event.target.value as any)}
            />
            <TPSL orderValue={orderValue}/>
            <TradeButtons onClick={startTrade}/>
        </div>
    )
}

export default memo(Market)