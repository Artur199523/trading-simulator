import React, {createContext, useContext, useState, memo} from "react"
import {
    SimulatorProviderITF,
    SimulatorPlayerInfoContextITF,
} from "./type";

const SimulatorPlayerInfoContext = createContext<SimulatorPlayerInfoContextITF>({
    balanceUSDT: 10000,
    balanceTradeableCrypto: 0,
    setBalanceUSDT: () => {},
    setBalanceTradeableCrypto: () => {
    }
})
export const SimulatorPLayerInfoProvider: React.FC<SimulatorProviderITF> = memo(({children}) => {
    const [balanceUSDT, setBalanceUSDT] = useState<number>(10000)
    const [balanceTradeableCrypto, setBalanceTradeableCrypto] = useState<number>(0)

    return (
        <SimulatorPlayerInfoContext.Provider value={{
            balanceUSDT,
            balanceTradeableCrypto,
            setBalanceUSDT,
            setBalanceTradeableCrypto
        }}>
            {children}
        </SimulatorPlayerInfoContext.Provider>
    )
})

export const useSimulatorPlayerInfoContext = () => useContext(SimulatorPlayerInfoContext)