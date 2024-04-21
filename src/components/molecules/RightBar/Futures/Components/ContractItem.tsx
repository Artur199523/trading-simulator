import React from "react";

import {ContractItemITF} from "../type";
import classNames from "classnames";

const ContractItem: React.FC<ContractItemITF> = ({cryptoType, marginMode, leverage, positionType}) => {
    const contractItemStyle = classNames("futures_order-contract-item", positionType)
    return (
        <div className={contractItemStyle}>
            <span>{cryptoType}USDT</span>
            <span>{marginMode} {leverage}x</span>
        </div>
    )
}

export default ContractItem