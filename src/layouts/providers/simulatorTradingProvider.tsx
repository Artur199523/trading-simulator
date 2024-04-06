import React, {createContext, useContext, useState} from "react"

import {HEDGING, MARGIN_MODE} from "utils";

import {PositionFuturesT, PositionITF, ProcessT, SimulatorProviderITF, SimulatorTradingContextITF, TradingType,} from "./type";
import {PositionDataITF} from "components/molecules/RightBar/Futures/type";

const SimulatorTradingContext = createContext<SimulatorTradingContextITF>({
    process:"buy",
    adjustLeverage: 1,
    tradingType:"spot",
    longPositionData:{} as PositionDataITF,
    shortPositionData:{} as PositionDataITF,
    marginMode: MARGIN_MODE.CROSS,
    processFutures: "long",
    orderPlacementPreference: "USDT",
    currentHedgingModePositionType: HEDGING.OPEN,
    setProcess:()=> {},
    setTradingType:()=> {},
    setMarginMode:() => {},
    setAdjustLeverage:()=> {},
    setProcessFutures:() => {},
    setLongPositionData:()=> {},
    setShortPositionData:()=> {},
    setOrderPlacementPreference: ()=> {},
    setCurrentHedgingModePositionType:() => {}
})
export const SimulatorTradingProvider: React.FC<SimulatorProviderITF> = ({children}) => {
    const [tradingType, setTradingType] = useState<TradingType>("spot")

    // SPOT
    const [process,setProcess] = useState<ProcessT>("buy")

    // FUTURES
    const [currentHedgingModePositionType, setCurrentHedgingModePositionType] = useState<HEDGING>(HEDGING.OPEN)
    const [processFutures,setProcessFutures] = useState<PositionFuturesT>("long")

    const [orderPlacementPreference,setOrderPlacementPreference] = useState<string>("USDT")
    const [marginMode,setMarginMode] = useState<MARGIN_MODE>(MARGIN_MODE.CROSS)
    const [adjustLeverage,setAdjustLeverage] = useState<number>(1)
    
    const [longPositionData,setLongPositionData] = useState<PositionITF | null>(null)
    const [shortPositionData,setShortPositionData] = useState<PositionITF | null>(null)

    return (
        <SimulatorTradingContext.Provider value={{
            process,
            marginMode,
            tradingType,
            adjustLeverage,
            processFutures,
            longPositionData,
            shortPositionData,
            orderPlacementPreference,
            currentHedgingModePositionType,
            setProcess,
            setMarginMode,
            setTradingType,
            setAdjustLeverage,
            setProcessFutures,
            setLongPositionData,
            setShortPositionData,
            setOrderPlacementPreference,
            setCurrentHedgingModePositionType
        }}>
            {children}
        </SimulatorTradingContext.Provider>
    )
}

export const useSimulatorTradingContext = () => useContext(SimulatorTradingContext)