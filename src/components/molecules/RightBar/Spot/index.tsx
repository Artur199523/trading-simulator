import React, {useState} from "react";

import {StopOrderLimitModalsProvider} from "layouts/providers/stopLimitOrderProvider";

import {TabItem, TabContent, Market, Balance, LimitOrder, StopLimit} from "components";
import Modals from "./Modals";

import "./style.scss"

const Spot: React.FC = () => {
    const [activeTab, setActiveTab] = useState("limit")

    return (
        <div className="spot">
            <div className="spot_tabs">
                <TabItem activeTab={activeTab} id="limit" setActiveTab={setActiveTab}>Limit</TabItem>
                <TabItem activeTab={activeTab} id="market" setActiveTab={setActiveTab}>Market</TabItem>
                <TabItem activeTab={activeTab} id="stop-limit" setActiveTab={setActiveTab}>Stop-limit</TabItem>
            </div>
            <Balance/>
            <TabContent id="limit" activeTab={activeTab}><LimitOrder/></TabContent>
            <TabContent id="market" activeTab={activeTab}><Market/></TabContent>
            <TabContent id="stop-limit" activeTab={activeTab}>
                <StopOrderLimitModalsProvider>
                    <StopLimit/>
                    <Modals/>
                </StopOrderLimitModalsProvider>
            </TabContent>
        </div>
    )
}

export default Spot