import React, {createContext, useContext, useState} from "react"

import {FuturesTradingModalsT, ModalsContextITF, StopOrderITF} from "./type"
import {ModalContextType} from "utils/types"

const ModalContext = createContext<ModalContextType<FuturesTradingModalsT> | undefined>(undefined)

export const FuturesTradingProvider: React.FC<ModalsContextITF> = ({children}) => {
    const [currentModal, setCurrentModal] = useState<FuturesTradingModalsT>("")
    const [dataForModal, setDataForModal] = useState<StopOrderITF>(null)

    return (
        <ModalContext.Provider value={{currentModal, setCurrentModal, dataForModal, setDataForModal}}>
            {children}
        </ModalContext.Provider>
    )
}

export const useFuturesTradingModalContext = () => useContext(ModalContext)