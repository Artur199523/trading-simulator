import {HedgingModeTypeT} from "layouts/providers/type";
import {CALL_ENVIRONMENT, MARGIN_MODE, TRAD_TYPE, TRADE_POSITION, TRIGGERS} from "utils";
import {ReactNode} from "react";

export interface TradeButtonsITF {
    onClick: (process: StartTradeInitialOptions) => void
}

export interface StartTradeInitialOptions {
    hedgingType: HedgingModeTypeT
    position: TRADE_POSITION
}

export interface HeaderItemITF {
    label: string
    value: string | number
}

export interface TPSLTriggerITF {
    type: string
    currentTrigger: TRIGGERS
    setCurrentTrigger: (trigger: TRIGGERS) => void
}

export interface SettingsFieldsITF {
    Long: PositionDataITF
    Short: PositionDataITF
}

export interface SettingsFieldsMarketITF {
    order_value_usdt: string,
    order_value_percent: number
}

export interface SettingsFieldLimitITF {
    order_price_usdt: string,
    order_value_usdt: string,
    order_value_percent: number
}

export interface PositionDataITF {
    current_profit_trigger: TRIGGERS
    current_stop_trigger: TRIGGERS
    profit_trigger_price: string
    profit_trigger_profit: string
    profit_percent: number
    profit_validation: SettingsFieldsValidationITF
    stop_trigger_price: string
    stop_trigger_stop: string
    stop_percent: number
    stop_validation: SettingsFieldsValidationITF
    name: TRADE_POSITION
    entry_price?: number
    id?: string
}

export interface SettingsFieldsValidationITF {
    issue: boolean
    message: string
}

export interface InputOptionsITF {
    placeholder: string
    rightText: string,
    sliderOneRange?: { max: number, division: number },
    sliderTwoRange?: { max: number, division: number }
}

export interface TPSLTriggerIsCheckedITF {
    roi: boolean
    change: boolean
    pl: boolean
}

export interface TPSLInterface {
    orderValue: string
    confirmed: boolean
    tradType: TRAD_TYPE
    orderPrice?: string
    position: TRADE_POSITION
}

export interface OrderValueITF {
    orderValue: number
    orderPrice?: number
}

export interface ConfirmPositionFiledItemITF {
    name: string
    value: string | number | ReactNode
    className?: string
}

export interface ItemTPSLITF {
    valueOne: string
    valueTwo: string
}

export interface TPSLDataForModalITF {
    tradType: TRAD_TYPE,
    orderPrice: string | undefined,
    orderValue: string
    tradePosition?: TRADE_POSITION,
    call: CALL_ENVIRONMENT
}

export interface ConfirmPositionDataForModalWithoutTPSLITF {
    is_tp_ls: boolean
    order_value_percent: string
    order_value_usdt: number
    time_in_force: string
    trade_position: TRADE_POSITION
    trade_position_process: "Buy" | "Sell"
    trade_type: "Market" | "Limit"
}

export interface ConfirmPositionDataForModalWithTPSLITF extends ConfirmPositionDataForModalWithoutTPSLITF, PositionDataITF {
}

export interface ContractItemITF {
    leverage: number
    marginMode: MARGIN_MODE
    cryptoType: string
    positionType: TRADE_POSITION
}

export interface QuantityItemITF {
    positionType: TRADE_POSITION
    value: number | string
}

export interface UnrealizedItemITF {
    isIncrease: boolean
    profit: number
    percent: number
}

export interface ConfirmedTPSLDataForModalITF {
    orderValue: number
    tradePosition: TRADE_POSITION
    call: CALL_ENVIRONMENT
}

export interface OrderClosedByITF {
    positionType: TRADE_POSITION
}
