import React, {createContext, useContext, useState, memo} from "react"
import {
    SimulatorProviderITF,
    SimulatorPlayerInfoContextITF,
} from "./type";

const SimulatorPlayerInfoContext = createContext<SimulatorPlayerInfoContextITF>({
    balanceUSDT: 10000,
    balanceTradeableCrypto: 0,
    totalDepositWithLeverage: 10000,
    setBalanceUSDT: () => {},
    setTotalDepositWithLeverage: () => {},
    setBalanceTradeableCrypto: () => {}
})
export const SimulatorPLayerInfoProvider: React.FC<SimulatorProviderITF> = ({children}) => {
    const [balanceUSDT, setBalanceUSDT] = useState<number>(10000)
    const [balanceTradeableCrypto, setBalanceTradeableCrypto] = useState<number>(0)
    const [totalDepositWithLeverage,setTotalDepositWithLeverage ] = useState<number>(balanceUSDT)

    return (
        <SimulatorPlayerInfoContext.Provider value={{
            balanceUSDT,
            balanceTradeableCrypto,
            totalDepositWithLeverage,
            setBalanceUSDT,
            setBalanceTradeableCrypto,
            setTotalDepositWithLeverage
        }}>
            {children}
        </SimulatorPlayerInfoContext.Provider>
    )
}

export const useSimulatorPlayerInfoContext = () => useContext(SimulatorPlayerInfoContext)