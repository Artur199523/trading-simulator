import React, { InputHTMLAttributes } from "react"

export type CheckBoxViewT = "gold"
export type CheckBoxExtendT = "large" | "medium" | "small"

export interface checkBoxITF extends InputHTMLAttributes<HTMLInputElement> {
    name: string
    view?: CheckBoxViewT
    extent?: CheckBoxExtendT
    customTextStyle?: string
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}