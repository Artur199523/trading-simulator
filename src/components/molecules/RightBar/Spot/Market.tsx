import React, {memo, useEffect, useState} from "react";

import {useSimulatorOptionsContext, useSimulatorPlayerInfoContext, useSimulatorTradingChartDetailsContext, useSimulatorTradingContext} from "layouts/providers";

import {divide, minus, multiply, plus} from "utils";
import {Input, InputRange} from "components";
import TradeButton from "../TradeButton";

import {ProcessT} from "layouts/providers/type";

const Market: React.FC = () => {
    const {balanceUSDT, setBalanceUSDT, balanceTradeableCrypto, setBalanceTradeableCrypto} = useSimulatorPlayerInfoContext()
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
                    let orderId = 0

                    setValue("")
                    setPercent(0)

                    setBalanceTradeableCrypto(prev => plus(prev,divide(value,currentCryptoData.close)))
                    setBalanceUSDT(prev => minus(prev,value))

                    setMarketOrders(prev => {
                        orderId = prev.length ? prev[prev.length - 1].order_id + 1 : 1
                        return [...prev, {
                            symbol: "ETH",
                            side: "Buy",
                            type: "Market",
                            quantity: divide(value,currentCryptoData.close),
                            price: Number(value),
                            limit_price: 0,
                            stop_price: 0,
                            last: 0,
                            status: "Filled",
                            order_id: orderId,
                            date: new Date()
                        }]
                    })

                    setMarketOrdersMarks(prev => [...prev, {
                        time: Number(currentCryptoData.time),
                        position: "aboveBar",
                        color: "green",
                        shape: "arrowUp",
                        size:1.5,
                        id: `market_${orderId}`,
                        text: `BUY @ $${value}`,
                    }])
                } else {
                    alert("Insufficient USDT balance")
                }
                break
            case "sell":
                if (balanceTradeableCrypto >= Number(value)) {
                    let orderId = 0

                    setValue("")
                    setPercent(0)

                    setBalanceUSDT(prev => plus(prev,multiply(value,currentCryptoData.close)))
                    setBalanceTradeableCrypto(prev => minus(prev,value))

                    setMarketOrders(prev => {
                        orderId = prev.length ? prev[prev.length - 1].order_id + 1 : 1
                        return [...prev, {
                            symbol: "ETH",
                            side: "Sell",
                            type: "Market",
                            quantity: multiply(value,currentCryptoData.close),
                            price: Number(value),
                            limit_price: 0,
                            stop_price: 0,
                            last: Number(price),
                            status: "Filled",
                            order_id: orderId,
                            date: new Date()
                        }]
                    })

                    setMarketOrdersMarks(prev => [...prev, {
                        time: Number(currentCryptoData.time),
                        position: "belowBar",
                        color: "red",
                        shape: "arrowDown",
                        size: 1.5,
                        id: `market_${orderId}`,
                        text: `SELL @ $${multiply(value,currentCryptoData.close).toFixed(2)}`,
                    }])
                } else {
                    alert(`Insufficient ${cryptoType} balance`)
                }
                break
        }
    }

    const rangeHandle = (percent: number) => {
        const processBalance = process === "buy" ? balanceUSDT : balanceTradeableCrypto
        const calculatedPrice = divide(multiply(processBalance,percent),100)
        const currentPrice = calculatedPrice === 0 ? "" : processBalance.toString()

        setPercent(percent)
        setValue(currentPrice)
    }

    const valueHandle = (value: string) => {
        setPercent(0)
        setValue(value)
    }

    return (
        <div className="spot_market">
            <Input
                name="price"
                type="number"
                value={price}
                disabled={true}
                placeholder="Price"
                onChange={(e) => setPrice(e.target.value)}
            />
            <Input
                name="usdt"
                value={value}
                type="number"
                placeholder={process === "buy" ? "USDT" : "ETH"}
                onChange={(e) => valueHandle(e.target.value)}
            />
            <InputRange value={percent} onChange={(e) => rangeHandle(e as any)}/>
            <TradeButton onClick={tradeInMarket}/>
        </div>
    )
}

export default memo(Market)