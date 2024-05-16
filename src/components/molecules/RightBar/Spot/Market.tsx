import React, {memo, useState} from "react";
import {v4 as uuidv4} from 'uuid'

import {
    useSimulatorOptionsContext,
    useSimulatorTradingContext,
    useSimulatorPlayerInfoContext,
    useSimulatorTradingChartDetailsContext
} from "layouts/providers";
import {
    plus,
    minus,
    divide,
    multiply,
    fixedNumber,
    interruptionRef,
    showNotification,
    ERROR,
    MARK_COLOR,
    MARK_SHAPE,
    MARK_POSITION,
    TRAD_TYPE_NAME,
    SPOT_ORDER_STATUS,
    SPOT_MARKET_INPUT_FIELDS
} from "utils";

import {Input, InputRangeSlider} from "components";
import TradeButton from "../TradeButton";

import {ProcessT} from "layouts/providers/type";

const Market: React.FC = () => {
    const fields = SPOT_MARKET_INPUT_FIELDS

    const {balanceUSDT, setBalanceUSDT, balanceTradeableCrypto, setBalanceTradeableCrypto,} = useSimulatorPlayerInfoContext()
    const {currentCryptoData, setMarketOrders, setMarketOrdersMarks} = useSimulatorTradingChartDetailsContext()
    const {cryptoType} = useSimulatorOptionsContext()
    const {process} = useSimulatorTradingContext()

    const [fieldsValue, setFieldsValues] = useState(interruptionRef(fields))

    const isAvailableUSDT = balanceUSDT > 0
    const isAvailableTradableCrypto = balanceTradeableCrypto > 0

    const tradeInMarket = (side: ProcessT) => {
        const value = Number(fieldsValue[side].order_value)

        switch (side) {
            case "buy":
                if (balanceUSDT >= value) {
                    let orderId = uuidv4().split("-")[0]

                    setFieldsValues(interruptionRef(fields))

                    setBalanceTradeableCrypto(prev => plus(prev, divide(value, currentCryptoData.close)))
                    setBalanceUSDT(prev => minus(prev, value))

                    setMarketOrders(prev => {
                        return [...prev, {
                            last: 0,
                            side: "Buy",
                            price: value,
                            stop_price: 0,
                            limit_price: 0,
                            color: "green",
                            date: new Date(),
                            order_id: orderId,
                            symbol: cryptoType,
                            type: TRAD_TYPE_NAME.MARKET,
                            status: SPOT_ORDER_STATUS.FILLED,
                            quantity: divide(value, currentCryptoData.close)
                        }]
                    })

                    setMarketOrdersMarks(prev => [...prev, {
                        size: 1.5,
                        id: `market_${orderId}`,
                        text: `BUY @ $${value}`,
                        color: MARK_COLOR.GREEN,
                        shape: MARK_SHAPE.ARROW_UP,
                        position: MARK_POSITION.ABOVE_BAR,
                        time: Number(currentCryptoData.time),
                    }])
                } else {
                    showNotification(ERROR.INSUFFICIENT, 'error', 0)
                }
                break
            case "sell":
                if (balanceTradeableCrypto >= value) {
                    let orderId = uuidv4().split("-")[0]

                    setFieldsValues(interruptionRef(fields))

                    setBalanceUSDT(prev => plus(prev, multiply(value, currentCryptoData.close)))
                    setBalanceTradeableCrypto(prev => minus(prev, value))

                    setMarketOrders(prev => {
                        return [...prev, {
                            last: 0,
                            color: "red",
                            side: "Sell",
                            price: value,
                            stop_price: 0,
                            limit_price: 0,
                            date: new Date(),
                            order_id: orderId,
                            symbol: cryptoType,
                            type: TRAD_TYPE_NAME.MARKET,
                            status: SPOT_ORDER_STATUS.FILLED,
                            quantity: multiply(value, currentCryptoData.close)
                        }]
                    })

                    setMarketOrdersMarks(prev => [...prev, {
                        size: 1.5,
                        color: MARK_COLOR.RED,
                        id: `market_${orderId}`,
                        shape: MARK_SHAPE.ARROW_DOWN,
                        position: MARK_POSITION.BELLOW_BAR,
                        time: Number(currentCryptoData.time),
                        text: `SELL @ $${multiply(value, currentCryptoData.close).toFixed(2)}`,
                    }])
                } else {
                    showNotification(ERROR.INSUFFICIENT, 'error', 0)
                }
                break
        }
    }

    const inputHandle = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {value, name} = event.target
        const fieldsValueCopy = {...fieldsValue}
        const path = fieldsValueCopy[process]

        const currentBalance = process === "buy" ? balanceUSDT : balanceTradeableCrypto

        path[name] = value

        switch (name) {
            case "order_value":
                if ((process === "buy" && isAvailableUSDT) || (process === "sell" && isAvailableTradableCrypto)) {
                    let calculatedPercent: number = divide(multiply(value, 100), currentBalance)

                    path.percent = calculatedPercent > 100 ? 100 : fixedNumber(calculatedPercent, 1)
                }
                break
            case "percent":
                const calculatedPrice = divide(multiply(currentBalance, value), 100)

                path.order_value = calculatedPrice > 0 ? fixedNumber(calculatedPrice, 2) : ""
                break
        }

        setFieldsValues(fieldsValueCopy)
    }

    return (
        <div className="spot_market">
            <Input
                type="number"
                name="order_value"
                value={fieldsValue[process].order_value}
                rightText={process === "buy" ? "USDT" : cryptoType}
                labelText={process === "buy" ? "Order Value" : "Qty"}
                onChange={(e) => inputHandle(e)}
            />
            <InputRangeSlider
                max={100}
                division={4}
                name="percent"
                value={fieldsValue[process].percent}
                onChange={(e) => inputHandle(e)}
                disabled={process === "buy" ? !isAvailableUSDT : !isAvailableTradableCrypto}
            />
            <TradeButton disabled={!fieldsValue[process].order_value} onClick={tradeInMarket}/>
        </div>
    )
}

export default memo(Market)