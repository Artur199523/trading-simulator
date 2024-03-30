import React, {useState} from "react";

import {useFuturesTradingModalContext, useSimulatorTradingChartDetailsContext, useSimulatorTradingContext} from "layouts/providers";
import {ORDER_TYPE, TRADE_POSITION, TRIGGERS} from "utils";

import {Button, Input, InputRangeSlider, ModalWindowTemplate} from "components";
import TPSLTrigger from "../Components/TPSLTrigger";

import {HeaderItemITF, InputOptionsITF, SettingsFieldsITF} from "../type";

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
        stop_validation: {issue: false, message: "The Stop Loss price must be lower than the order price"}
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
        stop_validation: {issue: false, message: "The Stop Loss price must be higher than the order price"}
    }
}

const TPSL: React.FC = () => {
    const settingsFieldsCopy = JSON.parse(JSON.stringify(settingsFields))

    const {setCurrentModal} = useFuturesTradingModalContext()
    const {currentCryptoData} = useSimulatorTradingChartDetailsContext()
    const {adjustLeverage} = useSimulatorTradingContext()
    const {dataForModal} = useFuturesTradingModalContext()

    const [activeTradeType, setActiveTradeType] = useState<TRADE_POSITION>(TRADE_POSITION.LONG)

    const [isShowProfitInputsInfo, setIsShowProfitInputsInfo] = useState(false)
    const [isShowStopInputsInfo, setIsShowStopInputsInfo] = useState(false)

    const [fieldsValue, setFieldsValue] = useState(settingsFieldsCopy)

    const currentPrice = currentCryptoData.close

    const inputOptions = (trigger: TRIGGERS): InputOptionsITF => {
        switch (trigger) {
            case TRIGGERS.ROI:
                return {placeholder: "ROI", rightText: "%", sliderOneRange: {max: 150, division: 3}, sliderTwoRange: {max: 75, division: 3}}
            case TRIGGERS.CHANGE:
                return {placeholder: "Increase", rightText: "%", sliderOneRange: {max: 25, division: 5}, sliderTwoRange: {max: 10, division: 2}}
            case TRIGGERS.PL:
                return {placeholder: "Profit", rightText: "USDT"}
        }
    }

    const inputHandle = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target
        const fieldsValueCopy = {...fieldsValue}
        const path = fieldsValueCopy[activeTradeType]

        const calculateROI = (currentPrice: number, triggerPrice: number, leverage: number): number => {
            return ((triggerPrice - currentPrice) / currentPrice) * leverage * 100;
        }

        const calculateChange = (currentPrice: number, triggerPrice: number): string => {
            if (triggerPrice < currentPrice) {
                return (triggerPrice * 100 / currentPrice).toFixed(2)
            } else {
                return (((triggerPrice - currentPrice) * 100) / currentPrice).toFixed(2)
            }
        }

        const calculateTriggerPrice = (currentPrice: number, roi: number, leverage: number): number => {
            if (activeTradeType === TRADE_POSITION.LONG) {
                return ((roi / (leverage * 100)) * currentPrice) + currentPrice;
            } else {
                return currentPrice - ((roi / (leverage * 100)) * currentPrice);
            }
        }

        const calculateTriggerPriceByPercent = (currentPrice: number, percent: number): string => {
            return (currentPrice * percent / 100).toFixed(2)
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

        const inputPriceChecking = (value: number, type: ORDER_TYPE) => {
            if (activeTradeType === TRADE_POSITION.LONG) {
                if (type === ORDER_TYPE.PROFIT) {
                    setIsShowProfitInputsInfo(!(Number(value) > currentPrice))
                } else {
                    setIsShowStopInputsInfo(!(Number(value) < currentPrice))
                }
            } else {
                if (type === ORDER_TYPE.PROFIT) {
                    setIsShowProfitInputsInfo(!(Number(value) < currentPrice))
                } else {
                    setIsShowStopInputsInfo(!(Number(value) > currentPrice))
                }
            }
        }

        const inputValidation = (value: number | string, type: ORDER_TYPE) => {
            const currentValue = Number(value)

            if (!currentValue) {
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

        switch (name) {
            case "profit_trigger_price":
                switch (path.current_profit_trigger) {
                    case TRIGGERS.ROI:
                        const calculatedROI = value ? calculateROI(currentPrice, Number(value), adjustLeverage).toFixed(1) : ""

                        if (activeTradeType === TRADE_POSITION.LONG) {
                            path.profit_trigger_profit = value ? calculatedROI : 0
                            path.profit_percent = Number(value) > currentPrice ? Number(calculatedROI) : 0
                        } else {
                            path.profit_trigger_profit = Number(value) > currentPrice ? -Number(calculatedROI) : Math.abs(Number(calculatedROI))
                            path.profit_percent = Number(value) < currentPrice ? Math.abs(Number(calculatedROI)) : 0
                        }

                        inputPriceChecking(Number(value), ORDER_TYPE.PROFIT)
                        break
                    case TRIGGERS.CHANGE:
                        const calculatedChange = value ? calculateChange(currentPrice, Number(value)) : 0

                        if (activeTradeType === TRADE_POSITION.LONG) {
                            path.profit_trigger_profit = Number(value) < currentPrice ? -(100 - Number(calculatedChange)).toFixed(1) : Number(calculatedChange)
                            path.profit_percent = Number(value) > currentPrice ? Number(calculatedChange) : 0
                        } else {
                            console.log(Number(value) < Number(currentPrice))
                            path.profit_trigger_profit = value && Number(value) < currentPrice ? -(100 - Number(calculatedChange)).toFixed(1) : Number(calculatedChange)
                            path.profit_percent = Number(value) < currentPrice ? -Number(calculatedChange) : 0
                        }

                        inputPriceChecking(Number(value), ORDER_TYPE.PROFIT)
                        break
                    case TRIGGERS.PL:
                        const calculatedProfitPriceByTrigger = value ? calculateProfitPriceByTrigger(Number(value)) : ""

                        if (activeTradeType === TRADE_POSITION.LONG) {
                            path.profit_trigger_profit = Number(value) < 0 ? " " : calculatedProfitPriceByTrigger
                        } else {
                            path.profit_trigger_profit = value ? Number(value) < currentPrice ? Math.abs(calculatedProfitPriceByTrigger as number) : -calculatedProfitPriceByTrigger : ""
                        }

                        inputValidation(value, ORDER_TYPE.PROFIT)
                        break
                }
                break
            case "profit_trigger_profit":
                switch (path.current_profit_trigger) {
                    case TRIGGERS.ROI:
                        const calculatedTriggerPrice = value ? calculateTriggerPrice(currentPrice, Number(value), adjustLeverage).toFixed(1) : 0

                        path.profit_trigger_price = calculatedTriggerPrice
                        path.profit_percent = value ? value : 0

                        inputPriceChecking(Number(calculatedTriggerPrice), ORDER_TYPE.PROFIT)
                        break
                    case TRIGGERS.CHANGE:
                        const calculatedTriggerPriceByPercent = value ? calculateTriggerPriceByPercent(currentPrice, Number(value)) : 0
                        const calculatedTotalPrice = Number(calculatedTriggerPriceByPercent) + Number(currentPrice)

                        if (activeTradeType === TRADE_POSITION.LONG) {
                            path.profit_trigger_price = calculatedTotalPrice.toFixed(1)
                            path.profit_percent = calculatedTotalPrice > currentPrice ? Number(value) : 0
                        } else {
                            path.profit_trigger_price = calculatedTotalPrice.toFixed(1)
                            path.profit_percent = Number(value) < 0 ? Math.abs(Number(value)) : 0
                        }

                        inputPriceChecking(calculatedTotalPrice, ORDER_TYPE.PROFIT)
                        break
                    case TRIGGERS.PL:
                        const calculatedTriggerPriceByProfit = value ? calculateTriggerPriceByProfit(Number(value)) : ""

                        if (activeTradeType === TRADE_POSITION.LONG) {
                            path.profit_trigger_price = Number(value) > 0 ? calculatedTriggerPriceByProfit : calculatedTriggerPriceByProfit > 0 ? calculatedTriggerPriceByProfit : ""
                        } else {
                            path.profit_trigger_price = Number(value) > 0 && calculatedTriggerPriceByProfit > 0 ? calculatedTriggerPriceByProfit : Number(value) < 0 ? calculatedTriggerPriceByProfit : ""
                        }

                        inputValidation(calculatedTriggerPriceByProfit as number, ORDER_TYPE.PROFIT)
                        break
                }
                break
            case "profit_percent":
                switch (path.current_profit_trigger) {
                    case TRIGGERS.ROI:
                        const calculatedTriggerPrice = value ? calculateTriggerPrice(currentPrice, Number(value), adjustLeverage).toFixed(1) : 0

                        path.profit_trigger_price = calculatedTriggerPrice
                        path.profit_trigger_profit = value ? value : 0

                        inputPriceChecking(Number(calculatedTriggerPrice), ORDER_TYPE.PROFIT)
                        break
                    case TRIGGERS.CHANGE:
                        const calculatedTriggerPriceByPercent = value ? calculateTriggerPriceByPercent(currentPrice, Number(value)) : 0

                        if (activeTradeType === TRADE_POSITION.LONG) {
                            path.profit_trigger_price = (Number(calculatedTriggerPriceByPercent) + Number(currentPrice)).toFixed(1)
                            path.profit_trigger_profit = Number(value)

                            inputPriceChecking(Number(calculatedTriggerPriceByPercent) + Number(currentPrice), ORDER_TYPE.PROFIT)
                        } else {
                            path.profit_trigger_price = (Number(currentPrice) - Number(calculatedTriggerPriceByPercent)).toFixed(1)
                            path.profit_trigger_profit = -Number(value)

                            inputPriceChecking(Number(currentPrice) - Number(calculatedTriggerPriceByPercent), ORDER_TYPE.PROFIT)
                        }
                        break
                }
                break
            case "stop_trigger_price":
                switch (path.current_stop_trigger) {
                    case TRIGGERS.ROI:
                        const calculatedROI = value ? calculateROI(currentPrice, Number(value), adjustLeverage).toFixed(1) : ""

                        if (activeTradeType === TRADE_POSITION.LONG) {
                            path.stop_trigger_stop = calculatedROI
                            path.stop_percent = Number(value) > currentPrice ? 0 : Math.abs(Number(calculatedROI))
                        } else {
                            path.stop_trigger_stop = -Number(calculatedROI)
                            path.stop_percent = Number(value) < currentPrice ? 0 : Math.abs(Number(calculatedROI))
                        }

                        inputPriceChecking(Number(value), ORDER_TYPE.STOP)
                        break
                    case TRIGGERS.CHANGE:
                        const calculatedTriggerPriceByPercent = value ? calculateChange(currentPrice, Number(value)) : 0

                        if (activeTradeType === TRADE_POSITION.LONG) {
                            path.stop_trigger_stop = value && (Number(value) < currentPrice) ? -(100 - Number(calculatedTriggerPriceByPercent)).toFixed(1) : 0
                            path.stop_percent = Number(value) < currentPrice ? 100 - Number(calculatedTriggerPriceByPercent) : 0
                        } else {
                            path.stop_trigger_stop = value && (Number(value) > currentPrice) ? Number(calculatedTriggerPriceByPercent).toFixed(1) : 0
                            path.stop_percent = Number(value) > currentPrice ? calculatedTriggerPriceByPercent : 0
                        }

                        inputPriceChecking(Number(value), ORDER_TYPE.STOP)
                        break
                    case TRIGGERS.PL:
                        const calculatedProfitPriceByTrigger = value ? calculateProfitPriceByTrigger(Number(value)) : ""

                        if (activeTradeType === TRADE_POSITION.LONG) {
                            path.stop_trigger_stop = Number(value) > 0 ? calculatedProfitPriceByTrigger : ""
                        } else {
                            path.stop_trigger_stop = Number(value) < currentPrice ? Number(value) > 0 ? Math.abs(calculatedProfitPriceByTrigger as number) : "" : -calculatedProfitPriceByTrigger
                        }

                        inputValidation(value, ORDER_TYPE.STOP)
                        break
                }
                break
            case "stop_trigger_stop":
                switch (path.current_stop_trigger) {
                    case TRIGGERS.ROI:
                        const calculatedTriggerPrice = value ? calculateTriggerPrice(currentPrice, Number(value), adjustLeverage).toFixed(1) : 0

                        path.stop_trigger_price = calculatedTriggerPrice
                        path.stop_percent = Number(value) < 0 ? Math.abs(Number(value)) : 0

                        inputPriceChecking(Number(calculatedTriggerPrice), ORDER_TYPE.STOP)
                        break
                    case TRIGGERS.CHANGE:
                        const calculatedTriggerPriceByPercent = value ? calculateTriggerPriceByPercent(currentPrice, Number(value)) : 0
                        const calculatedTotalPrice = Number(currentPrice) + Number(calculatedTriggerPriceByPercent)

                        if (activeTradeType === TRADE_POSITION.LONG) {
                            path.stop_trigger_price = calculatedTotalPrice
                            path.stop_percent = Number(value) < 0 ? Math.abs(Number(value)) : 0
                        } else {
                            path.stop_trigger_price = calculatedTotalPrice
                            path.stop_percent = Number(value) < 0 ? 0 : Number(value)
                        }

                        inputPriceChecking(calculatedTotalPrice, ORDER_TYPE.STOP)
                        break
                    case TRIGGERS.PL:
                        const calculatedProfitPriceByTrigger = value ? calculateTriggerPriceByProfit(Number(value)) : ""

                        if (activeTradeType === TRADE_POSITION.LONG) {
                            path.stop_trigger_price = calculatedProfitPriceByTrigger
                        } else {
                            path.stop_trigger_price = value ? Math.abs(calculatedProfitPriceByTrigger as number) : calculatedProfitPriceByTrigger ? -calculatedProfitPriceByTrigger : ""
                        }

                        inputValidation(calculatedProfitPriceByTrigger as number, ORDER_TYPE.STOP)
                        break
                }
                break
            case "stop_percent":
                switch (path.current_stop_trigger) {
                    case TRIGGERS.ROI:
                        const calculatedTriggerPrice = value ? calculateTriggerPrice(currentPrice, -Number(value), adjustLeverage).toFixed(1) : 0

                        path.stop_trigger_price = calculatedTriggerPrice
                        path.stop_trigger_stop = value ? -value : 0

                        if (activeTradeType === TRADE_POSITION.LONG) {
                            inputPriceChecking(-Number(calculatedTriggerPrice), ORDER_TYPE.STOP)
                        } else {
                            inputPriceChecking(Number(calculatedTriggerPrice), ORDER_TYPE.STOP)
                        }

                        break
                    case TRIGGERS.CHANGE:
                        const calculatedTriggerPriceByPercent = value ? calculateTriggerPriceByPercent(currentPrice, Number(value)) : 0

                        if (activeTradeType === TRADE_POSITION.LONG) {
                            path.stop_trigger_price = (Number(currentPrice) - Number(calculatedTriggerPriceByPercent)).toFixed(1)
                            path.stop_trigger_stop = -Number(value)
                            inputPriceChecking(Number(currentPrice) - Number(calculatedTriggerPriceByPercent), ORDER_TYPE.STOP)
                        } else {
                            path.stop_trigger_price = (Number(currentPrice) + Number(calculatedTriggerPriceByPercent)).toFixed(1)
                            path.stop_trigger_stop = Number(value)
                            inputPriceChecking(Number(currentPrice) + Number(calculatedTriggerPriceByPercent), ORDER_TYPE.STOP)
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
        setCurrentModal("")
    }

    const currentProfitTrigger: TRIGGERS = fieldsValue[activeTradeType].current_profit_trigger
    const currentStopTrigger: TRIGGERS = fieldsValue[activeTradeType].current_stop_trigger

    const profitInputOptions: InputOptionsITF = inputOptions(currentProfitTrigger)
    const stopInputOptions: InputOptionsITF = inputOptions(currentStopTrigger)
    const orderValue = dataForModal.orderValue

    // @TODO need to refactoring
    const calculateAndRenderTPSL = (trigger: TRIGGERS, orderType: ORDER_TYPE) => {
        const takeProfitPrice = fieldsValue[activeTradeType]["profit_trigger_price"]
        const takeStopPrice = fieldsValue[activeTradeType]["stop_trigger_price"]
        const profit_percent = Number(fieldsValue[activeTradeType]["profit_percent"])
        const stop_percent = Number(fieldsValue[activeTradeType]["stop_percent"])

        const isValidStopTriggerPrice = takeStopPrice > 0
        const isValidProfitTriggerPrice = takeProfitPrice > 0

        switch (trigger) {
            case TRIGGERS.ROI:
                const profit_ROI = Number((((orderValue / adjustLeverage) * profit_percent) / 100).toFixed(2))
                const loss_ROI = Number((((orderValue / adjustLeverage) * stop_percent) / 100).toFixed(2))

                if (orderType === ORDER_TYPE.PROFIT) {
                    return (profit_percent &&
                        <div className="futures-modal_tpls_trigger-controller_calculated-info">
                            Last Traded Price to {takeProfitPrice} will trigger market Take Profit order; your
                            expected {profit_percent > 0 ? "profit" : "loss"} will
                            be {Math.abs(profit_ROI)} USDT (ROI: {profit_percent}%)
                        </div>)
                } else {
                    return (stop_percent && <div className="futures-modal_tpls_trigger-controller_calculated-info">
                        Last Traded Price to {takeStopPrice} will trigger market Stop Loss order; your expected profit will be {Math.abs(loss_ROI)} USDT
                        (ROI: {-stop_percent}%)
                    </div>)
                }
            case TRIGGERS.CHANGE:
                const profit_Change = Number((((orderValue / adjustLeverage) * (profit_percent * adjustLeverage)) / 100).toFixed(2))
                const loss_Change = Number((((orderValue / adjustLeverage) * (stop_percent * adjustLeverage)) / 100).toFixed(2))

                if (orderType === ORDER_TYPE.PROFIT) {
                    return (profit_percent &&
                        <div className="futures-modal_tpls_trigger-controller_calculated-info">
                            Last Traded Price to {takeProfitPrice} will trigger market Take Profit order; your
                            expected {profit_percent > 0 ? "profit" : "loss"} will
                            be {Math.abs(profit_Change)} USDT (ROI: {profit_percent * adjustLeverage}%)
                        </div>)
                } else {
                    return (stop_percent && <div className="futures-modal_tpls_trigger-controller_calculated-info">
                        Last Traded Price to {takeStopPrice} will trigger market Stop Loss order; your expected profit will be {Math.abs(loss_Change)} USDT
                        (ROI: {-stop_percent * adjustLeverage}%)
                    </div>)
                }
            case TRIGGERS.PL:
                const stopPrice = fieldsValue[activeTradeType]["stop_trigger_stop"]
                const profitPrice = fieldsValue[activeTradeType]["profit_trigger_profit"]

                const stopPercentByProfit = Number((((stopPrice * 100) / orderValue) * adjustLeverage).toFixed(2))
                const profitPercentByTrigger = Number(((((takeProfitPrice - currentPrice) * 100) / currentPrice) * adjustLeverage).toFixed(2))

                const profitTriggerPrice = isValidProfitTriggerPrice ? takeProfitPrice : "--"
                const profitExpectedType = isValidProfitTriggerPrice && profitPrice > 0 ? "profit" : "loss"
                const profit = isValidProfitTriggerPrice ? Math.abs(profitPrice) : "--"
                const profitROI = isValidProfitTriggerPrice ? activeTradeType === TRADE_POSITION.LONG ? profitPercentByTrigger : currentPrice < takeProfitPrice ? -profitPercentByTrigger : Math.abs(profitPercentByTrigger) : "--"

                const stopTriggerPrice = isValidStopTriggerPrice ? takeStopPrice : "--"
                const stopExpectedType = isValidStopTriggerPrice && stopPrice > 0 ? "profit" : "loss"
                const loss = isValidStopTriggerPrice ? Math.abs(stopPrice) : "--"
                const stopROI = isValidStopTriggerPrice ? stopPercentByProfit : "--"

                if (orderType === ORDER_TYPE.PROFIT) {
                    return (takeProfitPrice &&
                        <div className="futures-modal_tpls_trigger-controller_calculated-info">
                            Last Traded Price to {profitTriggerPrice} will trigger market Take Profit order; your expected {profitExpectedType} will
                            be {profit} USDT (ROI: {profitROI}%)
                        </div>)
                } else {
                    return (takeStopPrice && <div className="futures-modal_tpls_trigger-controller_calculated-info">
                        Last Traded Price to {stopTriggerPrice} will trigger market Take Profit order; your expected {stopExpectedType} will be {loss} USDT
                        (ROI: {stopROI}%)
                    </div>)
                }
        }
    }

    return (
        <ModalWindowTemplate show={true} title="Add TP/SL" cancelCallback={() => setCurrentModal("")} confirmCallback={confirmMode}>
            <div className="futures-modal_tpls_header">
                <HeaderItem label="Order Price" value="Last Traded Price"/>
                <HeaderItem label="Qty" value={(dataForModal.orderValue / currentCryptoData.close).toFixed(3)}/>
                <HeaderItem label="Last Traded Price" value={currentCryptoData.close}/>
            </div>
            <div className={`futures-modal_tpls_trade-type ${activeTradeType}`}>
                <Button onClick={() => setActiveTradeType(TRADE_POSITION.LONG)}>Long</Button>
                <Button onClick={() => setActiveTradeType(TRADE_POSITION.SHORT)}>Short</Button>
            </div>
            <div className="futures-modal_tpls_which_order">
                <span>Applicable to</span>
                <span>Current Order</span>
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
                {isShowProfitInputsInfo && <p className="futures-modal_tpls_trigger-controller_info">
                    {activeTradeType === TRADE_POSITION.LONG
                        ? "The Take Profit price must be higher than the order price"
                        : "The Take Profit price must be lower than the order price"}
                </p>}
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
                {isShowStopInputsInfo && <p className="futures-modal_tpls_trigger-controller_info">
                    {activeTradeType === TRADE_POSITION.LONG
                        ? "The Stop Loss price must be lower than the order price"
                        : "The Stop Loss price must be higher than the order price"}
                </p>}
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