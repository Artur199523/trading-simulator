import React, {useEffect, useState} from "react";
import {v4 as uuidv4} from 'uuid'

import {
    useSimulatorTradingContext,
    useSimulatorOptionsContext,
    useSimulatorPlayerInfoContext,
    useSimulatorTradingChartDetailsContext
} from "layouts/providers";
import {divide, ERROR, minus, multiply, plus, showNotification, SPOT_ORDER_STATUS, TRAD_TYPE_NAME} from "utils";

import {Input, InputRangeSlider} from "components";
import TradeButton from "../TradeButton";

import {OrderITF, ProcessT} from "layouts/providers/type";

const LimitOrder: React.FC = () => {
    const {balanceUSDT, balanceTradeableCrypto, setBalanceUSDT, setBalanceTradeableCrypto} = useSimulatorPlayerInfoContext()
    const {currentCryptoData, setLimitOrders, setLimitOrdersMarks} = useSimulatorTradingChartDetailsContext()
    const {cryptoType} = useSimulatorOptionsContext()
    const {process} = useSimulatorTradingContext()

    const [priceUSDT, setPriceUSDT] = useState<number | string>("")
    const [quantityCrypto, setQuantityCrypto] = useState("")
    const [totalPrice, setTotalPrice] = useState("")
    const [percent, setPercent] = useState(0)

    const currentBalance = process === "buy" ? balanceUSDT : balanceTradeableCrypto

    useEffect(() => {
        setPriceUSDT(currentCryptoData.close)
        setQuantityCrypto("")
        setPercent(0)
        setTotalPrice("")
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [process]);

    useEffect(() => {
        if (!priceUSDT) {
            setPriceUSDT(Number(currentCryptoData?.close))
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentCryptoData]);

    const priceUSDTHandle = (e: string) => {
        setPercent(0)
        setPriceUSDT(e)

        if (quantityCrypto) {
            setTotalPrice(multiply(quantityCrypto, e).toString())
        }
    }

    const totalUSDTHandle = (price: string) => {
        let calculatedPercent: number = 0
        const quantityPrice = divide(price, priceUSDT).toString()

        if (process === "sell") {
            if (balanceTradeableCrypto) calculatedPercent = Number(divide(multiply(quantityPrice, 100), balanceTradeableCrypto).toFixed(1))
        } else {
            if (balanceUSDT) calculatedPercent = Number(divide(multiply(price, 100), currentBalance).toFixed(1))
        }

        setTotalPrice(price)
        setQuantityCrypto(Number(quantityPrice) === 0 ? "" : quantityPrice)
        setPercent(calculatedPercent > 100 ? 100 : calculatedPercent)
    }

    const rangeHandle = (percent: number) => {
        const calculatedPrice = divide(multiply(currentBalance, percent), 100)

        const currentPrice = calculatedPrice.toString()
        const totalPrice = multiply(calculatedPrice, priceUSDT).toString()
        const quantityCrypto = divide(currentPrice, priceUSDT).toString()

        setPercent(percent)

        if (process === "sell") {
            setQuantityCrypto(currentPrice.toString())
            setTotalPrice(totalPrice)
        } else {
            setTotalPrice(currentPrice)
            setQuantityCrypto(quantityCrypto)
        }

        if (Number(percent) === 0 || Number(currentPrice) === 0 || Number(totalPrice) === 0) {
            setTotalPrice("")
            setQuantityCrypto("")
        }
    }

    const quantityHandle = (quantity: string) => {
        let calculatedPercent: number = 0
        const totalPrice = multiply(quantity, priceUSDT)

        if (process === "sell") {
            if (balanceTradeableCrypto) calculatedPercent = Number(divide(multiply(quantity, 100), balanceTradeableCrypto).toFixed(1))
        } else {
            if (balanceUSDT) calculatedPercent = Number(divide(multiply(multiply(quantity, priceUSDT), 100), balanceUSDT).toFixed(1))
        }

        setQuantityCrypto(quantity)
        setPercent(calculatedPercent > 100 ? 100 : calculatedPercent)
        setTotalPrice(totalPrice === 0 ? "" : totalPrice.toString())
    }

    const tradeInLimitOrder = (side: ProcessT) => {

        const resetData = () => {
            setPercent(0)
            setTotalPrice("")
            setQuantityCrypto("")
        }

        switch (side) {
            case "buy":
                if (priceUSDT >= currentCryptoData.close) {
                    const currentPrice = Number(multiply(currentCryptoData.close, quantityCrypto))

                    if (currentBalance >= currentPrice) {
                        let orderId = uuidv4().split("-")[0]

                        setBalanceTradeableCrypto(prev => plus(prev, quantityCrypto))
                        setBalanceUSDT(prev => minus(prev, currentPrice))
                        resetData()

                        setLimitOrders((prev: OrderITF[]) => {
                            // showNotification(`Order L${orderId} placed (BUY:Limit)`, "info", 500)
                            //
                            // showNotification(`Order L${orderId} executed (BUY:Limit)`, "info", 1000)

                            return [...prev, {
                                last: 0,
                                price: 0,
                                side: "Buy",
                                stop_price: 0,
                                color: "green",
                                date: new Date(),
                                order_id: orderId,
                                symbol: cryptoType,
                                type: TRAD_TYPE_NAME.LIMIT,
                                quantity: Number(quantityCrypto),
                                status: SPOT_ORDER_STATUS.FILLED,
                                limit_price: Number(currentCryptoData.close)
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
                        showNotification(ERROR.INSUFFICIENT, "error", 0)
                    }
                } else {
                    if (balanceUSDT >= Number(totalPrice)) {
                        let orderId = uuidv4().split("-")[0]

                        setBalanceUSDT(prev => prev - Number(totalPrice))
                        resetData()

                        setLimitOrders((prev: OrderITF[]) => {
                            // showNotification(`Order L${orderId} placed (BUY:Limit)`, "info", 500)

                            return [...prev, {
                                last: 0,
                                price: 0,
                                side: "Buy",
                                color: "green",
                                stop_price: 0,
                                date: new Date(),
                                order_id: orderId,
                                symbol: cryptoType,
                                type: TRAD_TYPE_NAME.LIMIT,
                                limit_price: Number(priceUSDT),
                                quantity: Number(quantityCrypto),
                                status: SPOT_ORDER_STATUS.WORKING
                            }]
                        })
                    } else {
                        showNotification(ERROR.INSUFFICIENT, "error", 0)
                    }
                }
                break
            case "sell":
                if (priceUSDT < currentCryptoData.close) {

                    if (balanceTradeableCrypto >= Number(quantityCrypto)) {
                        let orderId = uuidv4().split("-")[0]

                        setBalanceTradeableCrypto(prev => minus(prev, quantityCrypto))
                        setBalanceUSDT(prev => plus(prev, multiply(quantityCrypto, priceUSDT)))
                        resetData()

                        setLimitOrders((prev: OrderITF[]) => {
                            // showNotification(`Order L${orderId} placed (SELL:Limit)`, "info", 500)
                            //
                            // showNotification(`Order L${orderId} executed (SELL:Limit)`, "info", 1000)

                            return [...prev, {
                                last: 0,
                                price: 0,
                                color: "red",
                                side: "Sell",
                                stop_price: 0,
                                date: new Date(),
                                order_id: orderId,
                                symbol: cryptoType,
                                type: TRAD_TYPE_NAME.LIMIT,
                                limit_price: Number(priceUSDT),
                                quantity: Number(quantityCrypto),
                                status: SPOT_ORDER_STATUS.FILLED
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
                        showNotification(ERROR.INSUFFICIENT, "error", 0)
                    }
                } else {
                    if (balanceTradeableCrypto >= Number(quantityCrypto)) {
                        let orderId = uuidv4().split("-")[0]

                        setBalanceTradeableCrypto(prev => minus(prev, quantityCrypto))
                        resetData()

                        setLimitOrders((prev: OrderITF[]) => {
                            // showNotification(`Order L${orderId} placed (SELL:Limit)`, "info", 500)

                            return [...prev, {
                                last: 0,
                                price: 0,
                                color: "red",
                                side: "Sell",
                                stop_price: 0,
                                date: new Date(),
                                order_id: orderId,
                                symbol: cryptoType,
                                type: TRAD_TYPE_NAME.LIMIT,
                                limit_price: Number(priceUSDT),
                                quantity: Number(quantityCrypto),
                                status: SPOT_ORDER_STATUS.WORKING
                            }]
                        })
                    } else {
                        showNotification(ERROR.INSUFFICIENT, "error", 0)
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
                rightText="USDT"
                value={priceUSDT}
                labelText="Order Price"
                onChange={(e) => priceUSDTHandle(e.target.value)}
            />
            <Input
                name="crypto"
                type="number"
                labelText="Qty"
                value={quantityCrypto}
                rightText={cryptoType}
                onChange={(e) => quantityHandle(e.target.value)}
            />
            <InputRangeSlider
                name=""
                max={100}
                division={4}
                value={percent}
                onChange={(e) => rangeHandle(e.target.value as any)}
                disabled={!priceUSDT || (process === "sell" ? !balanceTradeableCrypto : !balanceUSDT)}
            />
            <Input
                type="number"
                rightText="USDT"
                name="totalUSDT"
                value={totalPrice}
                labelText="Order value"
                onChange={(e) => totalUSDTHandle(e.target.value)}
            />
            <TradeButton disabled={(!priceUSDT || !quantityCrypto)} onClick={tradeInLimitOrder}/>
        </div>
    )
}

export default LimitOrder