import React from "react";

export interface InputRangeITF {
    value:number
    onChange:(e:React.ChangeEvent<HTMLInputElement>) => void
    disabled?:boolean
    symbol?:string
    min?:number
    max?:number
}