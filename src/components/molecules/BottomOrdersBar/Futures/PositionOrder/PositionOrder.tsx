import React from "react"

import {useSimulatorTradingChartDetailsContext} from "layouts/providers";
import {positionHeader} from "utils";

import {FlexibleTable} from "components/index";

const PositionOrder = () => {
    const {confirmedLongPositionData, confirmedShortPositionData} = useSimulatorTradingChartDetailsContext()
    let positionsData = [];

    if (confirmedShortPositionData) {
        positionsData = [confirmedShortPositionData]
    }

    if (confirmedLongPositionData) {
        positionsData = [...positionsData, confirmedLongPositionData]
    }

    return (
        <FlexibleTable header={positionHeader} body={positionsData}/>
    )
}

export default PositionOrder