import React from "react"
import classNames from "classnames"
import { checkBoxITF } from "./type"
import "./style.scss"

const CheckBox: React.FC<checkBoxITF> = ({ name, onChange, checked, extent, view, customTextStyle, children }) => {
    const extendStyle = classNames("checkBox", extent ?? "large", view ?? "gold")
    const formControlStyle = classNames("checkbox-form-control", extent ?? "large", customTextStyle)

    return (
        <label className={formControlStyle}>
            <input
                data-testid="checkbox-test"
                name={name}
                onChange={onChange}
                type="checkbox"
                checked={checked}
                className={extendStyle}
            />
            {children}
        </label>
    )
}
export default CheckBox