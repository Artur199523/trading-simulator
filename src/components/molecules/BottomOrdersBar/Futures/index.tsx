import React, {useState} from "react";

import {useSimulatorTradingChartDetailsContext} from "layouts/providers";
import {ORDER_ACTIVE_TAB} from "utils";

import {TabContent, TabItem} from "components";
import PositionOrder from "./PositionOrder/PositionOrder";
import OrderHistory from "./OrderHistory";
import TradeHistory from "./TradeHistory";

import "../style.scss"
import ProfitLoss from "./ProfitLoss";

const FuturesOrders = () => {
    const [activeTab, setActiveTab] = useState<string>(ORDER_ACTIVE_TAB.POSITION)
    const {confirmedLongPositionData, confirmedShortPositionDataTPSL} = useSimulatorTradingChartDetailsContext()

    const longPositionCount = confirmedLongPositionData ? 1 : 0
    const shortPositionCount = confirmedShortPositionDataTPSL ? 1 : 0
    const totalCount = longPositionCount + shortPositionCount

    return (
        <div className="bottom-order-bar_futures-orders">
            <div className="bottom-order-bar_futures-orders_tabs">
                <span>Trade</span>
                <TabItem activeTab={activeTab} id={ORDER_ACTIVE_TAB.POSITION} setActiveTab={setActiveTab}>{`Position(${totalCount})`}</TabItem>
                <TabItem activeTab={activeTab} id={ORDER_ACTIVE_TAB.PL} setActiveTab={setActiveTab}>P&L</TabItem>
                <TabItem activeTab={activeTab} id={ORDER_ACTIVE_TAB.CURRENT_ORDERS} setActiveTab={setActiveTab}>Current Orders(0)</TabItem>
                <TabItem activeTab={activeTab} id={ORDER_ACTIVE_TAB.ORDER_HISTORY} setActiveTab={setActiveTab}>Order History</TabItem>
                <TabItem activeTab={activeTab} id={ORDER_ACTIVE_TAB.TRADE_HISTORY} setActiveTab={setActiveTab}>Trade History</TabItem>
            </div>
            <div className="bottom-order-bar_futures-orders_content">
                <TabContent id={ORDER_ACTIVE_TAB.POSITION} activeTab={activeTab}><PositionOrder/></TabContent>
                <TabContent id={ORDER_ACTIVE_TAB.PL} activeTab={activeTab}><ProfitLoss/></TabContent>
                <TabContent id={ORDER_ACTIVE_TAB.CURRENT_ORDERS} activeTab={activeTab}>
                    current_orders
                </TabContent>
                <TabContent id={ORDER_ACTIVE_TAB.ORDER_HISTORY} activeTab={activeTab}><OrderHistory/></TabContent>
                <TabContent id={ORDER_ACTIVE_TAB.TRADE_HISTORY} activeTab={activeTab}><TradeHistory/></TabContent>
            </div>
        </div>
    )
}

export default FuturesOrders