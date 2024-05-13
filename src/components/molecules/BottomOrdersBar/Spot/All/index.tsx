import React, {memo} from "react";
import {format} from "date-fns";

import {useSimulatorTradingChartDetailsContext} from "layouts/providers";
import {SPOT_ALL_ORDERS, SPOT_WORKING_ACTION} from "utils/const/spot";
import {SPOT_ORDER_STATUS, interruptionRef} from "utils";

import SideType from "../componnets/SideType";
import {FlexibleTable} from "components";

import {OrderTableITF} from "../type";

const All: React.FC<OrderTableITF> = ({removeOrder}) => {
    const {
        limitOrders,
        marketOrders,
        stopLimitOrders,
    } = useSimulatorTradingChartDetailsContext()

    const workingStopData = stopLimitOrders.filter(order => order.status === SPOT_ORDER_STATUS.WORKING)
    const filledStopData = stopLimitOrders.filter(order => order.status === SPOT_ORDER_STATUS.FILLED)
    const cancelledStopData = stopLimitOrders.filter(order => order.status === SPOT_ORDER_STATUS.CANCELLED)

    const convertedData = () => {
        const data = interruptionRef([...marketOrders, ...limitOrders, ...filledStopData, ...workingStopData, ...cancelledStopData])

        return data.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()).map(order => {
            const {date, status, side, color} = order
            order.date = format(date, "yyyy-MMM-dd hh:mm:ss")
            order.action = status === SPOT_ORDER_STATUS.WORKING ? <button onClick={() => removeOrder(order)}>Cancel</button> : ""
            order.side = <SideType value={side} color={color}/>

            return order
        }).sort((a, b) => new Date(b.date).getDate() > new Date(a.date).getDate());
    }

    return <FlexibleTable
        isPadding={true}
        header={[...SPOT_ALL_ORDERS, SPOT_WORKING_ACTION]}
        body={convertedData()}
    />
}

export default memo(All)