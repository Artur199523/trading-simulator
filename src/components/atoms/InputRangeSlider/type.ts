import React from "react";

export interface RangeSliderITF {
    max: number
    name: string
    value: number
    symbol?: string
    division?: number
    onChange: (e: React.ChangeEvent<HTMLInputElement>) => void
}