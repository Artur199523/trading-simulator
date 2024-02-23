import {Dispatch, SetStateAction} from "react";

export interface OrderBlockITF{
    isOpen:boolean
    setIsOpen: Dispatch<SetStateAction<boolean>>
}