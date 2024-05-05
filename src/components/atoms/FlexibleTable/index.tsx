import React from "react";

import {fixedNumber, formatNumber} from "utils";

import {FlexibleTableItemITF, FlexibleTableITF} from "./type";

import {NoData} from "assets/svg";
import "./style.scss"

// @TODO continue table creating for future
const FlexibleTable: React.FC<FlexibleTableITF> = ({header, body}) => {
    return (
        <React.Fragment>
            <table className="flexible-table-container">
                <thead className="flexible-table-container_head">
                <tr className="flexible-table-container_head_item">
                    {header.map((header, index) => (
                        <th key={index}>{header.displayName}</th>
                    ))}
                </tr>
                </thead>
                <tbody className="flexible-table-container_body">
                {body.length &&
                    <React.Fragment>
                        {body.map((row, rowIndex) => (
                            <tr className="flexible-table-container_body_item" key={rowIndex}>
                                {header.map((header, index) => (
                                    <td
                                        className={`flexible-table-container_body_item_text-block ${header.className ? header.className : ""}`}
                                        key={index}
                                    >
                                        <FlexibleTableItem header={header} row={row}/>
                                    </td>
                                ))}
                            </tr>
                        ))}
                    </React.Fragment>}
                </tbody>
            </table>
            {!body.length && <div className="flexible-table-container_no-data">
                <div>
                    <NoData/>
                    <p>No Available Data</p>
                </div>
            </div>}
        </React.Fragment>
    )
}

export default FlexibleTable

const FlexibleTableItem: React.FC<FlexibleTableItemITF> = ({header, row}) => {

    let value = row[header.value];
    const isCurrency = header.currency
    const isFormat = header.isFormat
    const isFixed = header.isFixed

    value = isFixed ? fixedNumber(value, isFixed) : value
    value = isFormat ? formatNumber(value) : value
    value = isCurrency ? `${value} USDT` : value

    return (
        <React.Fragment>{value}</React.Fragment>
    )
}