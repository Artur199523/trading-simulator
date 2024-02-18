import React, {useState, memo, useEffect} from "react";

import {
    useSimulatorOptionsContext,
    useSimulatorTradingContext,
    useSimulatorPlayerInfoContext,
    useStopOrderLimitModalContext,
    useSimulatorTradingChartDetailsContext
} from "layouts/providers";

import {Input, InputRange} from "components";
import TradeButton from "../TradeButton";
import {divide, multiply} from "utils";

const StopLimit:React.FC = () => {
    const {balanceUSDT, balanceTradeableCrypto, setBalanceUSDT, setBalanceTradeableCrypto} = useSimulatorPlayerInfoContext()
    const {currentCryptoData} = useSimulatorTradingChartDetailsContext()
    const {setCurrentModal} = useStopOrderLimitModalContext()
    const {cryptoType} = useSimulatorOptionsContext()
    const {process} = useSimulatorTradingContext()

    const [stopUSDT,setStopUSDT] = useState("")
    const [limitUSDT, setLimitUSDT] = useState<number | string>("")
    const [quantityCrypto, setQuantityCrypto] = useState("")
    const [totalPrice, setTotalPrice] = useState("")
    const [percent, setPercent] = useState(0)

    const currentBalance = process === "buy" ? balanceUSDT : balanceTradeableCrypto

    useEffect(() => {
        if (!limitUSDT) {
            setLimitUSDT(Number(currentCryptoData?.close))
        }
    }, [currentCryptoData]);

    const limitUSDTHandle = (limit: string) => {
        setPercent(0)
        setLimitUSDT(limit)

        if (quantityCrypto) {
            setTotalPrice(multiply(quantityCrypto, limit).toString())
        }
    }

    const totalUSDTHandle = (price: string) => {
        const quantityPrice = divide(price, limitUSDT).toString()

        setPercent(0)
        setTotalPrice(price)
        setQuantityCrypto(quantityPrice)
    }

    const rangeHandle = (percent: number) => {
        const calculatedPrice = divide(multiply(currentBalance, percent), 100)
        const currentPrice = calculatedPrice === 0 ? "" : calculatedPrice.toString()

        setPercent(percent)
        setTotalPrice(currentPrice)
        setQuantityCrypto(divide(currentPrice, limitUSDT).toString())
    }

    const quantityHandle = (quantity: string) => {
        setPercent(0)
        setQuantityCrypto(quantity)
        setTotalPrice(multiply(quantity, limitUSDT).toString())
    }

    const tradeInLimitOrder = ()=> {
        setCurrentModal("order-confirm")
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
                onChange={(e) => limitUSDTHandle(e.target.value)}
            />
            <Input
                name="quantity"
                value={quantityCrypto}
                type="number"
                placeholder={`Quantity (${cryptoType})`}
                onChange={(e) => quantityHandle(e.target.value)}
            />
            <InputRange value={percent} onChange={(e) => rangeHandle(e as any)}/>
            <Input
                name="total"
                value={totalPrice}
                type="number"
                placeholder='Total (USDT)'
                onChange={(e) => totalUSDTHandle(e.target.value)}
            />
            <TradeButton disabled={!limitUSDT || !quantityCrypto || !totalPrice} onClick={tradeInLimitOrder}/>
        </div>
    )
}

export default memo(StopLimit)