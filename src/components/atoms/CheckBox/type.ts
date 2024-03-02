import React, { InputHTMLAttributes } from "react"

export type CheckBoxViewT = "gold"
export type CheckBoxExtendT = "large" | "medium"

export interface checkBoxITF extends InputHTMLAttributes<HTMLInputElement> {
    name: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
    extent?: CheckBoxExtendT
    view?: CheckBoxViewT
    customTextStyle?: string
}