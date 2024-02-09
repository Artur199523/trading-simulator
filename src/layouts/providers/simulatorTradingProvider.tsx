import React, {createContext, useContext, useState} from "react"
import {
    ProcessT,
    TradingType,
    SimulatorProviderITF,
    SimulatorTradingContextITF,
} from "./type";

const SimulatorTradingContext = createContext<SimulatorTradingContextITF>({
    process:"buy",
    tradingType:"spot",
    setProcess:()=> {},
    setTradingType:()=>{}
})
export const SimulatorTradingProvider: React.FC<SimulatorProviderITF> = ({children}) => {
    const [tradingType, setTradingType] = useState<TradingType>("spot")
    const [process,setProcess] = useState<ProcessT>("buy")

    return (
        <SimulatorTradingContext.Provider value={{
            process,
            tradingType,
            setProcess,
            setTradingType
        }}>
            {children}
        </SimulatorTradingContext.Provider>
    )
}

export const useSimulatorTradingContext = () => useContext(SimulatorTradingContext)