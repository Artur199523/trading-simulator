import React, {createContext, useContext, useState, memo} from "react"

import {OrderITF, OrderMarkITF, PositionITF, SimulatorProviderITF, SimulatorTradingChartDetailsContextITF, StopOrderITF} from "./type";
import {HistoryItem} from "store/simulator/type";
import {PositionDataITF} from "../../components/molecules/RightBar/Futures/type";

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
    limitOrders: [defaultOrder],
    marketOrders: [defaultOrder],
    currentCryptoData: defaultData,
    limitOrdersMarks: [defaultOrderMark],
    marketOrdersMarks: [defaultOrderMark],
    longPositionData: {} as PositionDataITF,
    shortPositionData: {} as PositionDataITF,
    stopLimitPreOrders: [defaultStopPreOrder],
    stopLimitOrdersMarks: [],
    confirmedLongPositionData:{} as any,
    confirmedShortPositionData:{} as any,
    setLimitOrders: () => {},
    setMarketOrders: () => {},
    setLongPositionData:()=> {},
    setShortPositionData:()=> {},
    setStopLimitOrders: () => {},
    setLimitOrdersMarks: () => {},
    setMarketOrdersMarks: () => {},
    setCurrentCryptoData: () => {},
    setStopLimitPreOrders: () => {},
    setStopLimitOrdersMarks: () => {},
    setConfirmedLongPositionData: () => {},
    setConfirmedShortPositionData: () => {},
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
    const [longPositionData, setLongPositionData] = useState<PositionITF | null>(null)
    const [shortPositionData, setShortPositionData] = useState<PositionITF | null>(null)
    //@TODO need to add the ts
    const [confirmedLongPositionData, setConfirmedLongPositionData] = useState<any | null>(null)
    const [confirmedShortPositionData, setConfirmedShortPositionData] = useState<any | null>(null)

    return (
        <SimulatorTradingChartDetailsContext.Provider value={{
            limitOrders,
            marketOrders,
            stopLimitOrders,
            limitOrdersMarks,
            longPositionData,
            shortPositionData,
            currentCryptoData,
            marketOrdersMarks,
            stopLimitPreOrders,
            stopLimitOrdersMarks,
            confirmedLongPositionData,
            confirmedShortPositionData,
            setLimitOrders,
            setMarketOrders,
            setStopLimitOrders,
            setLongPositionData,
            setShortPositionData,
            setLimitOrdersMarks,
            setCurrentCryptoData,
            setMarketOrdersMarks,
            setStopLimitPreOrders,
            setStopLimitOrdersMarks,
            setConfirmedLongPositionData,
            setConfirmedShortPositionData
        }}>
            {children}
        </SimulatorTradingChartDetailsContext.Provider>
    )
})

export const useSimulatorTradingChartDetailsContext = () => useContext(SimulatorTradingChartDetailsContext)