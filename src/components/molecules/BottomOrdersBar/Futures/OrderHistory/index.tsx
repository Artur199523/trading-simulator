import React, {useState} from "react";

import {ORDER_HISTORY_ACTIVE_TAB} from "utils";

import {TabContent, TabItem} from "components";
import LimitMarket from "./LimitMarket";

const OrderHistory: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>(ORDER_HISTORY_ACTIVE_TAB.LIMIT_MARKET)

    return (
        <div className="bottom-order-bar_futures-orders_content_order-history">
            <div className="bottom-order-bar_futures-orders_content_order-history_tabs">
                <TabItem activeTab={activeTab} id={ORDER_HISTORY_ACTIVE_TAB.LIMIT_MARKET} setActiveTab={setActiveTab}>Limit & Market</TabItem>
                <TabItem activeTab={activeTab} id={ORDER_HISTORY_ACTIVE_TAB.CONDITIONAL} setActiveTab={setActiveTab}>Conditional</TabItem>
                <TabItem activeTab={activeTab} id={ORDER_HISTORY_ACTIVE_TAB.TP_SL} setActiveTab={setActiveTab}>TP/SL</TabItem>
                <TabItem activeTab={activeTab} id={ORDER_HISTORY_ACTIVE_TAB.TRAILING_STOP} setActiveTab={setActiveTab}>Trailing Stop</TabItem>
                <TabItem activeTab={activeTab} id={ORDER_HISTORY_ACTIVE_TAB.MMR_CLOSE} setActiveTab={setActiveTab}>MMR Close</TabItem>
            </div>
            <div className="bottom-order-bar_futures-orders_content_order-history_content">
                <TabContent id={ORDER_HISTORY_ACTIVE_TAB.LIMIT_MARKET} activeTab={activeTab}><LimitMarket/></TabContent>
                <TabContent id={ORDER_HISTORY_ACTIVE_TAB.CONDITIONAL} activeTab={activeTab}>
                </TabContent>
                <TabContent id={ORDER_HISTORY_ACTIVE_TAB.TP_SL} activeTab={activeTab}>
                </TabContent>
                <TabContent id={ORDER_HISTORY_ACTIVE_TAB.TRAILING_STOP} activeTab={activeTab}>
                </TabContent>
                <TabContent id={ORDER_HISTORY_ACTIVE_TAB.MMR_CLOSE} activeTab={activeTab}>
                </TabContent>
            </div>
        </div>
    )
}

export default OrderHistory