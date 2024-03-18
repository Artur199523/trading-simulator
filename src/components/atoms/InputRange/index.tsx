import React, {memo} from "react";

import {InputRangeITF} from "./type";

import "./style.scss"

const InputRange: React.FC<InputRangeITF> = ({onChange,value,disabled,symbol='%',min = 0, max = 100}) => {
    return (
        <div className="input-range">
            <input
                type="range"
                id="vol"
                name="vol"
                min={min}
                max={max}
                disabled={disabled}
                onChange={(e) =>
                    (onChange(e.target.value as any))
                }
                value={value}/>
            <span className="input-range_percent">{value}{symbol}</span>
        </div>
    )
}

export default memo(InputRange)