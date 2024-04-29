import React from "react";
import classNames from "classnames";

import {TRADE_POSITION} from "utils";

import {QuantityItemITF} from "../type";

const QuantityItem: React.FC<QuantityItemITF> = ({positionType, value}) => {

    let quantity = value
    let isLongPosition = positionType === TRADE_POSITION.LONG;

    quantity = isLongPosition ? quantity : -quantity

    const quantityItemStyle = classNames("futures_order-quantity-item", positionType.toLowerCase())

    return (
        <span className={quantityItemStyle}>{quantity}</span>
    )
}

export default QuantityItem