import React, {memo, useState} from "react";

import {Input, InputRange} from "components";
import TradeButtons from "./TradeButtons";
import TPSL from "./TPSL";

import {ProcessFuturesT} from "layouts/providers/type";

const LimitOrder: React.FC = () => {
    const [priceUSDT, setPriceUSDT] = useState("")
    const [percentInput, setPercentInput] = useState("")
    const [percentRange, setPercentRange] = useState(0)
    const [takeProfit, setTakeProfit] = useState<string>("")
    const [stopLoss, setStoppLoss] = useState<string>("")

    const priceUSDTHandle = (price: string) => {
        setPriceUSDT(price)
    }

    const percentInputHandle = (percent: string) => {
        setPercentInput(percent)
    }

    const percentRangeHandle = (percent: number) => {
        setPercentRange(percent)
    }

    const startTrade = (process: ProcessFuturesT) => {
        console.log(process)
    }

    return (
        <div className="futures_limit-order">
            <Input
                name="price"
                type="number"
                value={priceUSDT}
                placeholder="Price (USDT)"
                onChange={(e) => priceUSDTHandle(e.target.value)}
            />
            <Input
                name="percent"
                type="number"
                value={percentInput}
                placeholder="Size (%)"
                onChange={(e) => percentInputHandle(e.target.value)}
            />
            <InputRange value={percentRange} onChange={(e) => percentRangeHandle(e as any)}/>

            <TPSL
                takeProfit={takeProfit}
                stopLoss={stopLoss}
                setTakeProfit={setTakeProfit}
                setStopLoss={setStoppLoss}
            />
            <TradeButtons onClick={startTrade}/>
        </div>
    )
}

export default memo(LimitOrder)