import classNames from "classnames";
import React from "react";

import {
    useSimulatorOptionsContext,
    useSimulatorTradingContext,
    useFuturesTradingModalContext,
    useSimulatorPlayerInfoContext,
    useSimulatorTradingChartDetailsContext
} from "layouts/providers";
import {MODALS, showNotification} from "utils";
import {liquidityCalculation} from "utils/functions/trade/liquidityCalculation";

import {ModalWindowTemplate} from "components";

import {ConfirmPositionDataForModalWithTPSLITF, ConfirmPositionFiledItemITF, ItemTPSLITF} from "../type";

import "./style.scss"

const ConfirmPosition: React.FC = () => {
    const {cryptoType} = useSimulatorOptionsContext()
    const {currentCryptoData} = useSimulatorTradingChartDetailsContext()
    const {adjustLeverage, marginMode} = useSimulatorTradingContext()
    const {setCurrentModal, dataForModal} = useFuturesTradingModalContext<ConfirmPositionDataForModalWithTPSLITF>()
    const {balanceUSDT} = useSimulatorPlayerInfoContext()

    const confirm = () => {
        showNotification("Coming soon", "info", 0)
    }

    const getDisplayOrDash = (value: any) => {
        return value !== undefined && value !== null && value !== '' ? value : '--';
    };

    const {trade_position_process, trade_type, order_value_usdt, profit_trigger_price, stop_trigger_price, trade_position} = dataForModal
    const {close: currentPrice} = currentCryptoData

    const calculatedLiquidity = liquidityCalculation(currentPrice, balanceUSDT, Number(order_value_usdt), trade_position)

    const titleColor = trade_position_process === "Buy" ? "green" : "red"
    const titleText = `${trade_type} ${trade_position}`
    const title = <span><span style={{color: titleColor}}>{titleText}</span> {cryptoType}USDT</span>

    const quantity = `${(order_value_usdt / currentCryptoData.close).toFixed(2)} ${cryptoType}`
    const orderCost = `${(order_value_usdt / adjustLeverage).toFixed(2)} USDT`
    const orderValue = `${order_value_usdt} USDT`
    const leverageWithMode = `${marginMode} ${adjustLeverage}x`
    const takeProfitTriggerPrice = getDisplayOrDash(profit_trigger_price)
    const stopLostTriggerPrice = getDisplayOrDash(stop_trigger_price)
    const takeProfitOrderPrice = profit_trigger_price ? "Market" : "--"
    const stopLostOrderPrice = stop_trigger_price ? "Market" : "--"
    const liquidity = calculatedLiquidity ? `${Number(calculatedLiquidity.toFixed(2))} USDT` : "--"

    const liquidityStyle = classNames({'brand-color': calculatedLiquidity > 0})

    return (
        <ModalWindowTemplate show={true} title={title} confirmCallback={confirm} cancelCallback={() => setCurrentModal(MODALS.CLOSE)}>
            <div className="futures-modal_confirm-position">
                <ConfirmPositionFiledItem name="Order Price" value="Last Traded Price"/>
                <ConfirmPositionFiledItem name="Qty" value={quantity}/>
                <ConfirmPositionFiledItem name="Order Cost" value={orderCost}/>
                <ConfirmPositionFiledItem name="Order Value" value={orderValue}/>
                <ConfirmPositionFiledItem className={liquidityStyle} name="Esitmated Liq. Price" value={liquidity}/>
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

const ConfirmPositionFiledItem: React.FC<ConfirmPositionFiledItemITF> = ({name, value, className = ""}) => (
    <div className={`futures-modal_confirm-position_filed-item ${className}`}>
        <div>{name}</div>
        <div>{value}</div>
    </div>
)

const ItemTPSL: React.FC<ItemTPSLITF> = ({valueOne, valueTwo}) => (
    <div className="futures-modal_confirm-position_filed-item_tp-sl">
        <span>{valueOne}</span> / <span>{valueTwo}</span>
    </div>
)