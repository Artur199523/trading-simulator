import React, {createContext, useContext, useState, memo} from "react"

import {
    OrderITF,
    PositionITF,
    OrderMarkITF,
    StopOrderITF,
    SimulatorProviderITF,
    ConfirmedPositionData,
    SimulatorTradingChartDetailsContextITF
} from "./type";
import {PositionDataITF} from "components/molecules/RightBar/Futures/type";
import {HistoryItem} from "store/simulator/type";

const defaultData: HistoryItem = {
    time: "",
    high: 0,
    low: 0,
    open: 0,
    volumefrom: 0,
    volumeto: 0,
    close: 0,
    conversionType: "",
    conversionSymbol: ""
}

const defaultOrder: OrderITF = {
    symbol: "",
    side: "",
    type: "",
    quantity: 0,
    price: 0,
    limit_price: 0,
    stop_price: 0,
    last: 0,
    status: "",
    order_id: 0,
    date: new Date()
}

const defaultStopPreOrder: StopOrderITF = {
    ...defaultOrder,
    influence: "",
    fee: 0,
    total: 0,
    isActive: false
}

const defaultOrderMark: OrderMarkITF = {
    time: 0,
    position: 'aboveBar',
    color: "",
    shape: 'circle',
    id: "",
    text: "",
}

const SimulatorTradingChartDetailsContext = createContext<SimulatorTradingChartDetailsContextITF>({
    stopLimitOrders: [],
    stopLimitOrdersMarks: [],
    limitOrders: [defaultOrder],
    marketOrders: [defaultOrder],
    currentCryptoData: defaultData,
    limitOrdersMarks: [defaultOrderMark],
    marketOrdersMarks: [defaultOrderMark],
    stopLimitPreOrders: [defaultStopPreOrder],
    longPositionDataTPSL: {} as PositionDataITF,
    shortPositionDataTPSL: {} as PositionDataITF,
    confirmedLongPositionDataTPSL: {} as PositionITF,
    confirmedShortPositionDataTPSL: {} as PositionITF,
    confirmedLongPositionData: {} as ConfirmedPositionData,
    confirmedShortPositionData: {} as ConfirmedPositionData,
    confirmedLongPositionDataHistory: [] as ConfirmedPositionData[],
    confirmedShortPositionDataHistory: [] as ConfirmedPositionData[],
    setLimitOrders: () => {
    },
    setMarketOrders: () => {
    },
    setStopLimitOrders: () => {
    },
    setLimitOrdersMarks: () => {
    },
    setMarketOrdersMarks: () => {
    },
    setCurrentCryptoData: () => {
    },
    setStopLimitPreOrders: () => {
    },
    setLongPositionDataTPSL: () => {
    },
    setShortPositionDataTPSL: () => {
    },
    setStopLimitOrdersMarks: () => {
    },
    setConfirmedLongPositionData: () => {
    },
    setConfirmedShortPositionData: () => {
    },
    setConfirmedLongPositionDataTPSL: () => {
    },
    setConfirmedShortPositionDataTPSL: () => {
    },
    setConfirmedLongPositionDataHistory: () => {
    },
    setConfirmedShortPositionDataHistory: () => {
    }
})
export const SimulatorTradingChartDetailsProvider: React.FC<SimulatorProviderITF> = memo(({children}) => {
    const [currentCryptoData, setCurrentCryptoData] = useState<HistoryItem>(defaultData)

    //===============SPOT=============================
    //Market
    const [marketOrders, setMarketOrders] = useState<OrderITF[] | []>([])
    const [marketOrdersMarks, setMarketOrdersMarks] = useState<OrderMarkITF[] | []>([])

    //Limit Order
    const [limitOrders, setLimitOrders] = useState<OrderITF[] | []>([])
    const [limitOrdersMarks, setLimitOrdersMarks] = useState<OrderMarkITF[] | []>([])

    //Stop Limit Order
    const [stopLimitOrders, setStopLimitOrders] = useState<StopOrderITF[] | []>([])
    const [stopLimitPreOrders, setStopLimitPreOrders] = useState<StopOrderITF[] | []>([])
    const [stopLimitOrdersMarks, setStopLimitOrdersMarks] = useState<OrderMarkITF[] | []>([])

    //==============FUTURES================================
    const [longPositionDataTPSL, setLongPositionDataTPSL] = useState<PositionITF | null>(null)
    const [shortPositionDataTPSL, setShortPositionDataTPSL] = useState<PositionITF | null>(null)

    const [confirmedLongPositionDataTPSL, setConfirmedLongPositionDataTPSL] = useState<PositionITF | null>(null)
    const [confirmedShortPositionDataTPSL, setConfirmedShortPositionDataTPSL] = useState<PositionITF | null>(null)

    const [confirmedLongPositionData, setConfirmedLongPositionData] = useState<ConfirmedPositionData | null>(null)
    const [confirmedShortPositionData, setConfirmedShortPositionData] = useState<ConfirmedPositionData | null>(null)

    const [confirmedLongPositionDataHistory, setConfirmedLongPositionDataHistory] = useState<ConfirmedPositionData[] | []>([])
    const [confirmedShortPositionDataHistory, setConfirmedShortPositionDataHistory] = useState<ConfirmedPositionData[] | []>([])

    return (
        <SimulatorTradingChartDetailsContext.Provider value={{
            limitOrders,
            marketOrders,
            stopLimitOrders,
            limitOrdersMarks,
            currentCryptoData,
            marketOrdersMarks,
            stopLimitPreOrders,
            stopLimitOrdersMarks,
            longPositionDataTPSL,
            shortPositionDataTPSL,
            confirmedLongPositionData,
            confirmedShortPositionData,
            confirmedLongPositionDataTPSL,
            confirmedShortPositionDataTPSL,
            confirmedLongPositionDataHistory,
            confirmedShortPositionDataHistory,
            setLimitOrders,
            setMarketOrders,
            setStopLimitOrders,
            setLimitOrdersMarks,
            setCurrentCryptoData,
            setMarketOrdersMarks,
            setStopLimitPreOrders,
            setLongPositionDataTPSL,
            setStopLimitOrdersMarks,
            setShortPositionDataTPSL,
            setConfirmedLongPositionData,
            setConfirmedShortPositionData,
            setConfirmedLongPositionDataTPSL,
            setConfirmedShortPositionDataTPSL,
            setConfirmedLongPositionDataHistory,
            setConfirmedShortPositionDataHistory
        }}>
            {children}
        </SimulatorTradingChartDetailsContext.Provider>
    )
})

export const useSimulatorTradingChartDetailsContext = () => useContext(SimulatorTradingChartDetailsContext)