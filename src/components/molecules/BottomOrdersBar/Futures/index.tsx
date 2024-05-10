import React, {useState} from "react";

import {useSimulatorTradingChartDetailsContext} from "layouts/providers";
import {ORDER_ACTIVE_TAB} from "utils";

import PositionOrder from "./PositionOrder/PositionOrder";
import {TabContent, TabItem} from "components";
import CurrentOrders from "./CurrentOrders";
import OrderHistory from "./OrderHistory";
import TradeHistory from "./TradeHistory";
import ProfitLoss from "./ProfitLoss";

import "../style.scss"

const FuturesOrders = () => {
    const [activeTab, setActiveTab] = useState<string>(ORDER_ACTIVE_TAB.POSITION)
    const {confirmedLongPositionData, confirmedShortPositionData, currentOrdersTPSL} = useSimulatorTradingChartDetailsContext()

    const longPositionCount = confirmedLongPositionData ? 1 : 0
    const shortPositionCount = confirmedShortPositionData ? 1 : 0
    const totalCountOfPositions = longPositionCount + shortPositionCount

    const ordersTPSL = currentOrdersTPSL.length

    return (
        <div className="bottom-order-bar_futures-orders">
            <div className="bottom-order-bar_futures-orders_tabs">
                <span>Trade</span>
                <TabItem activeTab={activeTab} id={ORDER_ACTIVE_TAB.POSITION} setActiveTab={setActiveTab}>{`Position(${totalCountOfPositions})`}</TabItem>
                <TabItem activeTab={activeTab} id={ORDER_ACTIVE_TAB.PL} setActiveTab={setActiveTab}>P&L</TabItem>
                <TabItem activeTab={activeTab} id={ORDER_ACTIVE_TAB.CURRENT_ORDERS} setActiveTab={setActiveTab}>{`Current Orders(${ordersTPSL})`}</TabItem>
                <TabItem activeTab={activeTab} id={ORDER_ACTIVE_TAB.ORDER_HISTORY} setActiveTab={setActiveTab}>Order History</TabItem>
                <TabItem activeTab={activeTab} id={ORDER_ACTIVE_TAB.TRADE_HISTORY} setActiveTab={setActiveTab}>Trade History</TabItem>
            </div>
            <div className="bottom-order-bar_futures-orders_content">
                <TabContent id={ORDER_ACTIVE_TAB.POSITION} activeTab={activeTab}><PositionOrder/></TabContent>
                <TabContent id={ORDER_ACTIVE_TAB.PL} activeTab={activeTab}><ProfitLoss/></TabContent>
                <TabContent id={ORDER_ACTIVE_TAB.CURRENT_ORDERS} activeTab={activeTab}><CurrentOrders/></TabContent>
                <TabContent id={ORDER_ACTIVE_TAB.ORDER_HISTORY} activeTab={activeTab}><OrderHistory/></TabContent>
                <TabContent id={ORDER_ACTIVE_TAB.TRADE_HISTORY} activeTab={activeTab}><TradeHistory/></TabContent>
            </div>
        </div>
    )
}

export default FuturesOrders