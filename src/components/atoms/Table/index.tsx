import React from 'react';
import {TableITF} from "./type";

import "./style.scss"

const Table: React.FC<TableITF> = ({headers, data, hasButton = true, buttonCallBack}) => {

    return (
        <table>
            <thead>
            <tr>
                {headers.map((header, index) => (
                    <th key={index}>{header.displayName}</th>
                ))}
            </tr>
            </thead>
            <tbody>
            {data.map((row, rowIndex) => (
                <tr key={rowIndex}>
                    {headers.map((header, index) => (
                        <td key={index}>{row[header.value]}</td>
                    ))}
                    {hasButton && (<td>
                        {row?.status === "Working" && <button onClick={() => buttonCallBack(row)}>Remove</button>}
                    </td>)}
                </tr>
            ))}
            </tbody>
        </table>
    );
};

export default Table