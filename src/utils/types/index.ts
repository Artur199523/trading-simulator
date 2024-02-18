import React from "react";

export interface ModalContextType<T> {
    currentModal: string
    setCurrentModal: React.Dispatch<React.SetStateAction<T>>
    dataForModal?: any
    setDataForModal?: React.Dispatch<React.SetStateAction<any>>
}