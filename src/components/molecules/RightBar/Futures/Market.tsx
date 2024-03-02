import React, {memo, useState} from "react";

import {Input, InputRange} from "components";
import TradeButtons from "./TradeButtons";
import TPSL from "./TPSL";

import {ProcessFuturesT} from "layouts/providers/type";

const Market: React.FC = () => {
    const [percentInput, setPercentInput] = useState("")
    const [percentRange, setPercentRange] = useState(0)
    const [takeProfit, setTakeProfit] = useState<string>("")
    const [stopLoss, setStoppLoss] = useState<string>("")

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
        <div className="futures_market">
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

export default memo(Market)