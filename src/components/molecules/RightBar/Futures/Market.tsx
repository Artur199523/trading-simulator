import React, {memo, useEffect, useState} from "react";

import {
    useSimulatorTradingContext,
    useFuturesTradingModalContext,
    useSimulatorPlayerInfoContext,
    useSimulatorTradingChartDetailsContext
} from "layouts/providers";
import {
    INFO,
    ERROR,
    MODALS,
    HEDGING,
    TRAD_TYPE,
    POSITION_MODE,
    TRADE_POSITION,
    fixedNumber,
    interruptionRef,
    showNotification,
    calculationOrderCostLongPosition,
    calculationOrderCostShortPosition
} from "utils";

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

    const {adjustLeverage, positionMode, riskLimit,} = useSimulatorTradingContext()
    const {setCurrentModal, setDataForModal} = useFuturesTradingModalContext<ConfirmPositionDataForModalWithTPSLITF>()
    const {
        longPositionDataTPSL,
        shortPositionDataTPSL,
        setLongPositionDataTPSL,
        setShortPositionDataTPSL,
    } = useSimulatorTradingChartDetailsContext()
    const {confirmedLongPositionData, confirmedShortPositionData} = useSimulatorTradingChartDetailsContext()
    const {balanceUSDT} = useSimulatorPlayerInfoContext()

    const isTPSL = !!longPositionDataTPSL || !!shortPositionDataTPSL

    useEffect(() => {
        if (fieldsValue.order_value_usdt) {
            setFieldsValue(interruptionRef(settingsFields))
            setLongPositionDataTPSL(null)
            setShortPositionDataTPSL(null)
        }

        return () => {
            setShortPositionDataTPSL(null)
            setLongPositionDataTPSL(null)
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [adjustLeverage]);

    useEffect(() => {
        setFieldsValue(settingsFields)
    }, [confirmedShortPositionData, confirmedLongPositionData]);

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

                fields.order_value_usdt = fixedNumber(calculatedOrderValueUSDT, 4)
                break
        }

        setFieldsValue(fields)
    }

    const startConfirmProcess = (process: StartTradeInitialOptions) => {
        const currentOrderValue = fieldsValue.order_value_usdt
        const orderCostLong = calculationOrderCostLongPosition(currentOrderValue, adjustLeverage, 0.055)
        const orderCostShort = calculationOrderCostShortPosition(currentOrderValue, adjustLeverage, 0.055)

        if (confirmedShortPositionData || confirmedLongPositionData) {
            showNotification(INFO.INCREASE_POSITION, "info", 0)
            return;
        }

        if (process.position === TRADE_POSITION.LONG && orderCostLong > balanceUSDT) {
            showNotification(ERROR.INSUFFICIENT, "error", 0)
            return;
        }

        if (process.position === TRADE_POSITION.SHORT && orderCostShort > balanceUSDT) {
            showNotification(ERROR.INSUFFICIENT, "error", 0)
            return;
        }

        if (!currentOrderValue) {
            showNotification(ERROR.LESS_VALUE, "error", 0)
            return
        }

        // if (Number(currentOrderValue) > riskLimit) {
        //     showNotification(ERROR.EXCEEDED_RISK_ZONE, "error", 0)
        //     return;
        // }

        if (positionMode === POSITION_MODE.HEDGE) {
            if (process.hedgingType === HEDGING.OPEN) {
                //@TODO this mode is not available yet
            }
        } else {
            const isTPLS = !!longPositionDataTPSL || !!shortPositionDataTPSL
            const isCurrentPositionLong = process.position === TRADE_POSITION.LONG
            const currentPositionData = isTPLS ? isCurrentPositionLong ? longPositionDataTPSL : shortPositionDataTPSL : {}

            const confirmData = interruptionRef({
                ...fieldsValue, ...currentPositionData,
                trade_type: "Market",
                trade_position_process: isCurrentPositionLong ? "Buy" : "Sell",
                trade_position: process.position,
                time_in_force: "Immediate-Or-Cancel",
                is_tp_ls: isTPLS
            })

            if ((longPositionDataTPSL && process.position === TRADE_POSITION.SHORT) || (shortPositionDataTPSL && process.position === TRADE_POSITION.LONG)) {
                setCurrentModal(MODALS.RISK_ALERT)
                setDataForModal(confirmData)
            } else {
                setDataForModal(confirmData)
                setCurrentModal(MODALS.CONFIRM_POSITION)
            }
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
                position={!!longPositionDataTPSL ? TRADE_POSITION.LONG : TRADE_POSITION.SHORT}
            />
            {isTPSL && <TriggerPrice/>}
            <TradeButtons onClick={startConfirmProcess}/>
        </div>
    )
}

export default memo(Market)