import React from "react";

import {
    useSimulatorOptionsContext,
    useSimulatorTradingContext,
    useFuturesTradingModalContext,
    useSimulatorTradingChartDetailsContext
} from "layouts/providers";
import {MODALS, showNotification} from "utils";

import {ModalWindowTemplate} from "components";

import {ConfirmPositionFiledItemITF, ItemTPSLITF} from "../type";

import "./style.scss"

const ConfirmPosition: React.FC = () => {
    const {cryptoType} = useSimulatorOptionsContext()
    const {currentCryptoData} = useSimulatorTradingChartDetailsContext()
    const {adjustLeverage, marginMode} = useSimulatorTradingContext()
    const {setCurrentModal, dataForModal} = useFuturesTradingModalContext()

    const confirm = () => {
        showNotification("Coming soon","info",0)
    }

    const titleColor = dataForModal.trade_position === "Buy" ? "green" : "red"
    const titleText = `${dataForModal.trade_type} ${dataForModal.trade_position}`
    const title = <span><span style={{color: titleColor}}>{titleText}</span> {cryptoType}USDT</span>

    const quantity = `${(dataForModal.order_value_usdt / currentCryptoData.close).toFixed(2)} ${cryptoType}`
    const orderCost = `${(dataForModal.order_value_usdt / adjustLeverage).toFixed(2)} USDT`
    const orderValue = `${dataForModal.order_value_usdt} USDT`
    const leverageWithMode = `${marginMode} ${adjustLeverage}x`
    const takeProfitTriggerPrice = dataForModal.profit_trigger_price ? dataForModal.profit_trigger_price : "--"
    const stopLostTriggerPrice = dataForModal.stop_trigger_price ? dataForModal.stop_trigger_price : "--"
    const takeProfitOrderPrice = dataForModal.profit_trigger_price ? "Market" : "--"
    const stopLostOrderPrice = dataForModal.stop_trigger_price ? "Market" : "--"

    return (
        <ModalWindowTemplate show={true} title={title} confirmCallback={confirm} cancelCallback={() => setCurrentModal(MODALS.CLOSE)}>
            <div className="futures-modal_confirm-position">
                <ConfirmPositionFiledItem name="Order Price" value="Last Traded Price"/>
                <ConfirmPositionFiledItem name="Qty" value={quantity}/>
                <ConfirmPositionFiledItem name="Order Cost" value={orderCost}/>
                <ConfirmPositionFiledItem name="Order Value" value={orderValue}/>
                <ConfirmPositionFiledItem name="Esitmated Liq. Price" value="--"/>
                <ConfirmPositionFiledItem name="Levevage" value={leverageWithMode}/>
                <ConfirmPositionFiledItem name="Time" value="Immediate-Or-Cancel"/>

                <div className="futures-modal_confirm-position_tp-sl">
                    <ConfirmPositionFiledItem name="TP/SL Trigger Price" value={<ItemTPSL valueOne={takeProfitTriggerPrice} valueTwo={stopLostTriggerPrice}/>}/>
                    <ConfirmPositionFiledItem name="TP/SL Order Price" value={<ItemTPSL valueOne={takeProfitOrderPrice} valueTwo={stopLostOrderPrice}/>}/>
                </div>
            </div>
        </ModalWindowTemplate>
    )
}

export default ConfirmPosition

const ConfirmPositionFiledItem: React.FC<ConfirmPositionFiledItemITF> = ({name, value}) => (
    <div className="futures-modal_confirm-position_filed-item">
        <div>{name}</div>
        <div>{value}</div>
    </div>
)

const ItemTPSL: React.FC<ItemTPSLITF> = ({valueOne, valueTwo}) => (
    <div className="futures-modal_confirm-position_filed-item_tp-sl">
        <span>{valueOne}</span> / <span>{valueTwo}</span>
    </div>
)