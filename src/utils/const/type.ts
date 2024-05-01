import {ORDER_HISTORY_MARKET_LIMIT_HEADERS, POSITION_HEADERS} from "../enums/futures";

export interface PositionHeaderITF {
    value: POSITION_HEADERS
    displayName: string
    isHoverInfo: boolean
    info: string
    className?: string
    currency?: string
    isFormat?: boolean
    isFixed?: number
}

export interface MarginModeDataITF {
    section_name: string,
    list: string[]
}

export interface OrderHistoryMarketLimitITF {
    value: ORDER_HISTORY_MARKET_LIMIT_HEADERS
    displayName: string
}