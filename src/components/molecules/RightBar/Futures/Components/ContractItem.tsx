import classNames from "classnames";
import React from "react";

import {ContractItemITF} from "../type";

const ContractItem: React.FC<ContractItemITF> = ({cryptoType, marginMode, leverage, positionType}) => {
    const contractItemStyle = classNames("futures_order-contract-item", positionType.toLowerCase())
    return (
        <div className={contractItemStyle}>
            <span>{cryptoType}USDT</span>
            <span>{marginMode} {leverage}x</span>
        </div>
    )
}

export default ContractItem