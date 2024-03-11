import React, {useEffect} from "react";

import {
    useSimulatorPlayerInfoContext,
    useSimulatorToolsContext,
    useSimulatorTradingChartDetailsContext,
    useStopOrderLimitModalContext
} from "layouts/providers";
import {minus, multiply, showNotification, SUCCESS} from "utils";

import ModalWindow from "components/atoms/ModalWindow";
import Button from "components/atoms/Button";

import {OrderITF} from "layouts/providers/type";

import "./style.scss"

const StopLimitOrderConfirm: React.FC = () => {
    const {dataForModal, setCurrentModal} = useStopOrderLimitModalContext()
    const {setBalanceUSDT, setBalanceTradeableCrypto} = useSimulatorPlayerInfoContext()
    const {setStopLimitOrders} = useSimulatorTradingChartDetailsContext()
    const {setIsPlay} = useSimulatorToolsContext()

    useEffect(() => {
        return () => setIsPlay(true)
    }, []);

    const confirmStopOrder = () => {
        const data = {...dataForModal}
        const {side, limit_price, quantity} = dataForModal

        delete dataForModal.fee

        if (side === "Buy") {
            setBalanceUSDT(prev => minus(prev, multiply(quantity, limit_price)))
        }

        if (side === "Sell") {
            setBalanceTradeableCrypto(prev => minus(prev, quantity))
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