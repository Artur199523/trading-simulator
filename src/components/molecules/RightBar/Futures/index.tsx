import React, {useState} from "react";

import {showNotification, TRAD_TYPE} from "utils";

import {FuturesLimitOrder, FuturesMarket, MarginRatioBlock, TabContent, TabItem} from "components";

import "./style.scss"

const Futures: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>(TRAD_TYPE.MARKET)

    const setCurrentTab = (tab: TRAD_TYPE) => {
        if (tab === TRAD_TYPE.LIMIT) {
            showNotification("Not Available yet", "info", 0)
        }
    }

    return (
        <div className="futures">
            <div>
                <div className="futures_tabs">
                    <TabItem activeTab={activeTab} id={TRAD_TYPE.LIMIT} setActiveTab={(tab) => setCurrentTab(tab as TRAD_TYPE)}>Limit</TabItem>
                    <TabItem activeTab={activeTab} id={TRAD_TYPE.MARKET} setActiveTab={setActiveTab}>Market</TabItem>
                </div>
                <TabContent id="limit" activeTab={activeTab}><FuturesLimitOrder/></TabContent>
                <TabContent id="market" activeTab={activeTab}><FuturesMarket/></TabContent>
            </div>
            <MarginRatioBlock/>
        </div>
    )
}

export default Futures