import classNames from "classnames";
import React, {useRef, useState} from "react";

import {useSimulatorPlayerInfoContext, useSimulatorTradingChartDetailsContext} from "layouts/providers";
import {useOnClickOutSide} from "hooks";

import {TabContent, TabItem, Table} from "components";
import {multiply, plus, showNotification} from "utils";

import {OrderBlockITF} from "./type";
import "./style.scss"
import {OrderITF, StopOrderITF} from "../../../layouts/providers/type";

const headers = [
    {value: "symbol", displayName: "Symbol"},
    {value: "side", displayName: "Side"},
    {value: "type", displayName: "Type"},
    {value: "quantity", displayName: "Quantity"},
    {value: "limit_price", displayName: "Limit Price"},
    {value: "stop_price", displayName: "Stop Price"},
    {value: "last", displayName: "Last"},
    {value: "total",displayName: "Total"},
    {value: "status", displayName: "Status"},
    {value: "order_id", displayName: "Order id"},
]

const OrdersBlock: React.FC<OrderBlockITF> = ({isOpen, setIsOpen}) => {
    const {
        limitOrders,
        marketOrders,
        setLimitOrders,
        stopLimitOrders,
        stopLimitPreOrders,
        setCancelledOrders,
        setStopLimitOrders,
        setStopLimitPreOrders
    } = useSimulatorTradingChartDetailsContext()

    const {setBalanceUSDT, setBalanceTradeableCrypto} = useSimulatorPlayerInfoContext()

    const [activeTab, setActiveTab] = useState("all")

    const ordersBlockStyle = classNames('orders-block', {'orders-block-open': isOpen})
    const ordersBlockRef = useRef(null)

    const workingMarketData = marketOrders.filter(order => order.status === "Working")
    const filledMarketData = marketOrders.filter(order => order.status === "Filled")

    const workingLimitData = limitOrders.filter(order => order.status === "Working")
    const filledLimitData = limitOrders.filter(order => order.status === "Filled")
    const cancelledLimitData = limitOrders.filter(order => order.status === "Cancelled")

    const workingStopData = stopLimitOrders.filter(order => order.status === "Working")
    const workingStopPredData = stopLimitPreOrders.filter(order => !order.isActive && order.status === "Working")
    const filledStopData = stopLimitOrders.filter(order => order.status === "Filled")
    const cancelledStopData = stopLimitOrders.filter(order => order.status === "Cancelled")

    useOnClickOutSide(ordersBlockRef, setIsOpen)

    const comingSoonRemoveOrder = (removedOrder: OrderITF | StopOrderITF | any) => {
        const {type, order_id, limit_price, quantity, side} = removedOrder

        switch (type) {
            case "Limit":
                showNotification(`Order ST${order_id} cancelled (${side}:Limit)`, "warning", 0)

                setLimitOrders(prev => prev.map(order => {
                    if (order_id === order.order_id) {
                        order.status = "Cancelled"
                    }
                    return order
                }))

                if (removedOrder.side === "Buy") {
                    setBalanceUSDT(prev => plus(prev, multiply(quantity, limit_price)))
                } else {
                    setBalanceTradeableCrypto(prev => plus(prev, quantity))
                }
                break
            case "Stop":
                showNotification(`Order ST${order_id} cancelled (${side}:Stop-Limit)`, "warning", 0)

                setStopLimitOrders(prev => prev.map(order => {
                    if (order_id === order.order_id) {
                        order.status = "Cancelled"
                    }
                    return order
                }))

                if (removedOrder.side === "Buy") {
                    setBalanceUSDT(prev => plus(prev, multiply(quantity, limit_price)))
                } else {
                    setBalanceTradeableCrypto(prev => plus(prev, quantity))
                }
                break
        }
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
                            buttonCallBack={(order) => comingSoonRemoveOrder(order)}
                            headers={headers}
                            data={[...marketOrders, ...limitOrders,...filledStopData, ...workingStopData, ...cancelledStopData]}
                        />
                    </TabContent>
                    <TabContent id="working" activeTab={activeTab}>
                        <Table
                            buttonCallBack={(order) => comingSoonRemoveOrder(order)}
                            headers={headers}
                            data={[...workingLimitData, ...workingMarketData, ...workingStopData, ...workingStopPredData]}/>
                    </TabContent>
                    <TabContent id="filled" activeTab={activeTab}>
                        <Table
                            headers={headers}
                            data={[...filledMarketData, ...filledLimitData, ...filledStopData]}
                        />
                    </TabContent>
                    <TabContent id="cancelled" activeTab={activeTab}>
                        <Table
                            headers={headers}
                            data={[...cancelledLimitData, ...cancelledStopData]}
                        />
                    </TabContent>
                </div>
            </div>
        </div>
    )
}

export default OrdersBlock