import React, {useState} from "react";
import {
    Balance,
    TabItem,
    TabContent,
    FuturesMarket,
    FuturesStopLimit,
    MarginRatioBlock,
    FuturesLimitOrder
} from "components";

import "./style.scss"

const Futures: React.FC = () => {
    const [activeTab, setActiveTab] = useState("limit")

    return (
        <div className="futures">
            <div>
                <div className="futures_tabs">
                    <TabItem activeTab={activeTab} id="limit" setActiveTab={setActiveTab}>Limit</TabItem>
                    <TabItem activeTab={activeTab} id="market" setActiveTab={setActiveTab}>Market</TabItem>
                    <TabItem activeTab={activeTab} id="stop-limit" setActiveTab={setActiveTab}>Stop-limit</TabItem>
                </div>
                <TabContent id="limit" activeTab={activeTab}><FuturesLimitOrder/></TabContent>
                <TabContent id="market" activeTab={activeTab}><FuturesMarket/></TabContent>
                <TabContent id="stop-limit" activeTab={activeTab}><FuturesStopLimit/></TabContent>
            </div>
            <MarginRatioBlock/>
        </div>
    )
}

export default Futures