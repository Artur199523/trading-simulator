import {HedgingModeTypeT, PositionFuturesT} from "layouts/providers/type";
import {TRADE_POSITION, TRIGGERS} from "utils";

export interface TradeButtonsITF {
    onClick: (process: StartTradeInitialOptions) => void
}

export interface StartTradeInitialOptions {
    hedgingType: HedgingModeTypeT
    position: PositionFuturesT
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
    Long: {
        current_profit_trigger: TRIGGERS
        current_stop_trigger: TRIGGERS
        profit_trigger_price: string,
        profit_trigger_profit: string,
        profit_percent: number,
        stop_trigger_price: string,
        stop_trigger_stop: string,
        stop_percent: number
    },
    Short: {
        current_profit_trigger: TRIGGERS
        current_stop_trigger: TRIGGERS
        profit_trigger_price: string,
        profit_trigger_profit: string,
        profit_percent: number,
        stop_trigger_price: string,
        stop_trigger_stop: string,
        stop_percent: number
    }
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
    position: TRADE_POSITION
}