import React, {createContext, useContext, useState} from "react"

import {ModalsContextITF, StopOrderITF} from "./type"
import {ModalContextType} from "utils/types"
import {MODALS} from "utils";

const ModalContext = createContext<ModalContextType<MODALS> | undefined>(undefined)

export const FuturesTradingProvider: React.FC<ModalsContextITF> = ({children}) => {
    const [currentModal, setCurrentModal] = useState<MODALS>(MODALS.CLOSE)
    const [dataForModal, setDataForModal] = useState<StopOrderITF>(null)

    return (
        <ModalContext.Provider value={{currentModal, setCurrentModal, dataForModal, setDataForModal}}>
            {children}
        </ModalContext.Provider>
    )
}

export const useFuturesTradingModalContext = () => useContext(ModalContext)