import React, {memo, useEffect, useState} from "react";

import {
    useSimulatorTradingContext,
    useFuturesTradingModalContext,
    useSimulatorPlayerInfoContext,
    useSimulatorTradingChartDetailsContext
} from "layouts/providers";
import {ERROR, HEDGING, MODALS, POSITION_MODE, showNotification, TRAD_TYPE, TRADE_POSITION} from "utils";
import {interruptionRef} from "utils";

import OrderValueInfo from "./Components/OrderValueInfo";
import TradeButtons from "./Components/TradeButtons";
import TriggerPrice from "./Components/TriggerPrice";
import {Input, InputRangeSlider} from "components";
import TPSL from "./Components/TPSL";

import {ConfirmPositionDataForModalWithTPSLITF, SettingsFieldsMarketITF, StartTradeInitialOptions} from "./type";

const settingsFields: SettingsFieldsMarketITF = {
    order_value_usdt: "",
    order_value_percent: 0
}

const Market: React.FC = () => {
    const fieldsCopy = interruptionRef(settingsFields)
    const [fieldsValue, setFieldsValue] = useState<SettingsFieldsMarketITF>(fieldsCopy)

    const {adjustLeverage, positionMode} = useSimulatorTradingContext()
    const {setCurrentModal, setDataForModal} = useFuturesTradingModalContext<ConfirmPositionDataForModalWithTPSLITF>()
    const {longPositionData, shortPositionData, setShortPositionData, setLongPositionData} = useSimulatorTradingChartDetailsContext()
    const {balanceUSDT} = useSimulatorPlayerInfoContext()

    const isTPSL = !!longPositionData || !!shortPositionData

    useEffect(() => {
        if (fieldsValue.order_value_usdt) {
            setFieldsValue(interruptionRef(settingsFields))
            setLongPositionData(null)
            setShortPositionData(null)
        }

        return () => {
            setShortPositionData(null)
            setLongPositionData(null)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [adjustLeverage]);

    const inputHandle = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {value, name} = event.target
        const fields = interruptionRef(fieldsValue)

        fields[name] = value

        const valueToNumber = Number(value)

        switch (name) {
            case "order_value_usdt":
                const calculatedOrderValuePercent = (valueToNumber * 100) / (adjustLeverage * balanceUSDT)

                fields.order_value_percent = calculatedOrderValuePercent
                break
            case "order_value_percent":
                const calculatedOrderValueUSDT = valueToNumber * (balanceUSDT * adjustLeverage) / 100

                fields.order_value_usdt = calculatedOrderValueUSDT
                break
        }

        setFieldsValue(fields)
    }

    const startConfirmProcess = (process: StartTradeInitialOptions) => {
        const currentOrderValue = fieldsValue.order_value_usdt

        if (Number(currentOrderValue) < (balanceUSDT * adjustLeverage)) {
            if (positionMode === POSITION_MODE.HEDGE) {
                if (process.hedgingType === HEDGING.OPEN) {
                    //@TODO this mode is not available yet
                }
            } else {
                if ((longPositionData && process.position === TRADE_POSITION.SHORT) || (shortPositionData && process.position === TRADE_POSITION.LONG)) {
                    setCurrentModal(MODALS.RISK_ALERT)
                } else {
                    const isTPLS = !!longPositionData || !!shortPositionData
                    const isCurrentPositionLong = process.position === TRADE_POSITION.LONG
                    const currentPositionData = isTPLS ? isCurrentPositionLong ? longPositionData : shortPositionData : {}

                    const confirmData = interruptionRef({
                        ...fieldsValue, ...currentPositionData,
                        trade_type: "Market",
                        trade_position_process: isCurrentPositionLong ? "Buy" : "Sell",
                        trade_position: process.position,
                        time_in_force: "Immediate-Or-Cancel",
                        is_tp_ls: isTPLS
                    })

                    setDataForModal(confirmData)
                    setCurrentModal(MODALS.CONFIRM_POSITION)
                }
            }
        } else {
            showNotification(ERROR.INSUFFICIENT, "error")
        }
    }

    return (
        <div className="futures_market">
            <Input
                type="number"
                rightText="USDT"
                name="order_value_usdt"
                labelText="Order by Value"
                value={fieldsValue.order_value_usdt}
                onChange={(event) => inputHandle(event)}
                labelClickCallback={() => setCurrentModal(MODALS.ORDER_PLACEMENT_PREFERENCES)}
            />
            <InputRangeSlider
                max={100}
                division={4}
                name="order_value_percent"
                value={fieldsValue.order_value_percent}
                onChange={(event) => inputHandle(event)}
            />
            <OrderValueInfo orderValue={Number(fieldsValue.order_value_usdt)}/>
            <TPSL
                confirmed={isTPSL}
                tradType={TRAD_TYPE.MARKET}
                orderValue={fieldsValue.order_value_usdt}
                position={!!longPositionData ? TRADE_POSITION.LONG : TRADE_POSITION.SHORT}
            />
            {isTPSL && <TriggerPrice/>}
            <TradeButtons onClick={startConfirmProcess}/>
        </div>
    )
}

export default memo(Market)