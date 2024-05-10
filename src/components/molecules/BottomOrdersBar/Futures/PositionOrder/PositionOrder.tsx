import React from "react"

import {useSimulatorTradingChartDetailsContext} from "layouts/providers";
import {positionHeader} from "utils";

import {FlexibleTable} from "components/index";

const PositionOrder = () => {
    const {confirmedLongPositionData, confirmedShortPositionData} = useSimulatorTradingChartDetailsContext()
    let positionsData = [];

    if (confirmedShortPositionData) {
        const {liquidity_price} = confirmedShortPositionData
        confirmedShortPositionData.liquidity_price = liquidity_price ? liquidity_price : "--"

        positionsData = [confirmedShortPositionData]
    }

    if (confirmedLongPositionData) {
        const {liquidity_price} = confirmedLongPositionData
        confirmedLongPositionData.liquidity_price = liquidity_price ? liquidity_price : "--"

        positionsData = [...positionsData, confirmedLongPositionData]
    }

    return (
        <FlexibleTable header={positionHeader} body={positionsData}/>
    )
}

export default PositionOrder