import React, {createContext, useContext, useState} from "react"
import {
    ProcessT,
    MarginModeT,
    TradingType,
    ProcessFuturesT,
    SimulatorProviderITF,
    SimulatorTradingContextITF,
} from "./type";

const SimulatorTradingContext = createContext<SimulatorTradingContextITF>({
    process:"buy",
    adjustLeverage: 1,
    tradingType:"spot",
    marginMode: "cross",
    processFutures: "buy/long",
    setProcess:()=> {},
    setTradingType:()=> {},
    setMarginMode:() => {},
    setAdjustLeverage:()=>{},
    setProcessFutures:() =>{}
})
export const SimulatorTradingProvider: React.FC<SimulatorProviderITF> = ({children}) => {
    const [tradingType, setTradingType] = useState<TradingType>("spot")

    // SPOT
    const [process,setProcess] = useState<ProcessT>("buy")

    // FUTURES
    const [processFutures,setProcessFutures] = useState<ProcessFuturesT>("buy/long")
    const [marginMode,setMarginMode] = useState<MarginModeT>("cross")
    const [adjustLeverage,setAdjustLeverage] = useState<number>(1)

    return (
        <SimulatorTradingContext.Provider value={{
            process,
            marginMode,
            tradingType,
            adjustLeverage,
            processFutures,
            setProcess,
            setMarginMode,
            setTradingType,
            setAdjustLeverage,
            setProcessFutures
        }}>
            {children}
        </SimulatorTradingContext.Provider>
    )
}

export const useSimulatorTradingContext = () => useContext(SimulatorTradingContext)