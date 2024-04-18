import React, {createContext, useContext, useState} from "react"

import {HEDGING, MARGIN_MODE, POSITION_MODE} from "utils";

import {PositionFuturesT, PositionITF, ProcessT, SimulatorProviderITF, SimulatorTradingContextITF, TradingType,} from "./type";
import {PositionDataITF} from "components/molecules/RightBar/Futures/type";

const SimulatorTradingContext = createContext<SimulatorTradingContextITF>({
    process:"buy",
    adjustLeverage: 1,
    tradingType:"spot",
    positionMode: POSITION_MODE.HEDGE,
    longPositionData:{} as PositionDataITF,
    shortPositionData:{} as PositionDataITF,
    marginMode: MARGIN_MODE.CROSS,
    processFutures: "long",
    orderPlacementPreference: "USDT",
    currentHedgingModePositionType: HEDGING.OPEN,
    setProcess:()=> {},
    setTradingType:()=> {},
    setMarginMode:() => {},
    setPositionMode: () => {},
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
    const [positionMode,setPositionMode] = useState<POSITION_MODE>(POSITION_MODE.HEDGE)
    const [marginMode,setMarginMode] = useState<MARGIN_MODE>(MARGIN_MODE.CROSS)
    const [adjustLeverage,setAdjustLeverage] = useState<number>(1)

    const [longPositionData,setLongPositionData] = useState<PositionITF | null>(null)
    const [shortPositionData,setShortPositionData] = useState<PositionITF | null>(null)

    return (
        <SimulatorTradingContext.Provider value={{
            process,
            marginMode,
            tradingType,
            positionMode,
            adjustLeverage,
            processFutures,
            longPositionData,
            shortPositionData,
            orderPlacementPreference,
            currentHedgingModePositionType,
            setProcess,
            setMarginMode,
            setTradingType,
            setPositionMode,
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