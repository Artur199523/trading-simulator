import React from "react";

import {useSimulatorPlayerInfoContext, useSimulatorTradingChartDetailsContext, useStopOrderLimitModalContext} from "layouts/providers";
import {minus, multiply, plus, showNotification,SUCCESS} from "utils";

import ModalWindow from "components/atoms/ModalWindow";
import Button from "components/atoms/Button";

import {OrderITF} from "layouts/providers/type";

import "./style.scss"

const StopLimitOrderConfirm: React.FC = () => {
    const {setBalanceUSDT, setBalanceTradeableCrypto} = useSimulatorPlayerInfoContext()
    const {dataForModal, setCurrentModal} = useStopOrderLimitModalContext()
    const {setStopLimitOrders} = useSimulatorTradingChartDetailsContext()

    const confirmStopOrder = () => {
        const data = {...dataForModal}
        const {quantityCrypto, currentPrice, side, limit_price} = dataForModal

        delete dataForModal.fee
        delete dataForModal.total

        if (side === "buy") {
            setBalanceTradeableCrypto(prev => plus(prev, quantityCrypto))
            setBalanceUSDT(prev => minus(prev, currentPrice))
        }

        if (side === "sell") {
            setBalanceTradeableCrypto(prev => minus(prev, quantityCrypto))
            setBalanceUSDT(prev => plus(prev, multiply(quantityCrypto, limit_price)))
        }

        setStopLimitOrders((prev: OrderITF[]) => {
            let orderId = prev.length ? prev[prev.length - 1].order_id + 1 : 1

            return [...prev, {...data, order_id: orderId, date: new Date()}]
        })

        setCurrentModal("")
        showNotification(SUCCESS.CONFIRMATION_ORDER, "success", 0)
    }

    const influenceText = dataForModal.influence === "down" ? "drops to or below" : "rises to or above"

    return (
        <ModalWindow show={true} title="Confirmation Order">
            <div className="stop-limit-modal">
                <ul>
                    <OrderItem className={dataForModal.side} name={`${dataForModal.symbol}/USDT`} value={`${dataForModal.side}/${dataForModal.type}-Limit`}/>
                    <OrderItem name="Stop" value={dataForModal.stop_price}/>
                    <OrderItem name="Limit" value={dataForModal.limit_price}/>
                    <OrderItem name="Amount" value={`${dataForModal.quantity} ${dataForModal.symbol}`}/>
                    <OrderItem name="Total" value={dataForModal.total}/>
                    <OrderItem name="Est. Fee" value={dataForModal.fee}/>
                </ul>
                <div className="stop-limit-modal_text">
                    If the last price {influenceText} {dataForModal.stop_price} USDT, an order
                    to {dataForModal.side} {dataForModal.quantity} {dataForModal.symbol} at a price of {dataForModal.limit_price} USDT will be placed.
                </div>
                <div className="stop-limit-modal_btns">
                    <Button onClick={() => setCurrentModal("")}>Cancel</Button>
                    <Button onClick={confirmStopOrder} view="two">Confirm</Button>
                </div>
            </div>
        </ModalWindow>
    )
}

export default StopLimitOrderConfirm

const OrderItem: React.FC<{ name: string, value: string | number, className?: string }> = ({name, value, className}) => (
    <li className="stop-limit-modal_order-item">
        <span>{name}</span>
        <span className={className}>{value}</span>
    </li>
)