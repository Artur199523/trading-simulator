import {HedgingModeTypeT} from "layouts/providers/type";
import {TRADE_POSITION, TRIGGERS} from "utils";
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
    orderPrice?: string
    confirmed: boolean
    position: TRADE_POSITION
}

export interface OrderValueITF {
    orderValue: number
    orderPrice?: number
}

export interface ConfirmPositionFiledItemITF {
    name: string
    value: string | number | ReactNode
}

export interface ItemTPSLITF {
    valueOne: string
    valueTwo: string
}