import React, {createContext, useContext, useState} from "react"

import {HEDGING, MARGIN_MODE, POSITION_MODE} from "utils";

import {PositionFuturesT, ProcessT, SimulatorProviderITF, SimulatorTradingContextITF, TradingType,} from "./type";

const SimulatorTradingContext = createContext<SimulatorTradingContextITF>({
    process:"buy",
    adjustLeverage: 1,
    riskLimit: 900000,
    tradingType:"spot",
    positionMode: POSITION_MODE.ONE_WAY,
    marginMode: MARGIN_MODE.CROSS,
    processFutures: "long",
    orderPlacementPreference: "USDT",
    currentHedgingModePositionType: HEDGING.OPEN,
    setProcess:()=> {},
    setRiskLimit: () => {},
    setTradingType:()=> {},
    setMarginMode:() => {},
    setPositionMode: () => {},
    setAdjustLeverage:()=> {},
    setProcessFutures:() => {},
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
    const [positionMode,setPositionMode] = useState<POSITION_MODE>(POSITION_MODE.ONE_WAY)
    const [marginMode,setMarginMode] = useState<MARGIN_MODE>(MARGIN_MODE.CROSS)
    const [adjustLeverage,setAdjustLeverage] = useState<number>(1)
    const [riskLimit,setRiskLimit] = useState<number>(900000)

    return (
        <SimulatorTradingContext.Provider value={{
            process,
            riskLimit,
            marginMode,
            tradingType,
            positionMode,
            adjustLeverage,
            processFutures,
            orderPlacementPreference,
            currentHedgingModePositionType,
            setProcess,
            setRiskLimit,
            setMarginMode,
            setTradingType,
            setPositionMode,
            setAdjustLeverage,
            setProcessFutures,
            setOrderPlacementPreference,
            setCurrentHedgingModePositionType
        }}>
            {children}
        </SimulatorTradingContext.Provider>
    )
}

export const useSimulatorTradingContext = () => useContext(SimulatorTradingContext)