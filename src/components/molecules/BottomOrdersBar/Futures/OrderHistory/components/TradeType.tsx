import React from "react";

const TradeType: React.FC<{ value: string, color: "red" | "green" }> = ({value, color}) => {
    return (
        <div className={`order-trade-type ${color}`}>{value}</div>
    )
}

export default TradeType