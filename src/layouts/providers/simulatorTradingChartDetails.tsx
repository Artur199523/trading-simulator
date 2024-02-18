import React, {createContext, useContext, useState, memo} from "react"
import {OrderITF, OrderMarkITF, SimulatorProviderITF, SimulatorTradingChartDetailsContextITF} from "./type";
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

const defaultOrder:OrderITF= {
    symbol:"",
    side:"",
    type:"",
    quantity:0,
    price:0,
    limit_price:0,
    stop_price:0,
    last:0,
    status:"",
    order_id:0,
    date: new Date()
}

const defaultOrderMark:OrderMarkITF = {
    time: 0,
    position: 'aboveBar',
    color: "",
    shape: 'circle',
    id: "",
    text: "",
}

const SimulatorTradingChartDetailsContext = createContext<SimulatorTradingChartDetailsContextITF>({
    stopValues:[],
    stopLimitOrders:[],
    limitOrders:[defaultOrder],
    marketOrders:[defaultOrder],
    currentCryptoData: defaultData,
    limitOrdersMarks:[defaultOrderMark],
    marketOrdersMarks:[defaultOrderMark],
    stopLimitOrdersMarks: [],
    setStopValue:()=>{},
    setLimitOrders:()=>{},
    setMarketOrders:()=>{},
    setStopLimitOrders:()=>{},
    setLimitOrdersMarks:()=>{},
    setMarketOrdersMarks:()=>{},
    setCurrentCryptoData: () => {},
    setStopLimitOrdersMarks:()=>{}
})
export const SimulatorTradingChartDetailsProvider: React.FC<SimulatorProviderITF> = memo(({children}) => {
    const [currentCryptoData, setCurrentCryptoData] = useState<HistoryItem>(defaultData)

    //Market
    const [marketOrders,setMarketOrders] = useState<OrderITF[]>([defaultOrder])
    const [marketOrdersMarks,setMarketOrdersMarks] = useState<OrderMarkITF[]>([defaultOrderMark])

    //Limit Order
    const [limitOrders,setLimitOrders] = useState<OrderITF[]>([defaultOrder])
    const [limitOrdersMarks,setLimitOrdersMarks] = useState<OrderMarkITF[]>([defaultOrderMark])

    //Stop Limit Order
    const [stopValues,setStopValue] = useState<any>([])
    const [stopLimitOrders,setStopLimitOrders] = useState<any>([])
    const [stopLimitOrdersMarks,setStopLimitOrdersMarks] = useState<any>([])

    return (
        <SimulatorTradingChartDetailsContext.Provider value={{
            stopValues,
            limitOrders,
            marketOrders,
            stopLimitOrders,
            limitOrdersMarks,
            currentCryptoData,
            marketOrdersMarks,
            stopLimitOrdersMarks,
            setStopValue,
            setLimitOrders,
            setMarketOrders,
            setStopLimitOrders,
            setLimitOrdersMarks,
            setCurrentCryptoData,
            setMarketOrdersMarks,
            setStopLimitOrdersMarks
        }}>
            {children}
        </SimulatorTradingChartDetailsContext.Provider>
    )
})

export const useSimulatorTradingChartDetailsContext = () => useContext(SimulatorTradingChartDetailsContext)