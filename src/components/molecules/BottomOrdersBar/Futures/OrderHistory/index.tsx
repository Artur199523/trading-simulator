import React, {useState} from "react";

import {ORDER_HISTORY_ACTIVE_TAB} from "utils";

import {TabContent, TabItem} from "components";
import TrailingStop from "./TrailingStop";
import LimitMarket from "./LimitMarket";
import Conditional from "./Conditional";
import MMRClose from "./MMRClose";
import TPSL from "./TPSL";

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
                <TabContent id={ORDER_HISTORY_ACTIVE_TAB.CONDITIONAL} activeTab={activeTab}><Conditional/></TabContent>
                <TabContent id={ORDER_HISTORY_ACTIVE_TAB.TP_SL} activeTab={activeTab}><TPSL/></TabContent>
                <TabContent id={ORDER_HISTORY_ACTIVE_TAB.TRAILING_STOP} activeTab={activeTab}><TrailingStop/></TabContent>
                <TabContent id={ORDER_HISTORY_ACTIVE_TAB.MMR_CLOSE} activeTab={activeTab}><MMRClose/></TabContent>
            </div>
        </div>
    )
}

export default OrderHistory