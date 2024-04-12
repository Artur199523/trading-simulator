import React from "react";

import "./style.scss"

// @TODO continue table creating for future
const FlexibleTable: React.FC<any> = ({header, body, hasButton = true, buttonCallBack}) => {
    return (
        <table className="flexible-table-container">
            <thead className="flexible-table-container_head">
            <tr className="flexible-table-container_head_item">
                {header.map((header, index) => (
                    <th key={index}>{header.displayName}</th>
                ))}
            </tr>
            </thead>
            <tbody className="flexible-table-container_body">
            {body.map((row, rowIndex) => (
                <tr className="flexible-table-container_body_item" key={rowIndex}>
                    {header.map((header, index) => (
                        <td className="flexible-table-container_body_item_text-block" key={index}>{row[header.value]}</td>
                    ))}
                    {/*{hasButton && (<td className="flexible-table-container_body_item_btn-block">*/}
                    {/*    {row?.status === "Working" && <button onClick={() => buttonCallBack(row)}>Remove</button>}*/}
                    {/*</td>)}*/}
                </tr>
            ))}
            </tbody>
        </table>
    )
}

export default FlexibleTable