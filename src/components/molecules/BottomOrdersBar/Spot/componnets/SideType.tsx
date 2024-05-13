import React from "react";

const SideType: React.FC<{ value: string, color: "red" | "green" }> = ({value, color}) => {
    return (
        <div className={`order-side-type ${color}`}>{value}</div>
    )
}

export default SideType