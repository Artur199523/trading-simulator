import React, {memo} from "react";
import {format} from "date-fns";

import {SPOT_ALL_ORDERS, interruptionRef, SPOT_ORDER_STATUS} from "utils";
import {useSimulatorTradingChartDetailsContext} from "layouts/providers";

import SideType from "../componnets/SideType";
import {FlexibleTable} from "components";

const Cancelled: React.FC = () => {
    const {
        limitOrders,
        stopLimitOrders,
    } = useSimulatorTradingChartDetailsContext()

    const cancelledLimitData = limitOrders.filter(order => order.status === SPOT_ORDER_STATUS.CANCELLED)
    const cancelledStopData = stopLimitOrders.filter(order => order.status === SPOT_ORDER_STATUS.CANCELLED)

    const convertedData = () => {
        const data = interruptionRef([...cancelledLimitData, ...cancelledStopData])

        return data.map(order => {
            const {date, side, color} = order

            order.date = format(date, "yyyy-MMM-dd hh:mm:ss")
            order.side = <SideType value={side} color={color}/>

            return order
        })
    }

    return <FlexibleTable
        isPadding={true}
        header={SPOT_ALL_ORDERS}
        body={convertedData()}
    />
}

export default memo(Cancelled)