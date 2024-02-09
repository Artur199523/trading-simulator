import React, {createContext, useContext, useState,memo} from "react"
import {CryptoTypeT, CurrencyT, IntervalT, SimulatorOptionsContextITF, SimulatorProviderITF} from "./type";

const SimulatorOptionsContext = createContext<SimulatorOptionsContextITF>({
    setDate: () => {},
    setInterval: () => {},
    setCurrency: () => {},
    setCryptoType: () => {},
    currency: "USD",
    date: new Date().getTime(),
    cryptoType: "ETH",
    interval: "histominute",
})
export const SimulatorOptionsProvider: React.FC<SimulatorProviderITF> = memo(({children}) => {
    const [interval, setInterval] = useState<IntervalT>("histominute")
    const [currency, setCurrency] = useState<CurrencyT>("USD")
    const [cryptoType, setCryptoType] = useState<CryptoTypeT>("ETH")
    const [date,setDate] = useState<number>(new Date().getTime())

    return (
        <SimulatorOptionsContext.Provider value={{
            date,
            interval,
            currency,
            cryptoType,
            setDate,
            setInterval,
            setCurrency,
            setCryptoType
        }}>
            {children}
        </SimulatorOptionsContext.Provider>
    )
})

export const useSimulatorOptionsContext = () => useContext(SimulatorOptionsContext)