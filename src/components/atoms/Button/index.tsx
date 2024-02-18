import React from "react"

import {ButtonProps} from "./type"
import "./style.scss"

const Button: React.FC<ButtonProps> = ({children, onClick, view = "one", ...props}) => (
    <button {...props} onClick={onClick} className={`button ${view}`}>{children}</button>
)

export default Button