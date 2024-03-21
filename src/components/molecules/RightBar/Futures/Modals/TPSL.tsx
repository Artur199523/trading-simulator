import React, {useEffect, useState} from "react";

import {useFuturesTradingModalContext, useSimulatorTradingChartDetailsContext, useSimulatorTradingContext} from "layouts/providers";
import {ORDER_TYPE, TRADE_POSITION, TRIGGERS} from "utils";

import {Button, Input, InputRangeSlider, ModalWindowTemplate} from "components";
import TPSLTrigger from "../Components/TPSLTrigger";

import {HeaderItemITF, InputOptionsITF, SettingsFieldsITF} from "../type";

import "./style.scss"

const settingsFields: SettingsFieldsITF = {
    Long: {
        current_profit_trigger: TRIGGERS.CHANGE,
        current_stop_trigger: TRIGGERS.CHANGE,
        profit_trigger_price: "",
        profit_trigger_profit: "",
        profit_percent: 0,
        stop_trigger_price: "",
        stop_trigger_stop: "",
        stop_percent: 0
    },
    Short: {
        current_profit_trigger: TRIGGERS.CHANGE,
        current_stop_trigger: TRIGGERS.CHANGE,
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

    const [isShowProfitCalculatedInfo, setIsShowProfitCalculatedInfo] = useState(false)
    const [isShowStopCalculatedInfo, setIsShowStopCalculatedInfo] = useState(false)
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
    }, []);

    const inputOptions = (trigger: TRIGGERS): InputOptionsITF => {
        switch (trigger) {
            case TRIGGERS.ROI:
                return {placeholder: "ROI", rightText: "%", sliderRangeType: "150"}
            case TRIGGERS.CHANGE:
                return {placeholder: "Increase", rightText: "%", sliderRangeType: "25"}
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
            return ((roi / (leverage * 100)) * currentPrice) + currentPrice;
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

                        path.profit_trigger_profit = calculatedROI
                        path.profit_percent = value ? calculatedROI : 0

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

                        path.stop_trigger_stop = calculatedROI
                        path.stop_percent = value ? calculatedROI : 0

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
                        path.stop_percent = Math.abs(Number(value))

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

                        inputPriceChecking(-Number(calculatedTriggerPrice), ORDER_TYPE.STOP)
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
                    max={Number(profitInputOptions.sliderRangeType)}
                    sliderMarksType={profitInputOptions.sliderRangeType}
                    value={fieldsValue[activeTradeType]["profit_percent"]}
                    onChange={(event) => inputHandle(event)}
                />}
                {isShowProfitCalculatedInfo && <div className="futures-modal_tpls_trigger-controller_calculated-info">
                    Last Traded Price to 64,345.00 will trigger market Take Profit order; your expected profit will be 6.0005 USDT (ROI: 12.00%)
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
                    max={Number(stopInputOptions.sliderRangeType)}
                    sliderMarksType={stopInputOptions.sliderRangeType}
                    value={fieldsValue[activeTradeType]["stop_percent"]}
                    onChange={(event) => inputHandle(event)}
                />}
                {isShowStopCalculatedInfo && <div className="futures-modal_tpls_trigger-controller_calculated-info">
                    Last Traded Price to 64,345.00 will trigger market Take Profit order; your expected profit will be 6.0005 USDT (ROI: 12.00%)
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