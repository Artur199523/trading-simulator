import React, {createContext, useContext, useState} from "react"
import {
    ProcessT,
    MarginModeT,
    TradingType,
    PositionFuturesT,
    HedgingModeTypeT,
    SimulatorProviderITF,
    SimulatorTradingContextITF,
} from "./type";

const SimulatorTradingContext = createContext<SimulatorTradingContextITF>({
    process:"buy",
    adjustLeverage: 1,
    tradingType:"spot",
    marginMode: "cross",
    processFutures: "long",
    totalDepositWithLeverage:0,
    orderPlacementPreference: "USDT",
    currentHedgingModePositionType: "Open",
    setProcess:()=> {},
    setTradingType:()=> {},
    setMarginMode:() => {},
    setAdjustLeverage:()=>{},
    setProcessFutures:() =>{},
    setOrderPlacementPreference: ()=>{},
    setTotalDepositWithLeverage: () => {},
    setCurrentHedgingModePositionType:() => {}
})
export const SimulatorTradingProvider: React.FC<SimulatorProviderITF> = ({children}) => {
    const [tradingType, setTradingType] = useState<TradingType>("spot")

    // SPOT
    const [process,setProcess] = useState<ProcessT>("buy")

    // FUTURES
    const [currentHedgingModePositionType, setCurrentHedgingModePositionType] = useState<HedgingModeTypeT>("Open")
    const [processFutures,setProcessFutures] = useState<PositionFuturesT>("long")

    const [orderPlacementPreference,setOrderPlacementPreference] = useState<string>("USDT")
    const [totalDepositWithLeverage,setTotalDepositWithLeverage ] = useState<number>(0)
    const [marginMode,setMarginMode] = useState<MarginModeT>("cross")
    const [adjustLeverage,setAdjustLeverage] = useState<number>(1)

    return (
        <SimulatorTradingContext.Provider value={{
            process,
            marginMode,
            tradingType,
            adjustLeverage,
            processFutures,
            orderPlacementPreference,
            totalDepositWithLeverage,
            currentHedgingModePositionType,
            setProcess,
            setMarginMode,
            setTradingType,
            setAdjustLeverage,
            setProcessFutures,
            setOrderPlacementPreference,
            setTotalDepositWithLeverage,
            setCurrentHedgingModePositionType
        }}>
            {children}
        </SimulatorTradingContext.Provider>
    )
}

export const useSimulatorTradingContext = () => useContext(SimulatorTradingContext)