import React, {memo} from "react";

import {InputRangeITF} from "./type";

import "./style.scss"

const InputRange: React.FC<InputRangeITF> = ({onChange,value}) => {
    return (
        <div className="input-range">
            <input
                type="range"
                id="vol"
                name="vol"
                min="0"
                max="100"
                onChange={(e) =>
                    (onChange(e.target.value as any))
                }
                value={value}/>
            <span className="input-range_percent">{value}%</span>
        </div>
    )
}

export default memo(InputRange)