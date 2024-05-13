import React, {useState} from "react";

import {useSimulatorPlayerInfoContext, useSimulatorTradingChartDetailsContext} from "layouts/providers";
import {multiply, plus, SPOT_ORDER_STATUS, SPOT_ORDERS_TABS} from "utils";

import {TabContent, TabItem} from "components";
import Cancelled from "./Cancelled";
import Working from "./Working";
import Filled from "./Filled";
import All from "./All";

import {OrderITF, StopOrderITF} from "layouts/providers/type";

const SpotOrders = () => {
    const {setLimitOrders, setStopLimitOrders} = useSimulatorTradingChartDetailsContext()
    const {setBalanceUSDT, setBalanceTradeableCrypto} = useSimulatorPlayerInfoContext()

    const [activeTab, setActiveTab] = useState<string>(SPOT_ORDERS_TABS.ALL)

    const removeOrder = (removedOrder: OrderITF | StopOrderITF | any) => {
        const {type, order_id, limit_price, quantity} = removedOrder

        switch (type) {
            case "Limit":
                // showNotification(`Order ST${order_id} cancelled (${side}:Limit)`, "warning", 0)

                setLimitOrders(prev => prev.map(order => {
                    if (order_id === order.order_id) order.status = SPOT_ORDER_STATUS.CANCELLED

                    return order
                }))

                if (removedOrder.side === "Buy") {
                    setBalanceUSDT(prev => plus(prev, multiply(quantity, limit_price)))
                } else {
                    setBalanceTradeableCrypto(prev => plus(prev, quantity))
                }
                break
            case "Stop":
                // showNotification(`Order ST${order_id} cancelled (${side}:Stop-Limit)`, "warning", 0)

                setStopLimitOrders(prev => prev.map(order => {
                    if (order_id === order.order_id) order.status = SPOT_ORDER_STATUS.CANCELLED

                    return order
                }))

                if (removedOrder.side === "Buy") {
                    setBalanceUSDT(prev => plus(prev, multiply(quantity, limit_price)))
                } else {
                    setBalanceTradeableCrypto(prev => plus(prev, quantity))
                }
                break
        }
    }

    return (
        <div className="bottom-order-bar_spot-orders">
            <div className="bottom-order-bar_spot-orders_tabs">
                <TabItem activeTab={activeTab} id={SPOT_ORDERS_TABS.ALL} setActiveTab={setActiveTab}>All</TabItem>
                <TabItem activeTab={activeTab} id={SPOT_ORDERS_TABS.WORKING} setActiveTab={setActiveTab}>Working</TabItem>
                <TabItem activeTab={activeTab} id={SPOT_ORDERS_TABS.FILLED} setActiveTab={setActiveTab}>Filled</TabItem>
                <TabItem activeTab={activeTab} id={SPOT_ORDERS_TABS.CANCELLED} setActiveTab={setActiveTab}>Cancelled</TabItem>
            </div>
            <div className="bottom-order-bar_spot-orders_content">
                <TabContent id={SPOT_ORDERS_TABS.ALL} activeTab={activeTab}><All removeOrder={removeOrder}/></TabContent>
                <TabContent id={SPOT_ORDERS_TABS.WORKING} activeTab={activeTab}><Working removeOrder={removeOrder}/></TabContent>
                <TabContent id={SPOT_ORDERS_TABS.FILLED} activeTab={activeTab}><Filled/></TabContent>
                <TabContent id={SPOT_ORDERS_TABS.CANCELLED} activeTab={activeTab}><Cancelled/></TabContent>
            </div>
        </div>
    )
}

export default SpotOrders