import classNames from "classnames";
import React from "react";

import {fixedNumber} from "utils";

import {UnrealizedItemITF} from "../type";

const UnrealizedItem: React.FC<UnrealizedItemITF> = ({isIncrease, profit, percent}) => {
    const unrealizedItemStyle = classNames("futures_order-unrealized-item", {"increase": isIncrease}, {"decrease": !isIncrease})

    return (
        <div className={unrealizedItemStyle}>{fixedNumber(profit, 2)} USDT ({fixedNumber(percent, 4)}%)</div>
    )
}

export default UnrealizedItem