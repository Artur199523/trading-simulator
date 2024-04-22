import classNames from "classnames";
import {v4 as uuidv4} from 'uuid'
import React from "react";

import {
    useSimulatorOptionsContext,
    useSimulatorTradingContext,
    useFuturesTradingModalContext,
    useSimulatorPlayerInfoContext,
    useSimulatorTradingChartDetailsContext
} from "layouts/providers";
import {
    MODALS,
    calculationIM,
    calculationMM,
    TRADE_POSITION,
    showNotification,
    calculationLiquidity,
    calculationRealizedPL,
    calculationOrderCostLongPosition,
    calculationOrderCostShortPosition
} from "utils";

import {ModalWindowTemplate} from "components";
import ContractItem from "../Components/ContractItem";
import QuantityItem from "../Components/QuantityItem";

import {ConfirmedTPSLDataForModalITF, ConfirmPositionDataForModalWithTPSLITF, ConfirmPositionFiledItemITF, ItemTPSLITF} from "../type";

import "./style.scss"
import UnrealizedItem from "../Components/UnrealizedItem";
import {Edit} from "../../../../../assets/svg";

const ConfirmPosition: React.FC = () => {
    const {cryptoType} = useSimulatorOptionsContext()
    const {currentCryptoData} = useSimulatorTradingChartDetailsContext()
    const {marginMode, adjustLeverage} = useSimulatorTradingContext()
    const {
        longPositionDataTPSL,
        shortPositionDataTPSL,
        setLongPositionDataTPSL,
        setShortPositionDataTPSL,
        setConfirmedLongPositionData,
        setConfirmedShortPositionData,
        confirmedLongPositionDataTPSL,
        confirmedShortPositionDataTPSL,
        setConfirmedLongPositionDataTPSL,
        setConfirmedShortPositionDataTPSL
    } = useSimulatorTradingChartDetailsContext()
    const {balanceUSDT} = useSimulatorPlayerInfoContext()
    const {setCurrentModal, dataForModal} = useFuturesTradingModalContext<ConfirmPositionDataForModalWithTPSLITF>()
    const {setDataForModal: setDataForModalTPSL} = useFuturesTradingModalContext<ConfirmedTPSLDataForModalITF>()

    const {trade_position_process, trade_type, order_value_usdt, profit_trigger_price, stop_trigger_price, trade_position} = dataForModal
    const {close: currentPrice} = currentCryptoData

    const getDisplayOrDash = (value: any) => {
        return value !== undefined && value !== null && value !== '' ? value : '--';
    };

    const calculatedLiquidity = Number(calculationLiquidity(currentPrice, balanceUSDT, Number(order_value_usdt), trade_position).toFixed(2))
    const calculatedQuantity = (order_value_usdt / currentCryptoData.close).toFixed(2)

    const titleColor = trade_position_process === "Buy" ? "green" : "red"
    const titleText = `${trade_type} ${trade_position}`
    const title = <span><span style={{color: titleColor}}>{titleText}</span> {cryptoType}USDT</span>

    const quantity = `${calculatedQuantity} ${cryptoType}`
    const orderCost = trade_position_process === "Buy"
        ? `${calculationOrderCostLongPosition(order_value_usdt, adjustLeverage, 0.055).toFixed(2)} USDT`
        : `${calculationOrderCostShortPosition(order_value_usdt, adjustLeverage, 0.055).toFixed(2)} USDT`
    const orderValue = `${order_value_usdt} USDT`
    const leverageWithMode = `${marginMode} ${adjustLeverage}x`
    const takeProfitTriggerPrice = getDisplayOrDash(profit_trigger_price)
    const stopLostTriggerPrice = getDisplayOrDash(stop_trigger_price)
    const takeProfitOrderPrice = profit_trigger_price ? "Market" : "--"
    const stopLostOrderPrice = stop_trigger_price ? "Market" : "--"
    const liquidity = calculatedLiquidity ? `${calculatedLiquidity} USDT` : "--"

    const liquidityStyle = classNames({'brand-color': calculatedLiquidity > 0})

    const currentPriceMatchRangeChecking = () => {
        const isTradePositionLong = trade_position_process === "Buy"
        const isTradePositionShort = trade_position_process === "Sell"
        const isCurrentPriceMatchRangeLong = currentPrice < Number(profit_trigger_price) && currentPrice > Number(stop_trigger_price)
        const isCurrentPriceMatchRangeShort = isTradePositionShort && currentPrice > Number(profit_trigger_price) && currentPrice < Number(stop_trigger_price)

        const handleModalAndNotification = () => {
            setCurrentModal(MODALS.CLOSE);
            showNotification("Order failed", "error", 0);
            return false;
        }

        if (isTradePositionLong && longPositionDataTPSL) {
            if (!isCurrentPriceMatchRangeLong) {
                handleModalAndNotification()
            }
        }

        if (isTradePositionShort && shortPositionDataTPSL) {
            if (!isCurrentPriceMatchRangeShort) {
                handleModalAndNotification()
            }
        }

        return true
    }

    //@TODO need to work on the tp_sl part
    const confirm = () => {
        if (currentPriceMatchRangeChecking()) {
            const positionType = trade_position_process === "Buy" ? "long" : "short"
            const id = uuidv4()

            const notAvailable = () => {
                showNotification("Not available yet", "info", 0)
            }

            const Mmrclose = () => <button onClick={notAvailable}>+ Add</button>

            const ReversePosition = () => <button onClick={notAvailable}>Reverse</button>

            const TrailingStop = () => <button onClick={notAvailable}>+ Add</button>

            const TPSL = () => {
                const tradPosition = trade_position_process === "Buy" ? TRADE_POSITION.LONG : TRADE_POSITION.SHORT
                const isTPSL = !!confirmedShortPositionDataTPSL || !!confirmedLongPositionDataTPSL

                let currentTPSL = null

                const openTPSLModal = () => {
                    setCurrentModal(MODALS.TP_SL)
                    setDataForModalTPSL({orderValue: order_value_usdt, tradePosition: tradPosition})
                }

                if (tradPosition === TRADE_POSITION.LONG) {
                    currentTPSL = confirmedLongPositionDataTPSL
                }

                if (tradPosition === TRADE_POSITION.SHORT) {
                    currentTPSL = confirmedShortPositionDataTPSL
                }

                //@TODO will continue tomorrow
                return (
                    <React.Fragment>
                        {isTPSL ?<div>3512<span></span>/<span>2154</span> <button><Edit/></button></div>
                            : <button onClick={() => openTPSLModal()}>+ Add</button>}
                    </React.Fragment>
                )
            }

            const ClosedBy = () => (
                <div>
                    <button onClick={notAvailable}>Limit</button>
                    &nbsp;
                    <button onClick={notAvailable}>Market</button>
                </div>
            )

            const gropedData = {
                id,
                leverage: adjustLeverage,
                contracts: <ContractItem positionType={positionType} cryptoType={cryptoType} marginMode={marginMode} leverage={adjustLeverage}/>,
                quantity: <QuantityItem positionType={positionType} value={calculatedQuantity}/>,
                value: order_value_usdt,
                entry_price: currentPrice,
                mark_price: currentPrice,
                liquidity_price: calculatedLiquidity ? calculatedLiquidity : "--",
                im: calculationIM(order_value_usdt, adjustLeverage),
                mm: calculationMM(adjustLeverage, 0.55, order_value_usdt),
                unrealized_pl: <UnrealizedItem profit={0} percent={0} isIncrease={false}/>,
                realized_pl: -calculationRealizedPL(calculatedQuantity, currentPrice, 0.055),
                tp_sl: <TPSL/>,
                trailing_stop: <TrailingStop/>,
                mmr_close: <Mmrclose/>,
                reverse_position: <ReversePosition/>,
                close_by: <ClosedBy/>
            }

            if (trade_position_process === "Buy") {
                setConfirmedLongPositionData({
                    ...gropedData,
                    // tp_sl: longPositionData
                })
            } else {
                setConfirmedShortPositionData({
                    ...gropedData,
                    // tp_sl: shortPositionData
                })
            }

            if (longPositionDataTPSL) {
                setConfirmedLongPositionDataTPSL(longPositionDataTPSL)
                setLongPositionDataTPSL(null)
            }

            if (shortPositionDataTPSL) {
                setConfirmedShortPositionDataTPSL(shortPositionDataTPSL)
                setShortPositionDataTPSL(null)
            }

            setCurrentModal(MODALS.CLOSE)
            showNotification("Order submitted Successfully", "success", 0)
        }
    }

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