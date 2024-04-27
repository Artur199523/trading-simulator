import React from "react";

export interface RangeSliderITF {
    max: number
    name: string
    value: number
    symbol?: string
    division?: number
    disabled?: boolean
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}