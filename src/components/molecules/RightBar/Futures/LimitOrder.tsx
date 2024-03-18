import React, {memo, useEffect, useState} from "react";

import {useSimulatorTradingChartDetailsContext, useSimulatorTradingContext} from "layouts/providers";

import {Input, InputRange} from "components";
import TradeButtons from "./TradeButtons";
import TPSL from "./TPSL";

import {StartTradeInitialOptions} from "./type";
import {multiply} from "../../../../utils";

const LimitOrder: React.FC = () => {
    const [priceUSDT, setPriceUSDT] = useState("")
    const [quantityUSDT, setQuantityUSDT] = useState("")
    const [percentRange, setPercentRange] = useState(0)
    const [takeProfit, setTakeProfit] = useState<string>("")
    const [stopLoss, setStopLoss] = useState<string>("")

    const {currentCryptoData} = useSimulatorTradingChartDetailsContext()
    const {totalDepositWithLeverage} = useSimulatorTradingContext()

    useEffect(() => {
        if (currentCryptoData.close && !priceUSDT) setPriceUSDT(currentCryptoData.close.toString())
    }, [currentCryptoData.close]);

    const priceUSDTHandle = (price: string) => {
        setPriceUSDT(price)
    }

    const quantityInputHandle = (quantity: string) => {
        setQuantityUSDT(quantity)
        setPercentRange(Number((multiply(quantity,100)/totalDepositWithLeverage).toFixed(3)))
    }

    const percentRangeHandle = (percent: number) => {
        setPercentRange(percent)
        setQuantityUSDT((multiply(totalDepositWithLeverage,percent)/100).toString())
    }

    const startTrade = (process: StartTradeInitialOptions) => {
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
                name="quantity"
                type="number"
                value={quantityUSDT}
                placeholder="Quantity (USDT)"
                onChange={(e) => quantityInputHandle(e.target.value)}
            />
            <InputRange value={percentRange} onChange={(e) => percentRangeHandle(e as any)}/>

            {/*<TPSL/>*/}
            <TradeButtons onClick={startTrade}/>
        </div>
    )
}

export default memo(LimitOrder)