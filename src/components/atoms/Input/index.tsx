import React, {memo} from "react";
import {InputITF} from "./type";

import "./style.scss"

const Input: React.FC<InputITF> = ({placeholder, disabled, onChange, name, type,status,value}) => {
    return (
        <input
            className={`input ${status}`}
            placeholder={placeholder}
            disabled={disabled}
            onChange={onChange}
            name={name}
            type={type}
            value={value}

        />
    )
}

export default memo(Input)