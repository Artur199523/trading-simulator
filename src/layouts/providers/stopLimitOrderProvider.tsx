import React, {createContext, useContext, useState} from "react"

import {ModalsContextITF, StopLimitOrderT, StopOrderITF} from "./type"
import {ModalContextType} from "utils/types"

const ModalContext = createContext<ModalContextType<StopLimitOrderT> | undefined>(undefined)

export const StopOrderLimitModalsProvider: React.FC<ModalsContextITF> = ({children}) => {
    const [currentModal, setCurrentModal] = useState<StopLimitOrderT>("")
    const [dataForModal, setDataForModal] = useState<StopOrderITF>(null)

    return (
        <ModalContext.Provider value={{currentModal, setCurrentModal, dataForModal, setDataForModal}}>
            {children}
        </ModalContext.Provider>
    )
}

export const useStopOrderLimitModalContext = () => useContext(ModalContext)