import React, {useState} from "react";

import {useFuturesTradingModalContext, useSimulatorTradingChartDetailsContext} from "layouts/providers";
import {TRADE_POSITION, TRIGGERS} from "utils";

import {Button, Input, InputRangeSlider, ModalWindowTemplate} from "components";
import TPSLTrigger from "../Components/TPSLTrigger";

import {HeaderItemITF, SettingsFieldsITF} from "../type";

import "./style.scss"

const settingsFields: SettingsFieldsITF = {
    Long: {
        "profit_trigger_price": "",
        "profit_trigger_profit": "",
        "profit_percent": 0,
        "stop_trigger_price": "",
        "stop_trigger_stop": "",
        "stop_percent": 0
    },
    Short: {
        "profit_trigger_price": "",
        "profit_trigger_profit": "",
        "profit_percent": 0,
        "stop_trigger_price": "",
        "stop_trigger_stop": "",
        "stop_percent": 0
    }
}

const TPSL: React.FC = () => {
    const settingsFieldsCopy = JSON.parse(JSON.stringify(settingsFields))

    const {setCurrentModal} = useFuturesTradingModalContext()
    const {currentCryptoData} = useSimulatorTradingChartDetailsContext()
    const {dataForModal} = useFuturesTradingModalContext()

    const [activeTradeType, setActiveTradeType] = useState<TRADE_POSITION>(TRADE_POSITION.LONG)

    //@TODO need to add in settingsFields data the currentProfitTrigger and currentStopTrigger and save for long and short positions separate
    const [currentProfitTrigger, setCurrentProfitTrigger] = useState<TRIGGERS>(TRIGGERS.ROI)
    const [currentStopTrigger, setCurrentStopTrigger] = useState<TRIGGERS>(TRIGGERS.ROI)

    const [isShowProfitCalculatedInfo, setIsShowProfitCalculatedInfo] = useState(false)
    const [isShowStopCalculatedInfo, setIsShowStopCalculatedInfo] = useState(false)
    const [isShowProfitInputsInfo, setIsShowProfitInputsInfo] = useState(false)
    const [isShowStopInputsInfo, setIsShowStopInputsInfo] = useState(false)

    const [fieldsValue, setFieldsValue] = useState(settingsFieldsCopy)
    const inputOptions = (trigger: TRIGGERS) => {
        switch (trigger) {
            case TRIGGERS.ROI:
                return {placeholder: "ROI", rightText: "%", sliderRangeType: "150"}
            case TRIGGERS.CHANGE:
                return {placeholder: "Increase", rightText: "%", sliderRangeType: "25"}
            case TRIGGERS.PL:
                return {placeholder: "Profit", rightText: "USDT"}
        }
    }

    const confirmMode = () => {
        setCurrentModal("")
    }

    const inputHandle = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {name, value} = event.target

        setFieldsValue((prev: SettingsFieldsITF) => {
            return {
                ...prev,
                [activeTradeType]: {
                    ...prev[activeTradeType],
                    [name]: value
                }
            }
        })
    }

    const profitInputOptions = inputOptions(currentProfitTrigger)
    const stopInputOptions = inputOptions(currentStopTrigger)

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
                    setCurrentTrigger={setCurrentProfitTrigger}
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
                    setCurrentTrigger={setCurrentStopTrigger}
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