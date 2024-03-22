import React, {useEffect, useState} from "react";

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
        stop_trigger_price: "",
        stop_trigger_stop: "",
        stop_percent: 0
    },
    Short: {
        current_profit_trigger: TRIGGERS.ROI,
        current_stop_trigger: TRIGGERS.ROI,
        profit_trigger_price: "",
        profit_trigger_profit: "",
        profit_percent: 0,
        stop_trigger_price: "",
        stop_trigger_stop: "",
        stop_percent: 0
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
    const [isSetCurrentPrice, setIsSetCurrentPrice] = useState(false)

    const [fieldsValue, setFieldsValue] = useState(settingsFieldsCopy)

    const currentPrice = currentCryptoData.close

    useEffect(() => {
        if (!isSetCurrentPrice) {
            setIsSetCurrentPrice(true)

            setFieldsValue((prev: SettingsFieldsITF) => {
                return {
                    ...prev,
                    Long: {
                        ...prev.Long,
                        profit_trigger_price: currentPrice,
                        stop_trigger_price: currentPrice,
                    },
                    Short: {
                        ...prev.Short,
                        profit_trigger_price: currentPrice,
                        stop_trigger_price: currentPrice
                    }
                }
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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

        const calculateTriggerPrice = (currentPrice: number, roi: number, leverage: number): number => {
            if (activeTradeType === TRADE_POSITION.LONG) {
                return ((roi / (leverage * 100)) * currentPrice) + currentPrice;
            } else {
                return currentPrice - ((roi / (leverage * 100)) * currentPrice);
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
                        break
                    case TRIGGERS.PL:
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
                        break
                    case TRIGGERS.PL:
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
                        break
                    case TRIGGERS.PL:
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
                        break
                    case TRIGGERS.PL:
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
                        break
                    case TRIGGERS.PL:
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
                        break
                    case TRIGGERS.PL:
                        break
                }
        }

        setFieldsValue(fieldsValueCopy)
    }

    const triggerHandle = (trigger: TRIGGERS, name: string) => {
        setFieldsValue((prev: SettingsFieldsITF) => {
            return {
                ...prev,
                [activeTradeType]: {
                    ...prev[activeTradeType],
                    [name]: trigger
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
    console.log(stopInputOptions)
    const orderValue = dataForModal.orderValue

    const takeProfitPrice = fieldsValue[activeTradeType]["profit_trigger_price"]
    const ROI_profit = Number(fieldsValue[activeTradeType]["profit_percent"])
    const profit = Number((((orderValue / adjustLeverage) * ROI_profit) / 100).toFixed(2))

    const takeStopPrice = fieldsValue[activeTradeType]["stop_trigger_price"]
    const ROI_stop = Number(fieldsValue[activeTradeType]["stop_percent"])
    const loss = Number((((orderValue / adjustLeverage) * ROI_stop) / 100).toFixed(2))

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
                    setCurrentTrigger={(trigger) => triggerHandle(trigger, "current_profit_trigger")}
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
                {currentProfitTrigger !== TRIGGERS.PL && <InputRangeSlider
                    name="profit_percent"
                    max={profitInputOptions.sliderOneRange.max}
                    division={profitInputOptions.sliderOneRange.division}
                    value={fieldsValue[activeTradeType]["profit_percent"]}
                    onChange={(event) => inputHandle(event)}
                />}
                {ROI_profit &&
                    <div className="futures-modal_tpls_trigger-controller_calculated-info">
                        Last Traded Price to {takeProfitPrice} will trigger market Take Profit order; your expected {ROI_profit > 0 ? "profit" : "loss"} will
                        be {Math.abs(profit)} USDT (ROI: {ROI_profit}%)
                    </div>}
            </div>
            <div className="futures-modal_tpls_trigger-controller">
                <TPSLTrigger
                    type="Stop Loss"
                    currentTrigger={currentStopTrigger}
                    setCurrentTrigger={(trigger) => triggerHandle(trigger, "current_stop_trigger")}
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
                {currentStopTrigger !== TRIGGERS.PL && <InputRangeSlider
                    name="stop_percent"
                    max={stopInputOptions.sliderTwoRange.max}
                    division={stopInputOptions.sliderTwoRange.division}
                    value={fieldsValue[activeTradeType]["stop_percent"]}
                    onChange={(event) => inputHandle(event)}
                />}
                {ROI_stop && <div className="futures-modal_tpls_trigger-controller_calculated-info">
                    Last Traded Price to {takeStopPrice} will trigger market Stop Loss order; your expected profit will be {Math.abs(loss)} USDT
                    (ROI: {-ROI_stop}%)
                </div>}
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