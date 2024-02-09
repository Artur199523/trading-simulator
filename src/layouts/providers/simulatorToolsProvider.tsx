import React, {createContext, useContext, useState} from "react"
import {
    CurrentSpeedT,
    SimulatorProviderITF,
    SimulatorToolsContextITF,
} from "./type";

const SimulatorToolsContext = createContext<SimulatorToolsContextITF>({
    setNext: () => {},
    setIsPlay: () => {},
    setIsStart: () => {},
    setCurrentSpeed: () => {},
    next: false,
    isPlay: false,
    isStart: false,
    currentSpeed: 1,
})
export const SimulatorToolsProvider: React.FC<SimulatorProviderITF> = ({children}) => {
    const [isStart, setIsStart] = useState<boolean>(false)
    const [isPlay, setIsPlay] = useState<boolean>(false)
    const [currentSpeed, setCurrentSpeed] = useState<CurrentSpeedT>(1)
    const [next, setNext] = useState<boolean>(false)

    return (
        <SimulatorToolsContext.Provider value={{
            setNext,
            setIsPlay,
            setIsStart,
            setCurrentSpeed,
            next,
            isPlay,
            isStart,
            currentSpeed,
        }}>
            {children}
        </SimulatorToolsContext.Provider>
    )
}

export const useSimulatorToolsContext = () => useContext(SimulatorToolsContext)