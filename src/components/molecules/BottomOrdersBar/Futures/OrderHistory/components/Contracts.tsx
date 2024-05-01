import React from "react";

const Contracts: React.FC<{ value: string, color: "red" | "green" }> = ({value, color}) => {
    return (
        <div className={`order-contract ${color}`}>
            <span>{value}</span>
        </div>
    )
}

export default Contracts