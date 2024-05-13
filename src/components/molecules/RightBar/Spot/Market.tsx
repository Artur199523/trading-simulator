import React, {memo, useEffect, useState} from "react";
import {v4 as uuidv4} from 'uuid'

import {useSimulatorOptionsContext, useSimulatorPlayerInfoContext, useSimulatorTradingChartDetailsContext, useSimulatorTradingContext} from "layouts/providers";

import {divide, ERROR, minus, multiply, plus, showNotification, TRAD_TYPE_NAME, SPOT_ORDER_STATUS} from "utils";
import {Input, InputRangeSlider} from "components";
import TradeButton from "../TradeButton";

import {ProcessT} from "layouts/providers/type";

const Market: React.FC = () => {
    const {balanceUSDT, setBalanceUSDT, balanceTradeableCrypto, setBalanceTradeableCrypto,} = useSimulatorPlayerInfoContext()
    const {currentCryptoData, setMarketOrders, setMarketOrdersMarks} = useSimulatorTradingChartDetailsContext()
    const {cryptoType} = useSimulatorOptionsContext()
    const {process} = useSimulatorTradingContext()

    const [percent, setPercent] = useState(0)
    const [price, setPrice] = useState("")
    const [value, setValue] = useState("")

    useEffect(() => {
        setValue("")
    }, [process]);

    const tradeInMarket = (side: ProcessT) => {
        switch (side) {
            case "buy":
                if (balanceUSDT >= Number(value)) {
                    let orderId = uuidv4().split("-")[0]

                    setValue("")
                    setPercent(0)

                    setBalanceTradeableCrypto(prev => plus(prev, divide(value, currentCryptoData.close)))
                    setBalanceUSDT(prev => minus(prev, value))

                    setMarketOrders(prev => {
                        // showNotification(`Order M${orderId} placed (BUY:Market)`, "info", 500)
                        //
                        // showNotification(`Order M${orderId} executed (BUY:Market)`, "info", 1000)

                        return [...prev, {
                            last: 0,
                            side: "Buy",
                            stop_price: 0,
                            limit_price: 0,
                            color: "green",
                            order_id: orderId,
                            symbol: cryptoType,
                            price: Number(value),
                            date: new Date(),
                            type: TRAD_TYPE_NAME.MARKET,
                            status: SPOT_ORDER_STATUS.FILLED,
                            quantity: divide(value, currentCryptoData.close)
                        }]
                    })

                    setMarketOrdersMarks(prev => [...prev, {
                        time: Number(currentCryptoData.time),
                        position: "aboveBar",
                        color: "green",
                        shape: "arrowUp",
                        size: 1.5,
                        id: `market_${orderId}`,
                        text: `BUY @ $${value}`,
                    }])
                } else {
                    showNotification(ERROR.INSUFFICIENT, 'error', 0)
                }
                break
            case "sell":
                if (balanceTradeableCrypto >= Number(value)) {
                    let orderId = uuidv4().split("-")[0]

                    setValue("")
                    setPercent(0)

                    setBalanceUSDT(prev => plus(prev, multiply(value, currentCryptoData.close)))
                    setBalanceTradeableCrypto(prev => minus(prev, value))

                    setMarketOrders(prev => {
                        // showNotification(`Order M${orderId} placed (SELL:Market)`, "info", 500)
                        //
                        // showNotification(`Order M${orderId} executed (SELL:Market)`, "info", 1000)

                        return [...prev, {
                            color: "red",
                            side: "Sell",
                            symbol: "ETH",
                            limit_price: 0,
                            stop_price: 0,
                            order_id: orderId,
                            last: Number(price),
                            price: Number(value),
                            date: new Date(),
                            type: TRAD_TYPE_NAME.MARKET,
                            status: SPOT_ORDER_STATUS.FILLED,
                            quantity: multiply(value, currentCryptoData.close)
                        }]
                    })

                    setMarketOrdersMarks(prev => [...prev, {
                        time: Number(currentCryptoData.time),
                        position: "belowBar",
                        color: "red",
                        shape: "arrowDown",
                        size: 1.5,
                        id: `market_${orderId}`,
                        text: `SELL @ $${multiply(value, currentCryptoData.close).toFixed(2)}`,
                    }])
                } else {
                    showNotification(ERROR.INSUFFICIENT, 'error', 0)
                }
                break
        }
    }

    const rangeHandle = (percent: number) => {
        const processBalance = process === "buy" ? balanceUSDT : balanceTradeableCrypto
        const calculatedPrice = divide(multiply(processBalance, percent), 100)
        const currentPrice = calculatedPrice === 0 ? "" : calculatedPrice.toString()

        setPercent(percent)
        setValue(currentPrice)
    }

    const valueHandle = (value: string) => {
        let calculatedPercent: number = 0

        if (process === "sell") {
            if (balanceTradeableCrypto) calculatedPercent = Number(divide(multiply(value, 100), balanceTradeableCrypto).toFixed(1))
        } else {
            if (balanceUSDT) calculatedPercent = Number(divide(multiply(value, 100), balanceUSDT).toFixed(1))
        }

        setPercent(calculatedPercent >= 100 ? 100 : calculatedPercent)
        setValue(value)
    }

    return (
        <div className="spot_market">
            <Input
                name="usdt"
                value={value}
                type="number"
                rightText={process === "buy" ? "USDT" : cryptoType}
                labelText={process === "buy" ? "Order Value" : "Qty"}
                onChange={(e) => valueHandle(e.target.value)}
            />
            <InputRangeSlider
                name=""
                max={100}
                division={4}
                value={percent}
                onChange={(e) => rangeHandle(e.target.value as any)}
            />
            <TradeButton disabled={!value} onClick={tradeInMarket}/>
        </div>
    )
}

export default memo(Market)