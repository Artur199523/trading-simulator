import React, {useState} from "react";

import {TRAD_TYPE} from "utils";

import {FuturesLimitOrder, FuturesMarket, MarginRatioBlock, TabContent, TabItem} from "components";

import "./style.scss"

const Futures: React.FC = () => {
    const [activeTab, setActiveTab] = useState<string>(TRAD_TYPE.LIMIT)

    return (
        <div className="futures">
            <div>
                <div className="futures_tabs">
                    <TabItem activeTab={activeTab} id={TRAD_TYPE.LIMIT} setActiveTab={setActiveTab}>Limit</TabItem>
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