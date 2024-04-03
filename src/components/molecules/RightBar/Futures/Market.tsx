import React, {memo, useEffect, useState} from "react";

import {useFuturesTradingModalContext, useSimulatorPlayerInfoContext, useSimulatorTradingContext} from "layouts/providers";

import OrderValueInfo from "./Components/OrderValueInfo";
import TradeButtons from "./Components/TradeButtons";
import {Input, InputRangeSlider} from "components";
import TPSL from "./Components/TPSL";

import {StartTradeInitialOptions} from "./type";
import {TRADE_POSITION} from "utils";
import TriggerPrice from "./Components/TriggerPrice";

const Market: React.FC = () => {
    const [orderValue, setOrderValue] = useState("")
    const [percentRange, setPercentRange] = useState(0)

    const {setCurrentModal} = useFuturesTradingModalContext()
    const {adjustLeverage, longPositionData, shortPositionData} = useSimulatorTradingContext()
    const {balanceUSDT} = useSimulatorPlayerInfoContext()

    const isTPSL = !!longPositionData || !!shortPositionData

    useEffect(() => {
        if (orderValue) percentRangeHandle(percentRange)
    }, [adjustLeverage]);

    const orderValueHandle = (percent: string) => {
        setOrderValue(percent)
    }

    const percentRangeHandle = (percent: number) => {
        setOrderValue((percent * (balanceUSDT * adjustLeverage) / 100).toString())
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
            <OrderValueInfo orderValue={Number(orderValue)}/>
            <TPSL
                orderValue={orderValue}
                confirmed={isTPSL}
                position={!!longPositionData ? TRADE_POSITION.LONG : TRADE_POSITION.SHORT}
            />
            {isTPSL && <TriggerPrice/>}
            <TradeButtons onClick={startTrade}/>
        </div>
    )
}

export default memo(Market)