import React, {memo, useEffect, useState} from "react";

import {useSimulatorPlayerInfoContext, useSimulatorTradingChartDetailsContext, useSimulatorTradingContext} from "layouts/providers";

import {Input, InputRange} from "components";
import TradeButton from "../TradeButton";
import {ProcessT} from "layouts/providers/type";

const Market: React.FC = () => {
    const {process} = useSimulatorTradingContext()
    const {currentCryptoData, setMarketOrders, setMarketOrdersMarks, marketOrders, marketOrdersMarks} = useSimulatorTradingChartDetailsContext()
    const {balanceUSDT, setBalanceUSDT, balanceTradeableCrypto, setBalanceTradeableCrypto} = useSimulatorPlayerInfoContext()

    const [price, setPrice] = useState("")
    const [percent, setPercent] = useState(0)
    const [value, setValue] = useState("")

    useEffect(() => {
        setValue("")
    }, [process]);

    console.log(balanceUSDT, balanceTradeableCrypto, marketOrders, marketOrdersMarks)

    const tradeInMarket = (side: ProcessT) => {
        switch (side) {
            case "buy":
                if (Number(value) <= balanceUSDT) {
                    let orderId = 0

                    setValue("")
                    setPercent(0)

                    setBalanceTradeableCrypto(prev => prev + (Number(value) / currentCryptoData.close))
                    setBalanceUSDT(prev => prev - Number(value))

                    setMarketOrders(prev => {
                        orderId = prev.length ? prev[prev.length - 1].order_id + 1 : 1
                        return [...prev, {
                            symbol: "ETH",
                            side: "Buy",
                            type: "Market",
                            quantity: Number(value) / currentCryptoData.close,
                            price: Number(value),
                            limit_price: 0,
                            stop_price: 0,
                            last: Number(price),
                            status: "Filled",
                            order_id: prev.length ? prev[prev.length - 1].order_id + 1 : 1
                        }]
                    })

                    setMarketOrdersMarks(prev => [...prev, {
                        time: Number(currentCryptoData.time),
                        position: "aboveBar",
                        color: "green",
                        shape: 'circle',
                        id: `market_${orderId}`,
                        text: `BUY @ ${currentCryptoData.close}`,
                    }])
                } else {
                    alert("You do not have usdt")
                }
                break
            case "sell":
                if (Number(value) <= balanceTradeableCrypto) {
                    let orderId = 0

                    setValue("")
                    setPercent(0)

                    setBalanceUSDT(prev => prev + (Number(value) * currentCryptoData.close))
                    setBalanceTradeableCrypto(prev => prev - Number(value))

                    setMarketOrders(prev => {
                        orderId = prev.length ? prev[prev.length - 1].order_id + 1 : 1
                        return [...prev, {
                            symbol: "ETH",
                            side: "Sell",
                            type: "Market",
                            quantity: Number(value) * currentCryptoData.close,
                            price: Number(value),
                            limit_price: 0,
                            stop_price: 0,
                            last: Number(price),
                            status: "Filled",
                            order_id: prev.length ? prev[prev.length - 1].order_id + 1 : 1
                        }]
                    })

                    setMarketOrdersMarks(prev => [...prev, {
                        time: Number(currentCryptoData.time),
                        position: "belowBar",
                        color: "red",
                        shape: 'circle',
                        id: `market_${orderId}`,
                        text: `SELL @ ${currentCryptoData.close}`,
                    }])
                } else {
                    alert("You do not have crypto")
                }
                break
        }
    }

    const rangeHandle = (e: number) => {
        setPercent(e)
        const processBalance = process === "buy" ? balanceUSDT : balanceTradeableCrypto
        const currentPrice = ((processBalance * e) / 100).toString() === "0" ? "" : ((processBalance * e) / 100).toString()

        setValue(currentPrice)
    }

    const usdtHandle = (e: string) => {
        setPercent(0)
        setValue(e)
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
                onChange={(e) => usdtHandle(e.target.value)}
            />
            <InputRange value={percent} onChange={(e) => rangeHandle(e as any)}/>
            <TradeButton onClick={tradeInMarket}/>
        </div>
    )
}

export default memo(Market)