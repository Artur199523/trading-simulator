import React, {memo} from "react";
import {format} from "date-fns";

import {SPOT_ORDER_STATUS, SPOT_ALL_ORDERS, SPOT_WORKING_ACTION, interruptionRef} from "utils";
import {useSimulatorTradingChartDetailsContext} from "layouts/providers";

import SideType from "../componnets/SideType";
import {FlexibleTable} from "components";

import {OrderTableITF} from "../type";

const Working: React.FC<OrderTableITF> = ({removeOrder}) => {
    const {
        limitOrders,
        marketOrders,
        stopLimitOrders,
        stopLimitPreOrders,
    } = useSimulatorTradingChartDetailsContext()

    const workingStopPredData = stopLimitPreOrders.filter(order => !order.isActive && order.status === SPOT_ORDER_STATUS.WORKING)
    const workingStopData = stopLimitOrders.filter(order => order.status === SPOT_ORDER_STATUS.WORKING)
    const workingMarketData = marketOrders.filter(order => order.status === SPOT_ORDER_STATUS.WORKING)
    const workingLimitData = limitOrders.filter(order => order.status === SPOT_ORDER_STATUS.WORKING)

    const convertedData = () => {
        const data = interruptionRef([...workingLimitData, ...workingMarketData, ...workingStopData, ...workingStopPredData])

        return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(order => {
            const {date, side, color} = order

            order.date = format(date, "yyyy-MMM-dd hh:mm:ss")
            order.action = <button onClick={() => removeOrder(order)}>Cancel</button>
            order.side = <SideType value={side} color={color}/>

            return order
        })
    }

    return <FlexibleTable
        isPadding={true}
        header={[...SPOT_ALL_ORDERS, SPOT_WORKING_ACTION]}
        body={convertedData()}/>
}

export default memo(Working)