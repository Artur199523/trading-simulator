import React from "react";

import {useSimulatorTradingChartDetailsContext, useStopOrderLimitModalContext} from "layouts/providers";

import ModalWindow from "components/atoms/ModalWindow";
import Button from "components/atoms/Button";

import "./style.scss"

const StopLimitOrderConfirm: React.FC = () => {
    const {dataForModal, setCurrentModal} = useStopOrderLimitModalContext()
    const {setStopValue} = useSimulatorTradingChartDetailsContext()

    const confirmStopOrder = () => {
        const data = {...dataForModal}

        delete dataForModal.fee
        delete dataForModal.total

        setStopValue(data)
        setCurrentModal("")
    }

    return (
        <ModalWindow show={true} title="Confirmation Order">
            <div className="stop-limit-modal">
                <ul>
                    <OrderItem className={dataForModal.side} name={`${dataForModal.symbol}/USDT`} value={`${dataForModal.side}/${dataForModal.type}`}/>
                    <OrderItem name="Stop" value={dataForModal.stop_price}/>
                    <OrderItem name="Limit" value={dataForModal.limit_price}/>
                    <OrderItem name="Amount" value={`${dataForModal.quantity} ${dataForModal.symbol}`}/>
                    <OrderItem name="Total" value={dataForModal.total}/>
                    <OrderItem name="Est. Fee" value={dataForModal.fee}/>
                </ul>
                <div className="stop-limit-modal_text">
                    `If the last price drops to or below ${dataForModal.stop_price} USDT, an order to buy
                    ${dataForModal.limit_price * dataForModal.quantity} ${dataForModal.symbol} at a price
                    of {dataForModal.limit_price} USDT will be placed.`
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