import React, {memo, useState} from "react";

import {Input, InputRange} from "components";
import TradeButtons from "./Components/TradeButtons";
import TPSL from "./Components/TPSL";

import {StartTradeInitialOptions} from "./type";

const StopLimit: React.FC = () => {
    const [stopPrice,setStopPrice] = useState("")
    const [priceUSDT, setPriceUSDT] = useState("")
    const [percentInput, setPercentInput] = useState("")
    const [percentRange, setPercentRange] = useState(0)
    const [takeProfit, setTakeProfit] = useState<string>("")
    const [stopLoss, setStoppLoss] = useState<string>("")

    const stopPriceHandle = (price:string) => {
        setStopPrice(price)
    }
    const priceUSDTHandle = (price: string) => {
        setPriceUSDT(price)
    }

    const percentInputHandle = (percent: string) => {
        setPercentInput(percent)
    }

    const percentRangeHandle = (percent: number) => {
        setPercentRange(percent)
    }

    const startTrade = (process: StartTradeInitialOptions) => {
        console.log(process)
    }

    return (
        <div className="futures_limit-order">
            <Input
                name="stop_price"
                type="number"
                value={stopPrice}
                placeholder="Stop Price"
                onChange={(e) => setStopPrice(e.target.value)}
            />
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

            {/*<TPSL/>*/}
            <TradeButtons onClick={startTrade}/>
        </div>
    )
}

export default memo(StopLimit)