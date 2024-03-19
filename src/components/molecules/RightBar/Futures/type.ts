import {HedgingModeTypeT, PositionFuturesT} from "layouts/providers/type";
import {Dispatch, SetStateAction} from "react";
import {TRIGGERS} from "utils";

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
    setCurrentTrigger: Dispatch<SetStateAction<TRIGGERS>>
}

export interface SettingsFieldsITF {
    Long: {
        "profit_trigger_price": string,
        "profit_trigger_profit": string,
        "profit_percent": number,
        "stop_trigger_price": string,
        "stop_trigger_stop": string,
        "stop_percent": number
    },
    Short: {
        "profit_trigger_price": string,
        "profit_trigger_profit": string,
        "profit_percent": number,
        "stop_trigger_price": string,
        "stop_trigger_stop": string,
        "stop_percent": number
    }
}