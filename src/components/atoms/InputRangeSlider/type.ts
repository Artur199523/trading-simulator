import React  from "react";

export interface RangeSliderITF {
    name: string
    max: number
    value: number
    sliderMarksType?: string
    onChange: (e:React.ChangeEvent<HTMLInputElement>) => void
}