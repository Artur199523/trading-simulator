import React, {memo, useEffect, useState} from "react";

import {useFuturesTradingModalContext, useSimulatorPlayerInfoContext, useSimulatorTradingContext} from "layouts/providers";
import {interruptionRef} from "utils/functions/interruptionRef";
import {MODALS, TRAD_TYPE, TRADE_POSITION} from "utils";

import OrderValueInfo from "./Components/OrderValueInfo";
import TradeButtons from "./Components/TradeButtons";
import {Input, InputRangeSlider} from "components";

import TriggerPrice from "./Components/TriggerPrice";
import TPSL from "./Components/TPSL";

import {SettingsFieldLimitITF, StartTradeInitialOptions} from "./type";

const settingsFields: SettingsFieldLimitITF = {
    order_price_usdt: "",
    order_value_usdt: "",
    order_value_percent: 0
}

const LimitOrder: React.FC = () => {
    const fieldsCopy = interruptionRef(settingsFields)

    const [fieldsValue, setFieldsValue] = useState<any>(fieldsCopy)

    const {adjustLeverage, longPositionData, shortPositionData, setShortPositionData, setLongPositionData} = useSimulatorTradingContext()
    const {balanceUSDT} = useSimulatorPlayerInfoContext()
    const {setCurrentModal} = useFuturesTradingModalContext()

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

    const startTrade = (process: StartTradeInitialOptions) => {
        console.log(process)
    }

    const orderValue = fieldsValue.order_price_usdt ? fieldsValue.order_value_usdt ? Number(fieldsValue.order_value_usdt) : 0 : 0
    const orderPrice = fieldsValue.order_price_usdt ? Number(fieldsValue.order_price_usdt) : 0

    return (
        <div className="futures_limit-order">
            <Input
                type="number"
                rightText="USDT"
                name="order_price_usdt"
                labelText="Order Price"
                value={fieldsValue.order_price_usdt}
                onChange={(event) => inputHandle(event)}
            />
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
            <OrderValueInfo orderValue={orderValue} orderPrice={orderPrice}/>
            <TPSL
                confirmed={isTPSL}
                tradType={TRAD_TYPE.LIMIT}
                orderValue={fieldsValue.order_value_usdt}
                orderPrice={fieldsValue.order_price_usdt}
                position={!!longPositionData ? TRADE_POSITION.LONG : TRADE_POSITION.SHORT}
            />
            {isTPSL && <TriggerPrice/>}
            <TradeButtons onClick={startTrade}/>
        </div>
    )
}

export default memo(LimitOrder)