import React, {useEffect, useState} from "react";
import {v4 as uuidv4} from 'uuid';

import {
    useSimulatorToolsContext,
    useSimulatorOptionsContext,
    useSimulatorTradingContext,
    useFuturesTradingModalContext,
    useSimulatorTradingChartDetailsContext
} from "layouts/providers";
import {CALL_ENVIRONMENT, MODALS, ORDER_STATUS, ORDER_TYPE, TRAD_TYPE, TRADE_POSITION, TRADE_TYPE, TRIGGER_PRICE_TYPE, TRIGGERS} from "utils";

import {Button, Input, InputRangeSlider, ModalWindowTemplate} from "components";
import {interruptionRef} from "utils/functions/interruptionRef";
import TPSLTrigger from "../Components/TPSLTrigger";

import {HeaderItemITF, InputOptionsITF, PositionDataITF, SettingsFieldsITF, TPSLDataForModalITF} from "../type";
import {OrderColorT, OrderHistoryTPSLITF} from "layouts/providers/type";

import "./style.scss"

const settingsFields: SettingsFieldsITF = {
    Long: {
        current_profit_trigger: TRIGGERS.ROI,
        current_stop_trigger: TRIGGERS.ROI,
        profit_trigger_price: "",
        profit_trigger_profit: "",
        profit_percent: 0,
        profit_validation: {issue: false, message: "The Take Profit price must be higher than the order price"},
        stop_trigger_price: "",
        stop_trigger_stop: "",
        stop_percent: 0,
        stop_validation: {issue: false, message: "The Stop Loss price must be lower than the order price"},
        name: TRADE_POSITION.LONG,
        order_No: ""
    },
    Short: {
        current_profit_trigger: TRIGGERS.ROI,
        current_stop_trigger: TRIGGERS.ROI,
        profit_trigger_price: "",
        profit_trigger_profit: "",
        profit_percent: 0,
        profit_validation: {issue: false, message: "The Take Profit price must be lower than the order price"},
        stop_trigger_price: "",
        stop_trigger_stop: "",
        stop_percent: 0,
        stop_validation: {issue: false, message: "The Stop Loss price must be higher than the order price"},
        name: TRADE_POSITION.SHORT,
        order_No: ""
    }
}

const TPSL: React.FC = () => {
    const settingsFieldsCopy = interruptionRef(settingsFields)

    const {cryptoType} = useSimulatorOptionsContext()
    const {setCurrentSpeed} = useSimulatorToolsContext()
    const {adjustLeverage} = useSimulatorTradingContext()
    const {currentCryptoData} = useSimulatorTradingChartDetailsContext()
    const {setCurrentModal} = useFuturesTradingModalContext()
    const {dataForModal} = useFuturesTradingModalContext<TPSLDataForModalITF>()
    const {
        currentOrdersTPSL,
        serOrderHistoryTPSL,
        setCurrentOrdersTPSL,
        longPositionDataTPSL,
        shortPositionDataTPSL,
        confirmedLongPositionData,
        confirmedShortPositionData,
        confirmedLongPositionDataTPSL,
        confirmedShortPositionDataTPSL,
        setLongPositionDataTPSL,
        setShortPositionDataTPSL,
        setConfirmedLongPositionDataTPSL,
        setConfirmedShortPositionDataTPSL,
    } = useSimulatorTradingChartDetailsContext()

    const [activeTradeType, setActiveTradeType] = useState<TRADE_POSITION>(dataForModal.tradePosition ?? TRADE_POSITION.LONG)

    const [fieldsValue, setFieldsValue] = useState(settingsFieldsCopy)

    const isInsideAction = dataForModal.call === CALL_ENVIRONMENT.INSIDE
    const isLongPositionActiveType = activeTradeType === TRADE_POSITION.LONG

    const currentPrice = dataForModal.tradType === TRAD_TYPE.LIMIT ? Number(dataForModal.orderPrice) : isInsideAction ? isLongPositionActiveType ? confirmedLongPositionData.entry_price : confirmedShortPositionData.entry_price : currentCryptoData.close
    const [isUpdate, setIsUpdate] = useState(false)

    useEffect(() => {
        setCurrentSpeed(1)

        if (longPositionDataTPSL && dataForModal.call === CALL_ENVIRONMENT.OUTSIDE) {
            setFieldsValue((prev: SettingsFieldsITF) => ({...prev, Long: longPositionDataTPSL}))
            setActiveTradeType(TRADE_POSITION.LONG)
        }

        if (shortPositionDataTPSL && dataForModal.call === CALL_ENVIRONMENT.OUTSIDE) {
            setFieldsValue((prev: SettingsFieldsITF) => ({...prev, Short: shortPositionDataTPSL}))
            setActiveTradeType(TRADE_POSITION.SHORT)
        }

        if (confirmedLongPositionDataTPSL && dataForModal.call === CALL_ENVIRONMENT.INSIDE) {
            setFieldsValue((prev: SettingsFieldsITF) => ({...prev, Long: interruptionRef(confirmedLongPositionDataTPSL)}))
            setActiveTradeType(TRADE_POSITION.LONG)
            setIsUpdate(true)
        }

        if (confirmedShortPositionDataTPSL && dataForModal.call === CALL_ENVIRONMENT.INSIDE) {
            setFieldsValue((prev: SettingsFieldsITF) => ({...prev, Short: interruptionRef(confirmedShortPositionDataTPSL)}))
            setActiveTradeType(TRADE_POSITION.SHORT)
            setIsUpdate(true)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const inputOptions = (trigger: TRIGGERS, type?: ORDER_TYPE): InputOptionsITF => {
        switch (trigger) {
            case TRIGGERS.ROI:
                return {placeholder: "ROI", rightText: "%", sliderOneRange: {max: 150, division: 3}, sliderTwoRange: {max: 75, division: 3}}
            case TRIGGERS.CHANGE:
                return {
                    placeholder: activeTradeType === TRADE_POSITION.LONG ? type === ORDER_TYPE.PROFIT ? "Increase" : "Decrease" : type === ORDER_TYPE.PROFIT ? "Decrease" : "Increase",
                    rightText: "%",
                    sliderOneRange: {max: 25, division: 5},
                    sliderTwoRange: {max: 10, division: 2}
                }
            case TRIGGERS.PL:
                return {placeholder: type === ORDER_TYPE.PROFIT ? "Profit" : "Loss", rightText: "USDT"}
        }
    }

    //@TODO need to check all logic
    const inputHandle = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target
        const fieldsValueCopy = {...fieldsValue}
        const path = fieldsValueCopy[activeTradeType]

        const calculateROI = (currentPrice: number, triggerPrice: number, leverage: number): number => {
            return Number((((triggerPrice - currentPrice) / currentPrice) * leverage * 100).toFixed(2));
        }

        const calculateChange = (currentPrice: number, triggerPrice: number): number => {
            if (triggerPrice < currentPrice) {
                return Number((triggerPrice * 100 / currentPrice).toFixed(2))
            } else {
                return Number((((triggerPrice - currentPrice) * 100) / currentPrice).toFixed(2))
            }
        }

        const calculateTriggerPrice = (currentPrice: number, roi: number, leverage: number): number => {
            if (activeTradeType === TRADE_POSITION.LONG) {
                return Number((((roi / (leverage * 100)) * currentPrice) + currentPrice).toFixed(2));
            } else {
                return Number((currentPrice - ((roi / (leverage * 100)) * currentPrice)).toFixed(2));
            }
        }

        const calculateTriggerPriceByPercent = (currentPrice: number, percent: number): number => {
            return Number((currentPrice * percent / 100).toFixed(2))
        }

        const calculateProfitPriceByTrigger = (value: number) => {
            return Number(((((((value - currentPrice) * 100) / currentPrice) * adjustLeverage) * (orderValue / adjustLeverage)) / 100).toFixed(2))
        }

        const calculateTriggerPriceByProfit = (value: number) => {
            const calculatedPrice = Number(((value * currentPrice * adjustLeverage) / (orderValue * adjustLeverage) + currentPrice).toFixed(2))

            if (activeTradeType === TRADE_POSITION.LONG) {
                return calculatedPrice
            } else {
                return Number((currentPrice - (calculatedPrice - currentPrice)).toFixed(2))
            }
        }

        const inputValidation = (value: number | string, type: ORDER_TYPE, isReset = false) => {
            const currentValue = Number(value)

            if (!currentValue || isReset) {
                path[`${type}_validation`] = {...path[`${type}_validation`], issue: false}
                return
            }

            if (activeTradeType === TRADE_POSITION.LONG) {
                if (type === ORDER_TYPE.PROFIT) {
                    path.profit_validation = {...path.profit_validation, issue: !(currentValue > currentPrice)}
                } else {
                    path.stop_validation = {...path.stop_validation, issue: !(currentValue < currentPrice)}
                }
            } else {
                if (type === ORDER_TYPE.PROFIT) {
                    path.profit_validation = {...path.profit_validation, issue: !(currentValue < currentPrice)}
                } else {
                    path.stop_validation = {...path.stop_validation, issue: !(currentValue > currentPrice)}
                }
            }
        }

        path[name] = value

        const valueToNumber = Number(value)

        switch (name) {
            case "profit_trigger_price":
                switch (path.current_profit_trigger) {
                    case TRIGGERS.ROI:
                        const calculatedROI = calculateROI(currentPrice, valueToNumber, adjustLeverage)

                        if (activeTradeType === TRADE_POSITION.LONG) {
                            path.profit_trigger_profit = value ? calculatedROI : ""
                            path.profit_percent = valueToNumber > currentPrice ? calculatedROI : 0
                        } else {
                            path.profit_trigger_profit = valueToNumber > currentPrice ? -calculatedROI : value ? Math.abs(calculatedROI) : ""
                            path.profit_percent = valueToNumber < currentPrice ? Math.abs(calculatedROI as number) : 0
                        }

                        inputValidation(value, ORDER_TYPE.PROFIT)
                        break
                    case TRIGGERS.CHANGE:
                        const calculatedChange = calculateChange(currentPrice, valueToNumber)

                        if (activeTradeType === TRADE_POSITION.LONG) {
                            path.profit_trigger_profit = valueToNumber < currentPrice ? valueToNumber ? -(100 - calculatedChange).toFixed(2) : "" : calculatedChange
                            path.profit_percent = valueToNumber > currentPrice ? calculatedChange : 0
                        } else {
                            path.profit_trigger_profit = value && valueToNumber < currentPrice ? -(100 - calculatedChange).toFixed(2) : calculatedChange
                            path.profit_percent = valueToNumber < currentPrice ? -calculatedChange : 0
                        }

                        inputValidation(valueToNumber, ORDER_TYPE.PROFIT)
                        break
                    case TRIGGERS.PL:
                        const calculatedProfitPriceByTrigger = calculateProfitPriceByTrigger(valueToNumber)

                        if (activeTradeType === TRADE_POSITION.LONG) {
                            path.profit_trigger_profit = valueToNumber ? calculatedProfitPriceByTrigger : ""
                        } else {
                            path.profit_trigger_profit = value ? valueToNumber < currentPrice ? Math.abs(calculatedProfitPriceByTrigger as number) : -calculatedProfitPriceByTrigger : ""
                        }

                        inputValidation(value, ORDER_TYPE.PROFIT)
                        break
                }
                break
            case "profit_trigger_profit":
                switch (path.current_profit_trigger) {
                    case TRIGGERS.ROI:
                        const calculatedTriggerPrice = calculateTriggerPrice(currentPrice, valueToNumber, adjustLeverage)

                        path.profit_trigger_price = valueToNumber ? calculatedTriggerPrice : ""
                        path.profit_percent = valueToNumber ? value : 0

                        inputValidation(calculatedTriggerPrice, ORDER_TYPE.PROFIT, !valueToNumber)
                        break
                    case TRIGGERS.CHANGE:
                        const calculatedTriggerPriceByPercent = calculateTriggerPriceByPercent(currentPrice, valueToNumber)
                        const calculatedTotalPrice = Number((calculatedTriggerPriceByPercent + currentPrice).toFixed(2))

                        if (activeTradeType === TRADE_POSITION.LONG) {
                            path.profit_trigger_price = valueToNumber ? calculatedTotalPrice : ""
                            path.profit_percent = calculatedTotalPrice > currentPrice ? valueToNumber : 0
                        } else {
                            path.profit_trigger_price = valueToNumber ? calculatedTotalPrice : ""
                            path.profit_percent = valueToNumber < 0 ? calculatedTotalPrice > 0 ? Math.abs(valueToNumber) : 0 : 0
                        }

                        inputValidation(calculatedTotalPrice, ORDER_TYPE.PROFIT, !valueToNumber)
                        break
                    case TRIGGERS.PL:
                        const calculatedTriggerPriceByProfit = calculateTriggerPriceByProfit(valueToNumber)

                        if (activeTradeType === TRADE_POSITION.LONG) {
                            path.profit_trigger_price = valueToNumber ? valueToNumber > 0 ? calculatedTriggerPriceByProfit : calculatedTriggerPriceByProfit > 0 ? calculatedTriggerPriceByProfit : 0 : ""
                        } else {
                            path.profit_trigger_price = valueToNumber ? valueToNumber > 0 && calculatedTriggerPriceByProfit > 0 ? calculatedTriggerPriceByProfit : valueToNumber < 0 ? calculatedTriggerPriceByProfit : 0 : ""
                        }

                        inputValidation(calculatedTriggerPriceByProfit as number, ORDER_TYPE.PROFIT, !valueToNumber)
                        break
                }
                break
            case "profit_percent":
                switch (path.current_profit_trigger) {
                    case TRIGGERS.ROI:
                        const calculatedTriggerPrice = calculateTriggerPrice(currentPrice, valueToNumber, adjustLeverage)

                        path.profit_trigger_price = valueToNumber ? calculatedTriggerPrice : ""
                        path.profit_trigger_profit = valueToNumber ? value : ""

                        inputValidation(calculatedTriggerPrice, ORDER_TYPE.PROFIT)
                        break
                    case TRIGGERS.CHANGE:
                        const calculatedTriggerPriceByPercent = calculateTriggerPriceByPercent(currentPrice, valueToNumber)

                        if (activeTradeType === TRADE_POSITION.LONG) {
                            const totalPrice = (calculatedTriggerPriceByPercent + currentPrice).toFixed(2)

                            path.profit_trigger_price = valueToNumber ? totalPrice : ""
                            path.profit_trigger_profit = valueToNumber ? valueToNumber : ""

                            inputValidation(totalPrice, ORDER_TYPE.PROFIT, !valueToNumber)
                        } else {
                            const totalPrice = (currentPrice - calculatedTriggerPriceByPercent).toFixed(2)

                            path.profit_trigger_price = valueToNumber ? totalPrice : ""
                            path.profit_trigger_profit = valueToNumber ? -valueToNumber : ""

                            inputValidation(totalPrice, ORDER_TYPE.PROFIT, !valueToNumber)
                        }
                        break
                }
                break
            case "stop_trigger_price":
                switch (path.current_stop_trigger) {
                    case TRIGGERS.ROI:
                        const calculatedROI = calculateROI(currentPrice, valueToNumber, adjustLeverage)

                        if (activeTradeType === TRADE_POSITION.LONG) {
                            path.stop_trigger_stop = valueToNumber ? calculatedROI : ""
                            path.stop_percent = valueToNumber > currentPrice ? 0 : valueToNumber > 0 ? Math.abs(calculatedROI) : 0
                        } else {
                            path.stop_trigger_stop = valueToNumber ? -calculatedROI : ""
                            path.stop_percent = valueToNumber < currentPrice ? 0 : valueToNumber > 0 ? Math.abs(calculatedROI) : 0
                        }

                        inputValidation(value, ORDER_TYPE.STOP)
                        break
                    case TRIGGERS.CHANGE:
                        const calculatedTriggerPriceByPercent = calculateChange(currentPrice, valueToNumber)

                        if (activeTradeType === TRADE_POSITION.LONG) {
                            path.stop_trigger_stop = valueToNumber ? -(100 - calculatedTriggerPriceByPercent).toFixed(2) : ""
                            path.stop_percent = valueToNumber < currentPrice ? 100 - calculatedTriggerPriceByPercent : 0
                        } else {
                            path.stop_trigger_stop = valueToNumber ? calculatedTriggerPriceByPercent : ""
                            path.stop_percent = valueToNumber > currentPrice ? calculatedTriggerPriceByPercent : 0
                        }

                        inputValidation(valueToNumber, ORDER_TYPE.STOP)
                        break
                    case TRIGGERS.PL:
                        const calculatedProfitPriceByTrigger = calculateProfitPriceByTrigger(valueToNumber)

                        if (activeTradeType === TRADE_POSITION.LONG) {
                            path.stop_trigger_stop = valueToNumber ? calculatedProfitPriceByTrigger : ""
                        } else {
                            path.stop_trigger_stop = valueToNumber < currentPrice ? valueToNumber ? Math.abs(calculatedProfitPriceByTrigger as number) : "" : -calculatedProfitPriceByTrigger
                        }

                        inputValidation(value, ORDER_TYPE.STOP)
                        break
                }
                break
            case "stop_trigger_stop":
                switch (path.current_stop_trigger) {
                    case TRIGGERS.ROI:
                        const calculatedTriggerPrice = calculateTriggerPrice(currentPrice, valueToNumber, adjustLeverage)

                        path.stop_trigger_price = valueToNumber ? calculatedTriggerPrice : ""
                        path.stop_percent = valueToNumber < 0 ? Math.abs(valueToNumber) : 0

                        inputValidation(calculatedTriggerPrice, ORDER_TYPE.STOP, !valueToNumber)
                        break
                    case TRIGGERS.CHANGE:
                        const calculatedTriggerPriceByPercent = calculateTriggerPriceByPercent(currentPrice, valueToNumber)
                        const calculatedTotalPrice = Number((currentPrice + calculatedTriggerPriceByPercent).toFixed(2))

                        if (activeTradeType === TRADE_POSITION.LONG) {
                            path.stop_trigger_price = valueToNumber ? calculatedTotalPrice : ""
                            path.stop_percent = valueToNumber < 0 ? Math.abs(valueToNumber) : 0
                        } else {
                            path.stop_trigger_price = valueToNumber ? calculatedTotalPrice : ""
                            path.stop_percent = valueToNumber < 0 ? 0 : valueToNumber
                        }

                        inputValidation(calculatedTotalPrice, ORDER_TYPE.STOP, !valueToNumber)
                        break
                    case TRIGGERS.PL:
                        const calculatedProfitPriceByTrigger = calculateTriggerPriceByProfit(valueToNumber)

                        if (activeTradeType === TRADE_POSITION.LONG) {
                            path.stop_trigger_price = valueToNumber ? calculatedProfitPriceByTrigger : ""
                        } else {
                            path.stop_trigger_price = valueToNumber ? Math.abs(calculatedProfitPriceByTrigger as number) : valueToNumber ? calculatedProfitPriceByTrigger ? -calculatedProfitPriceByTrigger : "" : ""
                        }

                        inputValidation(calculatedProfitPriceByTrigger as number, ORDER_TYPE.STOP, !valueToNumber)
                        break
                }
                break
            case "stop_percent":
                switch (path.current_stop_trigger) {
                    case TRIGGERS.ROI:
                        const calculatedTriggerPrice = calculateTriggerPrice(currentPrice, -valueToNumber, adjustLeverage)

                        path.stop_trigger_price = valueToNumber ? calculatedTriggerPrice : ""
                        path.stop_trigger_stop = valueToNumber ? -value : ""

                        if (activeTradeType === TRADE_POSITION.LONG) {
                            inputValidation(-calculatedTriggerPrice, ORDER_TYPE.STOP, !valueToNumber)
                        } else {
                            inputValidation(calculatedTriggerPrice, ORDER_TYPE.STOP, !valueToNumber)
                        }

                        break
                    case TRIGGERS.CHANGE:
                        const calculatedTriggerPriceByPercent = calculateTriggerPriceByPercent(currentPrice, valueToNumber)

                        if (activeTradeType === TRADE_POSITION.LONG) {
                            const totalPrice = (currentPrice - calculatedTriggerPriceByPercent).toFixed(2)

                            path.stop_trigger_price = valueToNumber ? totalPrice : ""
                            path.stop_trigger_stop = valueToNumber ? -valueToNumber : ""

                            inputValidation(totalPrice, ORDER_TYPE.STOP, !valueToNumber)
                        } else {
                            const totalPrice = (currentPrice + calculatedTriggerPriceByPercent).toFixed(2)

                            path.stop_trigger_price = valueToNumber ? totalPrice : ""
                            path.stop_trigger_stop = valueToNumber ? valueToNumber : ""

                            inputValidation(totalPrice, ORDER_TYPE.STOP, !valueToNumber)
                        }
                        break
                }
        }

        setFieldsValue(fieldsValueCopy)
    }

    const triggerHandle = (trigger: TRIGGERS, name: string, type: ORDER_TYPE) => {
        setFieldsValue((prev: SettingsFieldsITF) => {
            return {
                ...prev,
                [activeTradeType]: {
                    ...prev[activeTradeType],
                    [name]: trigger,
                    [`${type}_trigger_price`]: "",
                    [`${type}_trigger_profit`]: "",
                    [`${type}_percent`]: 0,
                    [`${type}_trigger_${type}`]: "",
                    [`${type}_validation`]: {...prev[activeTradeType][`${type}_validation`], issue: false}
                }
            }
        })
    }

    const confirmMode = () => {
        //@TODO need to add position details checking like if{}
        const confirmedData: PositionDataITF = interruptionRef(fieldsValue[activeTradeType])
        const triggerProfitPrice = confirmedData.profit_trigger_price
        const triggerStopPrice = confirmedData.stop_trigger_price
        const orderNo = uuidv4().split("-")[0]

        confirmedData.order_No = orderNo

        if (currentOrdersTPSL.length) {
            const {contracts, color, order_No, trade_type, trigger_price, quantity_value, order_price} = currentOrdersTPSL[0]

            const generatedHistory: OrderHistoryTPSLITF = {
                color: color,
                order_No: order_No,
                contracts: contracts,
                trade_type: trade_type,
                order_time: new Date(),
                status: ORDER_STATUS.CANCELED,
                trigger_price: trigger_price.tp,
                trigger_price_type: TRIGGER_PRICE_TYPE.PROFIT,
                filled_actual_qty: {filled: 0, actual_qty: Number(quantity_value)},
                filled_price_order_price: {filled_price: "--", order_price: order_price}
            }

            if (!triggerProfitPrice) {
                serOrderHistoryTPSL(prev => [{...generatedHistory}, ...prev])
                setCurrentOrdersTPSL(prev => [{...prev[0], trigger_price: {...trigger_price, tp: 0,}}])
            }

            if (!triggerStopPrice) {
                serOrderHistoryTPSL(prev =>
                    [{...generatedHistory, trigger_price: trigger_price.sl, trigger_price_type: TRIGGER_PRICE_TYPE.STOP}, ...prev]
                )
                setCurrentOrdersTPSL(prev => [{...prev[0], trigger_price: {...trigger_price, sl: 0,}}])
            }

            setCurrentOrdersTPSL(prev => [{...prev[0], trigger_price: {tp: Number(triggerProfitPrice), sl: Number(triggerStopPrice)}, order_time: new Date()}])
        }

        if (!triggerProfitPrice && !triggerStopPrice) {
            setLongPositionDataTPSL(null)
            setShortPositionDataTPSL(null)
            setConfirmedShortPositionDataTPSL(null)
            setConfirmedLongPositionDataTPSL(null)
        } else {
            if (activeTradeType === TRADE_POSITION.LONG && dataForModal.call === CALL_ENVIRONMENT.OUTSIDE) {
                setLongPositionDataTPSL(confirmedData)
                setShortPositionDataTPSL(null)
            }

            if (activeTradeType === TRADE_POSITION.SHORT && dataForModal.call === CALL_ENVIRONMENT.OUTSIDE) {
                setShortPositionDataTPSL(confirmedData)
                setLongPositionDataTPSL(null)
            }

            if (activeTradeType === TRADE_POSITION.SHORT && dataForModal.call === CALL_ENVIRONMENT.INSIDE) {
                setConfirmedShortPositionDataTPSL(confirmedData)
            }

            if (activeTradeType === TRADE_POSITION.LONG && dataForModal.call === CALL_ENVIRONMENT.INSIDE) {
                setConfirmedLongPositionDataTPSL(confirmedData)
            }

            if (!currentOrdersTPSL.length) {
                const tpSlOrderData = {
                    contracts: `${cryptoType}USDT`,
                    quantity: "Entire Position",
                    quantity_value: Number(orderValue / (isInsideAction ? currentPrice : currentCryptoData.close)),
                    trigger_price: {tp: Number(confirmedData.profit_trigger_price), sl: Number(confirmedData.stop_trigger_price)},
                    order_price: "Market",
                    trade_type: activeTradeType === TRADE_POSITION.LONG ? TRADE_TYPE.CLOSE_LONG : TRADE_TYPE.CLOSE_SHORT,
                    order_No: orderNo,
                    order_time: new Date(),
                    color: (activeTradeType === TRADE_POSITION.LONG ? "red" : "green") as OrderColorT,
                }

                setCurrentOrdersTPSL(prev => [...prev, tpSlOrderData])
            }
        }

        setCurrentModal(MODALS.CLOSE)
    }

    const currentProfitTrigger: TRIGGERS = fieldsValue[activeTradeType].current_profit_trigger
    const currentStopTrigger: TRIGGERS = fieldsValue[activeTradeType].current_stop_trigger

    const profitInputOptions: InputOptionsITF = inputOptions(currentProfitTrigger, ORDER_TYPE.PROFIT)
    const stopInputOptions: InputOptionsITF = inputOptions(currentStopTrigger, ORDER_TYPE.STOP)
    const orderValue = Number(dataForModal.orderValue)

    // @TODO need to check
    // @TODO need to do that it calculate with current price
    const calculateAndRenderTPSL = (trigger: TRIGGERS, orderType: ORDER_TYPE) => {
        const profitTriggerPrice = fieldsValue[activeTradeType]["profit_trigger_price"]
        const stopTriggerPrice = fieldsValue[activeTradeType]["stop_trigger_price"]
        const stopTriggerStop = fieldsValue[activeTradeType]["stop_trigger_stop"]
        const profitTriggerProfit = fieldsValue[activeTradeType]["profit_trigger_profit"]

        const profitPercent = Number(fieldsValue[activeTradeType]["profit_percent"])
        const stopPercent = Number(fieldsValue[activeTradeType]["stop_percent"])

        const isValidStopTriggerPrice = stopTriggerPrice > 0
        const isValidProfitTriggerPrice = profitTriggerPrice > 0

        switch (trigger) {
            case TRIGGERS.ROI:
                const profitTriggerPrice_ROI = isValidProfitTriggerPrice ? profitTriggerPrice : "--"
                const profitPercent_ROI = isValidProfitTriggerPrice ? profitPercent : "--"
                const profitExpectedType_ROI = isValidProfitTriggerPrice && profitPercent > 0 ? "profit " : "loss "
                const profit_ROI = isValidProfitTriggerPrice ? Math.abs(Number((((orderValue / adjustLeverage) * profitPercent) / 100).toFixed(2))) : "--"

                const stopTriggerPrice_ROI = isValidStopTriggerPrice ? stopTriggerPrice : "--"
                const stopROI_ROI = isValidStopTriggerPrice ? -stopPercent : "--"
                const loss_ROI = isValidStopTriggerPrice ? Math.abs(Number((((orderValue / adjustLeverage) * stopPercent) / 100).toFixed(2))) : "--"

                if (orderType === ORDER_TYPE.PROFIT) {
                    return (profitTriggerPrice &&
                        <div className="futures-modal_tpls_trigger-controller_calculated-info">
                            Last Traded Price to {profitTriggerPrice_ROI} will trigger market Take Profit order; your expected {profitExpectedType_ROI} will
                            be {profit_ROI} USDT (ROI: {profitPercent_ROI}%)
                        </div>)
                } else {
                    return (stopTriggerPrice && <div className="futures-modal_tpls_trigger-controller_calculated-info">
                        Last Traded Price to {stopTriggerPrice_ROI} will trigger market Stop Loss order; your expected loss will be {loss_ROI} USDT
                        (ROI: {stopROI_ROI}%)
                    </div>)
                }
            case TRIGGERS.CHANGE:
                const profitTriggerPrice_CHANGE = isValidProfitTriggerPrice ? profitTriggerPrice : "--"
                const profit_ROI_CHANGE = isValidProfitTriggerPrice ? (profitPercent * adjustLeverage).toFixed(2) : "--"
                const profitExpectedType_CHANGE = isValidProfitTriggerPrice && profitPercent > 0 ? "profit " : "loss "
                const profit_CHANGE = isValidProfitTriggerPrice ? Math.abs(Number((((orderValue / adjustLeverage) * (profitPercent * adjustLeverage)) / 100).toFixed(2))) : "--"

                const stopTriggerPrice_CHANGE = isValidStopTriggerPrice ? stopTriggerPrice : "--"
                const stopROI_CHANGE = isValidStopTriggerPrice ? (-stopPercent * adjustLeverage).toFixed(2) : "--"
                const loss_CHANGE = isValidStopTriggerPrice ? Math.abs(Number((((orderValue / adjustLeverage) * (stopPercent * adjustLeverage)) / 100).toFixed(2))) : "--"
                const stopExpectedType_CHANGE = isValidStopTriggerPrice && stopTriggerStop > 0 ? "profit " : "loss "

                if (orderType === ORDER_TYPE.PROFIT) {
                    return (profitTriggerPrice &&
                        <div className="futures-modal_tpls_trigger-controller_calculated-info">
                            Last Traded Price to {profitTriggerPrice_CHANGE} will trigger market Take Profit order; your expected {profitExpectedType_CHANGE}
                            will be {profit_CHANGE} USDT (ROI: {profit_ROI_CHANGE}%)
                        </div>)
                } else {
                    return (stopTriggerPrice && <div className="futures-modal_tpls_trigger-controller_calculated-info">
                        Last Traded Price to {stopTriggerPrice_CHANGE} will trigger market Stop Loss order; your expected {stopExpectedType_CHANGE} will
                        be {loss_CHANGE} USDT (ROI: {stopROI_CHANGE}%)
                    </div>)
                }
            case TRIGGERS.PL:
                const stopPercentByProfit_PL = Number((((stopTriggerStop * 100) / orderValue) * adjustLeverage).toFixed(2))
                const profitPercentByTrigger_PL = Number(((((profitTriggerPrice - currentPrice) * 100) / currentPrice) * adjustLeverage).toFixed(2))

                const profitTriggerPrice_PL = isValidProfitTriggerPrice ? profitTriggerPrice : "--"
                const profit_PL = isValidProfitTriggerPrice ? Math.abs(profitTriggerProfit) : "--"
                const profitExpectedType_PL = isValidProfitTriggerPrice && profitTriggerProfit > 0 ? "profit " : "loss "
                const profitROI_PL = isValidProfitTriggerPrice ? activeTradeType === TRADE_POSITION.LONG ? profitPercentByTrigger_PL : currentPrice < profitTriggerPrice ? -profitPercentByTrigger_PL : Math.abs(profitPercentByTrigger_PL) : "--"

                const stopTriggerPrice_PL = isValidStopTriggerPrice ? stopTriggerPrice : "--"
                const loss_PL = isValidStopTriggerPrice ? Math.abs(stopTriggerStop) : "--"
                const stopROI_PL = isValidStopTriggerPrice ? stopPercentByProfit_PL : "--"
                const stopExpectedType_PL = isValidStopTriggerPrice && stopTriggerStop > 0 ? "profit " : "loss "

                if (orderType === ORDER_TYPE.PROFIT) {
                    return (profitTriggerPrice &&
                        <div className="futures-modal_tpls_trigger-controller_calculated-info">
                            Last Traded Price to {profitTriggerPrice_PL} will trigger market Take Profit order; your expected {profitExpectedType_PL} will
                            be {profit_PL} USDT (ROI: {profitROI_PL}%)
                        </div>)
                } else {
                    return (stopTriggerPrice && <div className="futures-modal_tpls_trigger-controller_calculated-info">
                        Last Traded Price to {stopTriggerPrice_PL} will trigger market Take Profit order; your expected {stopExpectedType_PL} will
                        be {loss_PL} USDT
                        (ROI: {stopROI_PL}%)
                    </div>)
                }
        }
    }

    return (
        <ModalWindowTemplate
            show={true}
            title={`${isUpdate ? 'Update' : 'Add'} TP/SL`}
            cancelCallback={() => setCurrentModal(MODALS.CLOSE)} confirmCallback={confirmMode}
        >
            <div className="futures-modal_tpls_header">
                <HeaderItem label="Order Price" value="Last Traded Price"/>
                <HeaderItem
                    label="Qty"
                    value={(orderValue / (isInsideAction ? currentPrice : currentCryptoData.close)).toFixed(3)}
                />
                {isInsideAction && <HeaderItem label="Entry Price" value={currentPrice}/>}
                <HeaderItem label="Last Traded Price" value={currentCryptoData.close}/>
            </div>
            {<div className={`futures-modal_tpls_trade-type ${activeTradeType}`}>
                {!isInsideAction && <React.Fragment>
                    <Button onClick={() => setActiveTradeType(TRADE_POSITION.LONG)}>Long</Button>
                    <Button onClick={() => setActiveTradeType(TRADE_POSITION.SHORT)}>Short</Button>
                </React.Fragment>}
            </div>}
            <div className="futures-modal_tpls_which_order">
                <span>Applicable to</span>
                <span>Entire position</span>
            </div>
            <div className="futures-modal_tpls_trigger-controller">
                <TPSLTrigger
                    type="Take Profit"
                    currentTrigger={currentProfitTrigger}
                    setCurrentTrigger={(trigger) => triggerHandle(trigger, "current_profit_trigger", ORDER_TYPE.PROFIT)}
                />
                <div className="futures-modal_tpls_trigger-controller_inputs">
                    <Input
                        type="number"
                        rightText="USDT"
                        name="profit_trigger_price"
                        placeholder="Trigger price"
                        value={fieldsValue[activeTradeType]["profit_trigger_price"]}
                        onChange={(event) => inputHandle(event)}
                    />
                    <Input
                        value={fieldsValue[activeTradeType]["profit_trigger_profit"]}
                        type="number"
                        name="profit_trigger_profit"
                        rightText={profitInputOptions.rightText}
                        placeholder={profitInputOptions.placeholder}
                        onChange={(event) => inputHandle(event)}
                    />
                </div>
                {fieldsValue[activeTradeType].profit_validation.issue &&
                    <p className="futures-modal_tpls_trigger-controller_info">{fieldsValue[activeTradeType].profit_validation.message}</p>}
                {currentProfitTrigger !== TRIGGERS.PL && <InputRangeSlider
                    name="profit_percent"
                    max={profitInputOptions.sliderOneRange.max}
                    division={profitInputOptions.sliderOneRange.division}
                    value={fieldsValue[activeTradeType]["profit_percent"]}
                    onChange={(event) => inputHandle(event)}
                />}
                {calculateAndRenderTPSL(currentProfitTrigger, ORDER_TYPE.PROFIT)}
            </div>
            <div className="futures-modal_tpls_trigger-controller">
                <TPSLTrigger
                    type="Stop Loss"
                    currentTrigger={currentStopTrigger}
                    setCurrentTrigger={(trigger) => triggerHandle(trigger, "current_stop_trigger", ORDER_TYPE.STOP)}
                />
                <div className="futures-modal_tpls_trigger-controller_inputs">
                    <Input
                        type="number"
                        rightText="USDT"
                        name="stop_trigger_price"
                        placeholder="Trigger price"
                        value={fieldsValue[activeTradeType]["stop_trigger_price"]}
                        onChange={(event) => inputHandle(event)}
                    />
                    <Input
                        type="number"
                        name="stop_trigger_stop"
                        rightText={stopInputOptions.rightText}
                        placeholder={stopInputOptions.placeholder}
                        value={fieldsValue[activeTradeType]["stop_trigger_stop"]}
                        onChange={(event) => inputHandle(event)}
                    />
                </div>
                {fieldsValue[activeTradeType].stop_validation.issue && <p className="futures-modal_tpls_trigger-controller_info">
                    {fieldsValue[activeTradeType].stop_validation.message}</p>}
                {currentStopTrigger !== TRIGGERS.PL && <InputRangeSlider
                    name="stop_percent"
                    max={stopInputOptions.sliderTwoRange.max}
                    division={stopInputOptions.sliderTwoRange.division}
                    value={fieldsValue[activeTradeType]["stop_percent"]}
                    onChange={(event) => inputHandle(event)}
                />}
                {calculateAndRenderTPSL(currentStopTrigger, ORDER_TYPE.STOP)}
            </div>
        </ModalWindowTemplate>
    )
}

export default TPSL

const HeaderItem: React.FC<HeaderItemITF> = ({label, value}) => (
    <div className="futures-modal_tpls_header_item">
        <div className="futures-modal_tpls_header_item_label">{label}</div>
        <div className="futures-modal_tpls_header_item_value">{value}</div>
    </div>
)