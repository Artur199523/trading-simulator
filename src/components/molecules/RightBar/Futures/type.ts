import {HedgingModeTypeT, PositionFuturesT} from "layouts/providers/type";

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