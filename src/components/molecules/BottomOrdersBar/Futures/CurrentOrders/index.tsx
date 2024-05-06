import React, {useState} from "react";

import {CURRENT_ORDERS_ACTIVE_TAB} from "utils";

import {TabContent, TabItem} from "components";
import TrailingStop from "./TrailingStop";
import Conditional from "./Conditional";
import MMRClose from "./MMRClose";
import Active from "./Active";
import TPSL from "./TPSL";

const CurrentOrders: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>(CURRENT_ORDERS_ACTIVE_TAB.ACTIVE)

    return (
        <div className="bottom-order-bar_futures-orders_content_current-orders">
            <div className="bottom-order-bar_futures-orders_content_current-orders_tabs">
                <TabItem activeTab={activeTab} id={CURRENT_ORDERS_ACTIVE_TAB.ACTIVE} setActiveTab={setActiveTab}>Active</TabItem>
                <TabItem activeTab={activeTab} id={CURRENT_ORDERS_ACTIVE_TAB.CONDITIONAL} setActiveTab={setActiveTab}>Conditional</TabItem>
                <TabItem activeTab={activeTab} id={CURRENT_ORDERS_ACTIVE_TAB.TP_SL} setActiveTab={setActiveTab}>TP/SL</TabItem>
                <TabItem activeTab={activeTab} id={CURRENT_ORDERS_ACTIVE_TAB.TRAILING_STOP} setActiveTab={setActiveTab}>Trailing Stop</TabItem>
                <TabItem activeTab={activeTab} id={CURRENT_ORDERS_ACTIVE_TAB.MMR_CLOSE} setActiveTab={setActiveTab}>MMR Close</TabItem>
            </div>
            <div className="bottom-order-bar_futures-orders_content_current-orders_content">
                <TabContent id={CURRENT_ORDERS_ACTIVE_TAB.ACTIVE} activeTab={activeTab}><Active/></TabContent>
                <TabContent id={CURRENT_ORDERS_ACTIVE_TAB.CONDITIONAL} activeTab={activeTab}><Conditional/></TabContent>
                <TabContent id={CURRENT_ORDERS_ACTIVE_TAB.TP_SL} activeTab={activeTab}><TPSL/></TabContent>
                <TabContent id={CURRENT_ORDERS_ACTIVE_TAB.TRAILING_STOP} activeTab={activeTab}><TrailingStop/></TabContent>
                <TabContent id={CURRENT_ORDERS_ACTIVE_TAB.MMR_CLOSE} activeTab={activeTab}><MMRClose/></TabContent>
            </div>
        </div>
    )
}

export default CurrentOrders