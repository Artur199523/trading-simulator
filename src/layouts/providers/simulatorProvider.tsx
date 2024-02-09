import React, {createContext, useContext, useState} from "react"
import {CryptoTypeT, CurrencyT, CurrentSpeedT, IntervalT, ProcessT, SimulatorContextITF, SimulatorProviderITF, TradingType} from "./type";
import {HistoryItem} from "../../store/simulator/type";

const SimulatorContext = createContext<SimulatorContextITF>({
    setNext: () => {},
    setIsPlay: () => {},
    setIsStart: () => {},
    setInterval: () => {},
    setProcess: () => {},
    setCurrency: () => {},
    setCryptoType: () => {},
    setTradingType: () => {},
    setUSDTBalance: () => {},
    setCurrentSpeed: () => {},
    setCurrentCryptoData: () => {},
    setCurrentCryptoBalance: () => {},
    next: false,
    isPlay: false,
    isStart: false,
    process: "buy",
    currency: "USD",
    currentSpeed: 1,
    cryptoType: "ETH",
    USDTBalance:10000,
    tradingType: "spot",
    currentCryptoData: {},
    interval: "histominute",
    currentCryptoBalance: 0,
})
export const SimulatorProvider: React.FC<SimulatorProviderITF> = ({children}) => {
    const [interval, setInterval] = useState<IntervalT>("histominute")
    const [currency, setCurrency] = useState<CurrencyT>("USD")
    const [cryptoType, setCryptoType] = useState<CryptoTypeT>("ETH")

    const [isStart, setIsStart] = useState<boolean>(false)
    const [isPlay, setIsPlay] = useState<boolean>(false)
    const [currentSpeed, setCurrentSpeed] = useState<CurrentSpeedT>(1)
    const [next, setNext] = useState<boolean>(false)

    const [tradingType, setTradingType] = useState<TradingType>("spot")
    const [process,setProcess] = useState<ProcessT>("buy")
    const [currentCryptoData,setCurrentCryptoData] = useState<HistoryItem | {}>({})

    //player info
    const [USDTBalance,setUSDTBalance] = useState(10000)
    const [currentCryptoBalance,setCurrentCryptoBalance] = useState(0)

    return (
        <SimulatorContext.Provider value={{
            setNext,
            setIsPlay,
            setIsStart,
            setProcess,
            setInterval,
            setCurrency,
            setCryptoType,
            setUSDTBalance,
            setTradingType,
            setCurrentSpeed,
            setCurrentCryptoData,
            setCurrentCryptoBalance,
            next,
            isPlay,
            isStart,
            process,
            interval,
            currency,
            cryptoType,
            tradingType,
            USDTBalance,
            currentSpeed,
            currentCryptoData,
            currentCryptoBalance,
        }}>
            {children}
        </SimulatorContext.Provider>
    )
}

export const useSimulatorContext = () => useContext(SimulatorContext)