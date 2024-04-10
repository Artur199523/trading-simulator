import React, {createContext, useContext, useState} from "react"

import {EnhancedModalContextType, ModalsContextITF} from "./type"
import {MODALS} from "utils";

const ModalContext = createContext<EnhancedModalContextType<any> | undefined>(undefined);

export const FuturesTradingProvider: React.FC<ModalsContextITF> = ({children}) => {
    const [currentModal, setCurrentModal] = useState<MODALS>(MODALS.CLOSE);
    const [dataForModal, setDataForModal] = useState(null);

    return (
        <ModalContext.Provider
            value={{currentModal, setCurrentModal, dataForModal, setDataForModal}}
        >
            {children}
        </ModalContext.Provider>
    )
}

export const useFuturesTradingModalContext = <T extends unknown>() => {
    return useContext<EnhancedModalContextType<T> | undefined>(ModalContext);
}