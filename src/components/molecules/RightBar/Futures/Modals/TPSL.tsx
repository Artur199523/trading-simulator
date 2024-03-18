import React, {useState} from "react";

import {useFuturesTradingModalContext, useSimulatorTradingChartDetailsContext} from "layouts/providers";

import {ModalWindow, Button} from "components";

import "./style.scss"
import {HeaderItemITF} from "../type";

const TPSL: React.FC = () => {
    const {setCurrentModal} = useFuturesTradingModalContext()
    const {currentCryptoData} = useSimulatorTradingChartDetailsContext()
    const {dataForModal} = useFuturesTradingModalContext()

    const [activeTradeType, setActiveTradeType] = useState("long")
    const confirmMode = () => {
        setCurrentModal("")
    }

    return (
        <ModalWindow show={true} title="Add TP/SL">
            <div className="futures-modal_tpls_header">
                <HeaderItem label="Order Price" value="Last Traded Price"/>
                <HeaderItem label="Qty" value={(dataForModal.orderValue / currentCryptoData.close).toFixed(3)}/>
                <HeaderItem label="Last Traded Price" value={currentCryptoData.close}/>
            </div>
            <div className={`futures-modal_tpls_trade-type ${activeTradeType}`}>
                <Button onClick={() => setActiveTradeType("long")}>Long</Button>
                <Button onClick={() => setActiveTradeType("short")}>Short</Button>
            </div>
            <div className="futures-modal_tpls_which_order">
                <span>Curren Order</span>
            </div>
            <div className="futures-modal_btns">
                <Button onClick={() => setCurrentModal("")}>Cancel</Button>
                <Button onClick={confirmMode} view="two">Confirm</Button>
            </div>
        </ModalWindow>
    )
}

export default TPSL

const HeaderItem: React.FC<HeaderItemITF> = ({label, value}) => (
    <div className="futures-modal_tpls_header_item">
        <div className="futures-modal_tpls_header_item_label">{label}</div>
        <div className="futures-modal_tpls_header_item_value">{value}</div>
    </div>
)