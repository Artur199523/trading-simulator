import classNames from "classnames";
import React, {useRef} from "react";

import {useHiddenBlocksContext} from "layouts/providers";
import {useOnClickOutSide} from "hooks";
import {HIDDEN_BLOCKS} from "utils";

import "./style.scss"

const MarginMode: React.FC<{ className: string }> = ({className}) => {
    const {setHiddenBlock, hiddenBlock} = useHiddenBlocksContext()

    const ordersBlockRef = useRef(null)

    const marginModeStyle = classNames("hidden-block_margin-mode", className)

    const checkingForHidde = () => {
        if (hiddenBlock === HIDDEN_BLOCKS.MARGIN_MODE) {
            setHiddenBlock(HIDDEN_BLOCKS.SETTINGS)
        }
    }

    useOnClickOutSide(ordersBlockRef, checkingForHidde)

    return (
        <div ref={ordersBlockRef} className={marginModeStyle}>

        </div>
    )
}

export default MarginMode