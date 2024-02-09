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
    symbol:"ETH",
    side:"Buy",
    type:"Market",
    quantity:0,
    price:0,
    limit_price:0,
    stop_price:0,
    last:0,
    status:"Filled",
    order_id:0
}

const defaultMarketOrderMark:OrderMarkITF = {
    time: 0,
    position: 'aboveBar',
    color: "",
    shape: 'circle',
    id: "",
    text: "",
}

const SimulatorTradingChartDetailsContext = createContext<SimulatorTradingChartDetailsContextITF>({
    marketOrders:[defaultOrder],
    marketOrdersMarks:[defaultMarketOrderMark],
    currentCryptoData: defaultData,
    setMarketOrders:()=>{},
    setMarketOrdersMarks:()=>{},
    setCurrentCryptoData: () => {},
})
export const SimulatorTradingChartDetailsProvider: React.FC<SimulatorProviderITF> = memo(({children}) => {
    const [currentCryptoData, setCurrentCryptoData] = useState<HistoryItem>(defaultData)
    const [marketOrders,setMarketOrders] = useState<any>([defaultOrder])
    const [marketOrdersMarks,setMarketOrdersMarks] = useState<any>([defaultMarketOrderMark])

    return (
        <SimulatorTradingChartDetailsContext.Provider value={{
            marketOrders,
            currentCryptoData,
            marketOrdersMarks,
            setMarketOrders,
            setCurrentCryptoData,
            setMarketOrdersMarks
        }}>
            {children}
        </SimulatorTradingChartDetailsContext.Provider>
    )
})

export const useSimulatorTradingChartDetailsContext = () => useContext(SimulatorTradingChartDetailsContext)