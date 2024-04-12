import React, {useState} from "react";

import {ORDER_ACTIVE_TAB} from "utils";
import {TabContent, TabItem} from "components";
import PositionOrder from "./PositionOrder";

import "../style.scss"

const FuturesOrders = () => {
    const [activeTab, setActiveTab] = useState<string>(ORDER_ACTIVE_TAB.POSITION)

    return (
        <div className="bottom-order-bar_futures-orders">
            <div className="bottom-order-bar_futures-orders_tabs">
                <span>Trade</span>
                <TabItem activeTab={activeTab} id={ORDER_ACTIVE_TAB.POSITION as string} setActiveTab={setActiveTab}>Position(0)</TabItem>
                <TabItem activeTab={activeTab} id={ORDER_ACTIVE_TAB.PL} setActiveTab={setActiveTab}>P&L</TabItem>
                <TabItem activeTab={activeTab} id={ORDER_ACTIVE_TAB.CURRENT_ORDERS} setActiveTab={setActiveTab}>Current Orders(0)</TabItem>
                <TabItem activeTab={activeTab} id={ORDER_ACTIVE_TAB.ORDER_HISTORY} setActiveTab={setActiveTab}>Order History</TabItem>
                <TabItem activeTab={activeTab} id={ORDER_ACTIVE_TAB.TRADE_HISTORY} setActiveTab={setActiveTab}>Trade History</TabItem>
            </div>
            <div className="bottom-order-bar_futures-orders_content">
                <TabContent id="position" activeTab={activeTab}>
                    <PositionOrder/>
                </TabContent>
                <TabContent id="pl" activeTab={activeTab}>
                    pl
                </TabContent>
                <TabContent id="current_orders" activeTab={activeTab}>
                    current_orders
                </TabContent>
                <TabContent id="order_history" activeTab={activeTab}>
                    order_history
                </TabContent>
                <TabContent id="trade_history" activeTab={activeTab}>
                    trade_history
                </TabContent>
            </div>
        </div>
    )
}

export default FuturesOrders