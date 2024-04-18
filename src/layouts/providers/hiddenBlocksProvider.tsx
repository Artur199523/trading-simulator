import React, {createContext, useContext, useState} from "react"

import {EnhancedHiddenBlockContextType, ModalsContextITF} from "./type"
import {HIDDEN_BLOCKS} from "utils";

const ModalContext = createContext<EnhancedHiddenBlockContextType | undefined>(undefined);

export const HiddenBlocksProvider: React.FC<ModalsContextITF> = ({children}) => {
    const [hiddenBlock, setHiddenBlock] = useState<HIDDEN_BLOCKS>(HIDDEN_BLOCKS.CLOSE)

    return (
        <ModalContext.Provider
            value={{hiddenBlock, setHiddenBlock}}
        >
            {children}
        </ModalContext.Provider>
    )
}

export const useHiddenBlocksContext = () => {
    return useContext<EnhancedHiddenBlockContextType | undefined>(ModalContext);
}