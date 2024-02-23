import classNames from "classnames";
import React, {useRef, useState} from "react";

import {useSimulatorTradingChartDetailsContext} from "layouts/providers";
import {useOnClickOutSide} from "hooks";

import {TabContent, TabItem, Table} from "components";

import {OrderBlockITF} from "./type";
import "./style.scss"
import {showNotification} from "../../../utils";

const headers = [
    {value: "symbol", displayName: "Symbol"},
    {value: "side", displayName: "Side"},
    {value: "type", displayName: "Type"},
    {value: "quantity", displayName: "Quantity"},
    {value: "limit_price", displayName: "Limit Price"},
    {value: "stop_price", displayName: "Stop Price"},
    {value: "status", displayName: "Status"},
    {value: "order_id", displayName: "Order id"},
]

const OrdersBlock: React.FC<OrderBlockITF> = ({isOpen, setIsOpen}) => {
    const {marketOrders, limitOrders, stopLimitOrders} = useSimulatorTradingChartDetailsContext()

    const [activeTab, setActiveTab] = useState("all")

    const ordersBlockStyle = classNames('orders-block', {'orders-block-open': isOpen})
    const ordersBlockRef = useRef(null)

    const workingMarketData = marketOrders.filter(order => order.status === "Working")
    const filledMarketData = marketOrders.filter(order => order.status === "Filled")
    const cancelledMarketData = marketOrders.filter(order => order.status === "Cancelled")

    const workingLimitData = limitOrders.filter(order => order.status === "Working")
    const filledLimitData = limitOrders.filter(order => order.status === "Filled")
    const cancelledLimitData = limitOrders.filter(order => order.status === "Cancelled")

    const workingStopData = stopLimitOrders.filter(order => order.status === "Working")
    const filledStopData = stopLimitOrders.filter(order => order.status === "Filled")
    const cancelledStopData = stopLimitOrders.filter(order => order.status === "Cancelled")

    useOnClickOutSide(ordersBlockRef, setIsOpen)

    const comingSoonRemoveOrder = () => {
        showNotification("Coming Soon", "info", 0)
    }

    return (
        <div ref={ordersBlockRef} className={ordersBlockStyle}>
            <div className="orders-block_head">
                <button onClick={() => setIsOpen(false)}>X</button>
            </div>
            <div className="orders-block_content">
                <div className="orders-block_content_tabs">
                    <TabItem activeTab={activeTab} id="all" setActiveTab={setActiveTab}>All</TabItem>
                    <TabItem activeTab={activeTab} id="working" setActiveTab={setActiveTab}>Working</TabItem>
                    <TabItem activeTab={activeTab} id="filled" setActiveTab={setActiveTab}>Filled</TabItem>
                    <TabItem activeTab={activeTab} id="cancelled" setActiveTab={setActiveTab}>Cancelled</TabItem>
                </div>
                <div className="orders-block_content_tabs-content">
                    <TabContent id="all" activeTab={activeTab}>
                        <Table
                            buttonCallBack={(order) => comingSoonRemoveOrder()}
                            headers={headers}
                            data={[...marketOrders, ...limitOrders, ...stopLimitOrders]}
                        />
                    </TabContent>
                    <TabContent id="working" activeTab={activeTab}>
                        <Table
                            buttonCallBack={(order) => comingSoonRemoveOrder()}
                            headers={headers}
                            data={[...workingLimitData, ...workingMarketData, ...workingStopData]}/>
                    </TabContent>
                    <TabContent id="filled" activeTab={activeTab}>
                        <Table
                            buttonCallBack={(order) => comingSoonRemoveOrder()}
                            headers={headers}
                            data={[...filledMarketData, ...filledLimitData, ...filledStopData]}
                        />
                    </TabContent>
                    <TabContent id="cancelled" activeTab={activeTab}>
                        <Table
                            buttonCallBack={(order) => comingSoonRemoveOrder()}
                            headers={headers}
                            data={[...cancelledMarketData, ...cancelledLimitData, ...cancelledStopData]}
                        />
                    </TabContent>
                </div>
            </div>
        </div>
    )
}

export default OrdersBlock