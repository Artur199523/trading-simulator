import React from "react";

export type StatusT = "error" | ""

export interface InputITF {
    placeholder?:string,
    disabled?:boolean,
    name:string,
    type:string,
    value:string | number,
    onChange:(e:React.ChangeEvent<HTMLInputElement>)=>void
    status?:StatusT
    labelText?: string
    labelClickCallback?: () => void
    rightText?:string
}