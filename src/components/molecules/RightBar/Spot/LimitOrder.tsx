import React, {useEffect, useState} from "react";

import {
    useSimulatorTradingContext,
    useSimulatorOptionsContext,
    useSimulatorPlayerInfoContext,
    useSimulatorTradingChartDetailsContext
} from "layouts/providers";
import {divide, minus, multiply, plus} from "utils";

import {Input, InputRange} from "components";
import TradeButton from "../TradeButton";

import {OrderITF, ProcessT} from "layouts/providers/type";

const LimitOrder: React.FC = () => {
    const {balanceUSDT, balanceTradeableCrypto, setBalanceUSDT, setBalanceTradeableCrypto} = useSimulatorPlayerInfoContext()
    const {currentCryptoData, setLimitOrders, setLimitOrdersMarks, limitOrders, limitOrdersMarks} = useSimulatorTradingChartDetailsContext()
    const {cryptoType} = useSimulatorOptionsContext()
    const {process} = useSimulatorTradingContext()

    // console.log(limitOrders, limitOrdersMarks)

    const [priceUSDT, setPriceUSDT] = useState<number | string>("")
    const [quantityCrypto, setQuantityCrypto] = useState("")
    const [totalPrice, setTotalPrice] = useState("")
    const [percent, setPercent] = useState(0)

    const currentBalance = process === "buy" ? balanceUSDT : balanceTradeableCrypto

    useEffect(() => {
        setPriceUSDT("")
        setQuantityCrypto("")
        setPercent(0)
        setTotalPrice("")
    }, [process]);

    useEffect(() => {
        if (!priceUSDT) {
            setPriceUSDT(Number(currentCryptoData?.close))
        }
    }, [currentCryptoData]);

    const priceUSDTHandle = (e: string) => {
        setPercent(0)
        setPriceUSDT(e)

        if (quantityCrypto) {
            setTotalPrice(multiply(quantityCrypto, e).toString())
        }
    }

    const totalUSDTHandle = (price: string) => {
        const quantityPrice = divide(price, priceUSDT).toString()

        setPercent(0)
        setTotalPrice(price)
        setQuantityCrypto(quantityPrice)
    }

    const rangeHandle = (percent: number) => {
        const calculatedPrice = divide(multiply(currentBalance, percent), 100)
        const currentPrice = calculatedPrice === 0 ? "" : calculatedPrice.toString()

        setPercent(percent)
        setTotalPrice(currentPrice)
        setQuantityCrypto(divide(currentPrice, priceUSDT).toString())
    }

    const quantityHandle = (quantity: string) => {
        setPercent(0)
        setQuantityCrypto(quantity)
        setTotalPrice(multiply(quantity, priceUSDT).toString())
    }

    const tradeInLimitOrder = (side: ProcessT) => {

        const resetData = () => {
            setPercent(0)
            setTotalPrice("")
            setQuantityCrypto("")
        }

        switch (side) {
            case "buy":
                if (priceUSDT <= currentCryptoData.close) {
                    const currentPrice = Number(multiply(currentCryptoData.close, quantityCrypto))

                    if (currentBalance >= currentPrice) {
                        let orderId = 0

                        setBalanceTradeableCrypto(prev => plus(prev, quantityCrypto))
                        setBalanceUSDT(prev => minus(prev, currentPrice))
                        resetData()

                        setLimitOrders((prev: OrderITF[]) => {
                            orderId = prev.length ? prev[prev.length - 1].order_id + 1 : 1
                            return [...prev, {
                                symbol: cryptoType,
                                side: "Buy",
                                type: "Limit",
                                quantity: Number(quantityCrypto),
                                price: 0,
                                limit_price: Number(currentCryptoData.close),
                                stop_price: 0,
                                last: 0,
                                status: "Filled",
                                order_id: orderId,
                                date: new Date()
                            }]
                        })

                        setLimitOrdersMarks(prev => [...prev, {
                            time: Number(currentCryptoData.time),
                            position: "aboveBar",
                            color: "green",
                            shape: 'arrowUp',
                            size: 1.5,
                            id: `limit_${orderId}`,
                            text: `BUY @ ${currentPrice.toFixed(2)}`,
                        }])
                    } else {
                        alert("Insufficient USDT balance")
                    }
                } else {
                    if (balanceUSDT >= Number(totalPrice)) {
                        let orderId = 0

                        setBalanceUSDT(prev => prev - Number(totalPrice))
                        resetData()

                        setLimitOrders((prev: OrderITF[]) => {
                            orderId = prev.length ? prev[prev.length - 1].order_id + 1 : 1
                            return [...prev, {
                                symbol: cryptoType,
                                side: "Buy",
                                type: "Limit",
                                quantity: Number(quantityCrypto),
                                price: 0,
                                limit_price: Number(priceUSDT),
                                stop_price: 0,
                                last: 0,
                                status: "Working",
                                order_id: orderId,
                                date: new Date()
                            }]
                        })
                    } else {
                        alert("Insufficient USDT balance")
                    }
                }
                break
            case "sell":
                if (priceUSDT < currentCryptoData.close) {

                    if (balanceTradeableCrypto >= Number(quantityCrypto)) {
                        let orderId = 0

                        setBalanceTradeableCrypto(prev => minus(prev, quantityCrypto))
                        setBalanceUSDT(prev => plus(prev, multiply(quantityCrypto, priceUSDT)))
                        resetData()

                        setLimitOrders((prev:OrderITF[]) => {
                            orderId = prev.length ? prev[prev.length - 1].order_id + 1 : 1
                            return [...prev, {
                                symbol: cryptoType,
                                side: "Sell",
                                type: "Limit",
                                quantity: Number(quantityCrypto),
                                price: 0,
                                limit_price: Number(priceUSDT),
                                stop_price: 0,
                                last: 0,
                                status: "Filled",
                                order_id: orderId,
                                date: new Date()
                            }]
                        })

                        setLimitOrdersMarks(prev => [...prev, {
                            time: Number(currentCryptoData.time),
                            position: "belowBar",
                            color: "red",
                            shape: 'arrowDown',
                            size: 1.5,
                            id: `limit_${orderId}`,
                            text: `SELL @ $${totalPrice}`,
                        }])
                    } else {
                        alert(`Insufficient ${cryptoType} balance`)
                    }
                } else {
                    if (balanceTradeableCrypto >= Number(quantityCrypto)) {
                        let orderId = 0

                        setBalanceTradeableCrypto(prev => minus(prev, quantityCrypto))
                        resetData()

                        setLimitOrders((prev: OrderITF[]) => {
                            orderId = prev.length ? prev[prev.length - 1].order_id + 1 : 1
                            return [...prev, {
                                symbol: cryptoType,
                                side: "Sell",
                                type: "Limit",
                                quantity: Number(quantityCrypto),
                                price: 0,
                                limit_price: Number(priceUSDT),
                                stop_price: 0,
                                last: 0,
                                status: "Working",
                                order_id: orderId,
                                date: new Date()
                            }]
                        })
                    } else {
                        alert(`Insufficient ${cryptoType} balance`)
                    }
                }
                break
        }
    }

    return (
        <div className="spot_limit-order">
            <Input
                name="price"
                type="number"
                value={priceUSDT}
                placeholder="Price (USDT)"
                onChange={(e) => priceUSDTHandle(e.target.value)}
            />
            <Input
                name="crypto"
                value={quantityCrypto}
                type="number"
                placeholder={`Quantity (${cryptoType})`}
                onChange={(e) => quantityHandle(e.target.value)}
            />
            <InputRange value={percent} onChange={(e) => rangeHandle(e as any)}/>
            <Input
                name="totalUSDT"
                value={totalPrice}
                type="number"
                placeholder='Total (USDT)'
                onChange={(e) => totalUSDTHandle(e.target.value)}
            />
            <TradeButton onClick={tradeInLimitOrder}/>
        </div>
    )
}

export default LimitOrder