import React, {memo} from "react";
import classNames from "classnames";

import {InputITF} from "./type";

import "./style.scss"

const Input: React.FC<InputITF> = ({placeholder, disabled, onChange, name, labelText, labelClickCallback, type, status, value, rightText}) => {
    const inputStyle = classNames("input-block", {"clickable": labelClickCallback}, {"padding-more": rightText})

    return (
        <div className={inputStyle}>
            <label onClick={labelClickCallback}>{labelText} {labelClickCallback && <span>^</span>}</label>
            <div>
                <input
                    className={`input ${status}`}
                    placeholder={placeholder}
                    disabled={disabled}
                    onChange={onChange}
                    name={name}
                    type={type}
                    value={value}
                />
                {rightText && <span className="input-block_right-text">{rightText}</span>}
            </div>
        </div>
    )
}

export default memo(Input)