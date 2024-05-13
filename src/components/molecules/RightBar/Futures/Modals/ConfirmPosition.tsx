import React, {useEffect} from "react";
import classNames from "classnames";
import {v4 as uuidv4} from 'uuid';

import {
    useSimulatorToolsContext,
    useSimulatorOptionsContext,
    useSimulatorTradingContext,
    useFuturesTradingModalContext,
    useSimulatorPlayerInfoContext,
    useSimulatorTradingChartDetailsContext
} from "layouts/providers";
import {
    MODALS,
    EXIST_TYPE,
    TRADE_TYPE,
    ORDER_STATUS,
    TRADE_POSITION,
    plus,
    minus,
    divide,
    multiply,
    fixedNumber,
    calculationIM,
    calculationMM,
    interruptionRef,
    showNotification,
    calculationLiquidity,
    calculationRealizedPL,
    calculationOrderCostLongPosition,
    calculationOrderCostShortPosition,
} from "utils";

import OrderReversePosition from "../Components/OrderReversePosition";
import OrderTrailingStop from "../Components/OrderTrailingStop";
import UnrealizedItem from "../Components/UnrealizedItem";
import OrderMmrClose from "../Components/OrderMmrClose";
import OrderClosedBy from "../Components/OrderClosedBy";
import QuantityItem from "../Components/QuantityItem";
import ContractItem from "../Components/ContractItem";
import OrderTPSL from "../Components/OrderTPSL";
import {ModalWindowTemplate} from "components";

import {ConfirmPositionDataForModalWithTPSLITF, ConfirmPositionFiledItemITF, ItemTPSLITF} from "../type";
import {OrderHistoryLimitMarketITF, TradeHistoryITF} from "layouts/providers/type";

import "./style.scss"

const ConfirmPosition: React.FC = () => {
    const {cryptoType} = useSimulatorOptionsContext()
    const {currentCryptoData} = useSimulatorTradingChartDetailsContext()
    const {marginMode, adjustLeverage} = useSimulatorTradingContext()
    const {
        longPositionDataTPSL,
        shortPositionDataTPSL,
        confirmedLongPositionData,
        confirmedShortPositionData,
        confirmedLongPositionDataHistory,
        confirmedShortPositionDataHistory,
        setTradeHistory,
        setLongPositionDataTPSL,
        setShortPositionDataTPSL,
        setOrderHistoryLimitMarket,
        setConfirmedLongPositionData,
        setConfirmedShortPositionData,
        setConfirmedLongPositionDataTPSL,
        setConfirmedShortPositionDataTPSL,
        setConfirmedLongPositionDataHistory,
        setConfirmedShortPositionDataHistory,
    } = useSimulatorTradingChartDetailsContext()
    const {setBalanceUSDT} = useSimulatorPlayerInfoContext()
    const {setCurrentSpeed, setIsPlay} = useSimulatorToolsContext()
    const {setCurrentModal, dataForModal} = useFuturesTradingModalContext<ConfirmPositionDataForModalWithTPSLITF>()

    const {trade_position_process, trade_type, order_value_usdt, profit_trigger_price, stop_trigger_price, trade_position} = dataForModal
    const {close: currentPrice} = currentCryptoData

    useEffect(() => {
        setIsPlay(true)
        setCurrentSpeed(1)
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const getDisplayOrDash = (value: any) => {
        return value !== undefined && value !== null && value !== '' ? value : '--';
    };

    const calculationLiquidityUtils = (totalValue: number) => {
        const orderTotalValue = order_value_usdt + totalValue
        const calculatedIM = calculationIM(orderTotalValue, adjustLeverage)

        //with calculationIM will be calculated liquidity based on the entry position
        return fixedNumber(calculationLiquidity(currentPrice, calculatedIM, orderTotalValue, trade_position), 2)
    }

    const confirmedPositionDataHistory = [...confirmedShortPositionDataHistory, ...confirmedLongPositionDataHistory]
    const totalValue = confirmedPositionDataHistory.length ? confirmedPositionDataHistory.reduce((a, b) => (a + b.value), 0) : 0
    const calculatedLiquidity = calculationLiquidityUtils(totalValue)
    const calculatedQuantity = Number((order_value_usdt / currentCryptoData.close).toFixed(2))

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

    const convertCurrentPositionData = (gropedData: any, confirmedPositionDataHistory: any, positionType: TRADE_POSITION) => {
        const data = interruptionRef(confirmedPositionDataHistory) as []

        let convertedData = data.reduce((initialState: any, currentValue: any) => {
            initialState.im += currentValue.im
            initialState.mm += currentValue.mm
            initialState.value += currentValue.value
            initialState.realized_pl += currentValue.realized_pl
            initialState.calculated_quantity += Number(currentValue.calculated_quantity)
            initialState.total_session_value += multiply(currentValue.entry_price, currentValue.calculated_quantity)

            return initialState
        }, {value: 0, calculated_quantity: 0, im: 0, mm: 0, realized_pl: 0, total_session_value: 0})

        const totalSessionValue = plus(multiply(gropedData.entry_price, gropedData.calculated_quantity), convertedData.total_session_value)
        const totalIM = plus(gropedData.im, convertedData.im)
        const totalMM = plus(gropedData.mm, convertedData.mm)
        const totalValue = plus(gropedData.value, convertedData.value)
        const totalRealizedPl = plus(gropedData.realized_pl, convertedData.realized_pl)
        const totalQuantity = plus(gropedData.calculated_quantity, convertedData.calculated_quantity)
        const averageEntryPrice = Number(divide(totalSessionValue, totalQuantity).toFixed(2))

        gropedData = {
            ...gropedData,
            im: totalIM,
            mm: totalMM,
            value: totalValue,
            realized_pl: totalRealizedPl,
            calculated_quantity: totalQuantity,
            entry_price: averageEntryPrice,
            quantity: <QuantityItem positionType={positionType} value={totalQuantity.toFixed(2)}/>,
        }

        return gropedData
    }

    const saveTradeHistory = (positionType: TRADE_POSITION) => {

        let orderHistory: OrderHistoryLimitMarketITF = {
            contracts: `${cryptoType}USDT`,
            filled_total: {filled: calculatedQuantity, total: calculatedQuantity},
            filled_price_order_price: {filled_price: currentPrice, order_price: "Market"},
            trade_type: positionType === TRADE_POSITION.LONG ? TRADE_TYPE.OPEN_LONG : TRADE_TYPE.OPEN_SHORT,
            order_type: "Market",
            status: ORDER_STATUS.FILLED,
            order_No: uuidv4().split("-")[0],
            order_time: new Date(),
            color: positionType === TRADE_POSITION.LONG ? "green" : "red",
        }

        let tradeHistory: TradeHistoryITF = {
            contracts: `${cryptoType}USDT`,
            filled_total: {filled: calculatedQuantity, total: calculatedQuantity},
            filled_price_order_price: {filled_price: currentPrice, order_price: "Market"},
            trade_type: positionType === TRADE_POSITION.LONG ? TRADE_TYPE.OPEN_LONG : TRADE_TYPE.OPEN_SHORT,
            order_type: "Market",
            filled_type: EXIST_TYPE.TRADE,
            transaction_id: uuidv4().split("-")[0],
            transaction_time: new Date(),
            color: positionType === TRADE_POSITION.LONG ? "green" : "red",
        }

        setOrderHistoryLimitMarket(prev => [orderHistory, ...prev])
        setTradeHistory(prev => [tradeHistory, ...prev])
    }

    const confirm = () => {
        if (currentPriceMatchRangeChecking()) {
            const positionType = trade_position_process === "Buy" ? TRADE_POSITION.LONG : TRADE_POSITION.SHORT
            const id = uuidv4()

            let gropedData = {
                id,
                tp_sl: <OrderTPSL/>,
                position: positionType,
                value: order_value_usdt,
                leverage: adjustLeverage,
                mark_price: currentPrice,
                entry_price: currentPrice,
                mmr_close: <OrderMmrClose/>,
                trailing_stop: <OrderTrailingStop/>,
                order_cost: Number(parseInt(orderCost)),
                calculated_quantity: calculatedQuantity,
                reverse_position: <OrderReversePosition/>,
                im: calculationIM(order_value_usdt, adjustLeverage),
                close_by: <OrderClosedBy positionType={positionType}/>,
                mm: calculationMM(adjustLeverage, 0.55, order_value_usdt),
                liquidity_price: calculatedLiquidity ? calculatedLiquidity : 0,
                unrealized_pl: <UnrealizedItem profit={0} percent={0} isIncrease={false}/>,
                quantity: <QuantityItem positionType={positionType} value={calculatedQuantity}/>,
                realized_pl: -calculationRealizedPL(calculatedQuantity, currentPrice, 0.055),
                contracts: <ContractItem positionType={positionType} cryptoType={cryptoType} marginMode={marginMode} leverage={adjustLeverage}/>
            }

            saveTradeHistory(positionType)

            if (trade_position_process === "Buy") {
                if (!confirmedLongPositionData) {
                    setConfirmedLongPositionData({
                        ...gropedData,
                    })

                    setBalanceUSDT(prev => minus(prev, Number(parseInt(orderCost))))
                    setConfirmedLongPositionDataHistory(prev => [...prev, gropedData])
                } else {
                    setBalanceUSDT(prev => minus(prev, Number(parseInt(orderCost))))
                    setConfirmedLongPositionDataHistory(prev => [...prev, gropedData])

                    const convertedData = convertCurrentPositionData(gropedData, confirmedLongPositionDataHistory, positionType)

                    setConfirmedLongPositionData({
                        ...convertedData,
                    })
                }
            } else {
                if (!confirmedShortPositionData) {
                    setConfirmedShortPositionData({
                        ...gropedData,
                    })

                    setBalanceUSDT(prev => minus(prev, Number(parseInt(orderCost))))
                    setConfirmedShortPositionDataHistory(prev => [...prev, gropedData])
                } else {
                    setBalanceUSDT(prev => minus(prev, Number(parseInt(orderCost))))
                    setConfirmedShortPositionDataHistory(prev => [...prev, gropedData])

                    const convertedData = convertCurrentPositionData(gropedData, confirmedShortPositionDataHistory, positionType)

                    setConfirmedShortPositionData({
                        ...convertedData
                    })
                }
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