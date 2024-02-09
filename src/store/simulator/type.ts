export interface SimulatorStoreITF {
    tradingHistoryAllData: {
        loading: boolean,
        success: boolean,
        error: null | unknown,
        data: null | HistoryItem[],
    },
    tradingHistoryPartData: {
        data: null | HistoryItem[],
    },
    tradingHistoryVolumeAllData: {
        data: null | TradingVolumeITF[],
    },
    tradingHistoryVolumePartData: {
        data: null | TradingVolumeITF[],
    },
}

export interface TradingHistoryITF {
    Response: string,
    Message: string,
    HasWarning: boolean,
    Type: number,
    RateLimit: object,
    Data: {
        Aggregated: boolean,
        TimeFrom: number,
        TimeTo: number,
        Data: HistoryItem[]
    }
}

export interface HistoryItem {
    time: string,
    high: number,
    low: number,
    open: number,
    volumefrom: number,
    volumeto: number,
    close: number,
    conversionType: string,
    conversionSymbol: string
}

export interface TradingVolumeITF {
    color: string
    time: string
    value: number
}