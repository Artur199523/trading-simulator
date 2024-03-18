import React, {memo} from "react";
import {InputITF} from "./type";

import "./style.scss"
import classNames from "classnames";

const Input: React.FC<InputITF> = ({placeholder, disabled, onChange, name, labelText, labelClickCallback, type, status, value}) => {
    const inputStyle = classNames("input-block",{"clickable":labelClickCallback})

    return (
        <div className={inputStyle}>
            <label onClick={labelClickCallback}>{labelText} {labelClickCallback && <span>^</span>}</label>
            <input
                className={`input ${status}`}
                placeholder={placeholder}
                disabled={disabled}
                onChange={onChange}
                name={name}
                type={type}
                value={value}
            />
        </div>
    )
}

export default memo(Input)