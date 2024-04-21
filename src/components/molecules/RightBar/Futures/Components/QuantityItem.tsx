import React from "react";
import classNames from "classnames";

import {QuantityItemITF} from "../type";

const QuantityItem: React.FC<QuantityItemITF> = ({positionType, value}) => {
    let quantity = Number(value)
    let isLongPosition = positionType === "long";

    quantity = isLongPosition ? quantity : -quantity

    const quantityItemStyle = classNames("futures_order-quantity-item", positionType)

    return (
        <span className={quantityItemStyle}>{quantity}</span>
    )
}

export default QuantityItem