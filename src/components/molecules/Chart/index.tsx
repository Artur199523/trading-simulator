import React, {useEffect, useRef, useState, memo} from "react";
import {createChart} from "lightweight-charts";
import {v4 as uuidv4} from 'uuid'

import {useSimulatorOptionsContext, useSimulatorPlayerInfoContext, useSimulatorToolsContext, useSimulatorTradingChartDetailsContext} from "layouts/providers";
import {
    INFO,
    EXIST_TYPE,
    TRADE_TYPE,
    ORDER_STATUS,
    TRADE_POSITION,
    TRIGGER_PRICE_TYPE,
    plus,
    multiply,
    fixedNumber,
    showNotification,
    calculationChange,
    calculateProfitPriceByTrigger,
} from "utils";
import {candleStickOptions, chartOptions, histogramApplyOptions, histogramOptions} from "./options";
import {getCryptoTradingHistory} from "store/simulator/actions";
import {useAppDispatch, useAppSelector} from "store";

import UnrealizedItem from "../RightBar/Futures/Components/UnrealizedItem";

import {ConfirmedPositionData, OrderHistoryLimitMarketITF, OrderHistoryTPSLITF, ProfitLossHistoryITF, TradeHistoryITF} from "layouts/providers/type";
import {HistoryItem, TradingVolumeITF} from "store/simulator/type";

import "./style.scss"

const Chart: React.FC = () => {
    const dispatch = useAppDispatch()

    const {currency, interval, cryptoType, date} = useSimulatorOptionsContext()
    const {isPlay, next, currentSpeed, setNext} = useSimulatorToolsContext()
    const {setBalanceTradeableCrypto, setBalanceUSDT} = useSimulatorPlayerInfoContext()
    const {
        confirmedShortPositionDataTPSL,
        confirmedLongPositionDataTPSL,
        confirmedShortPositionData,
        confirmedLongPositionData,
        stopLimitOrdersMarks,
        currentOrdersTPSL,
        currentCryptoData,
        marketOrdersMarks,
        limitOrdersMarks,
        stopLimitOrders,
        limitOrders,
        setConfirmedShortPositionDataTPSL,
        setConfirmedLongPositionDataTPSL,
        setConfirmedShortPositionData,
        setConfirmedLongPositionData,
        setOrderHistoryLimitMarket,
        setStopLimitOrdersMarks,
        setStopLimitPreOrders,
        setCurrentCryptoData,
        setProfitLossHistory,
        setCurrentOrdersTPSL,
        setLimitOrdersMarks,
        serOrderHistoryTPSL,
        setStopLimitOrders,
        setMarketOrders,
        setTradeHistory,
        setLimitOrders,
    } = useSimulatorTradingChartDetailsContext()

    const [newSeries, setNewSeries] = useState<any>(null)
    const [newVolumeSeries, setNewVolumeSeries] = useState<any>(null)

    const [history, setHistory] = useState<[]>([])
    const [volume, setVolume] = useState<[]>([])

    const {data: partHistory} = useAppSelector(state => state.simulator.tradingHistoryPartData)
    const {data: allHistory, success} = useAppSelector(state => state.simulator.tradingHistoryAllData)

    const {data: allVolumeHistory} = useAppSelector(state => state.simulator.tradingHistoryVolumeAllData)
    const {data: partVolumeHistory} = useAppSelector(state => state.simulator.tradingHistoryVolumePartData)

    const chartContainerRef: any = useRef();
    const timeOut = 1000 / currentSpeed

    useEffect(() => {
        dispatch(getCryptoTradingHistory({
            timeInterval: interval,
            timeTo: date,
            currencyType: currency,
            cryptoType: cryptoType
        }))
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [dispatch])

    useEffect(() => {
        if (allHistory && allVolumeHistory) {
            setHistory(JSON.parse(JSON.stringify(allHistory)))
            setVolume(JSON.parse(JSON.stringify(allVolumeHistory)))
        }
    }, [allHistory, allVolumeHistory]);

    useEffect(() => {
        const chartRef = chartContainerRef.current
        if (partHistory && partVolumeHistory && chartRef && chartContainerRef.current) {
            const handleResize = () => {
                chart.applyOptions({width: chartContainerRef.current.clientWidth});
            };

            const chart = createChart(chartContainerRef.current, chartOptions(chartRef));
            chart.timeScale().fitContent();

            const newSeries = chart.addCandlestickSeries(candleStickOptions as any);
            const volumeSeries = chart.addHistogramSeries(histogramOptions as any);

            newSeries.setData(partHistory);
            volumeSeries.setData(partVolumeHistory);

            setCurrentCryptoData(partHistory[partHistory.length - 1])

            volumeSeries.priceScale().applyOptions(histogramApplyOptions);

            setNewSeries(newSeries as any)
            setNewVolumeSeries(volumeSeries as any)

            window.addEventListener('resize', handleResize);

            return () => {
                window.removeEventListener('resize', handleResize);

                chart.remove();
            };
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [partHistory, partVolumeHistory]);

    useEffect(() => {
        let int: any
        if (newSeries && newVolumeSeries && isPlay && history && volume) {
            clearInterval(int)
            int = setInterval(() => {
                if (success) {
                    const d: HistoryItem = history.splice(0, 1)[0];
                    const v: TradingVolumeITF = volume.splice(0, 1)[0]

                    setCurrentCryptoData(d)

                    newSeries.update(d);
                    newVolumeSeries.update(v)
                } else {
                    clearInterval(int);
                }
            }, timeOut);
        }

        if (!isPlay) {
            clearInterval(int)
        }

        return () => {
            clearInterval(int)
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [newSeries, isPlay, newVolumeSeries, currentSpeed, history, volume])

    useEffect(() => {
        if (next && history && newSeries) {
            let myInterval: any
            let count = 0;

            myInterval = setInterval(function () {
                const d: HistoryItem = history.splice(0, 1)[0];
                const v: TradingVolumeITF = volume.splice(0, 1)[0]

                setCurrentCryptoData(d)

                newSeries.update(d);
                newVolumeSeries.update(v)
                count++;
                if (count === currentSpeed) {
                    setNext(false)
                    clearInterval(myInterval);
                }
            }, timeOut);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [next])

    useEffect(() => {
        if (marketOrdersMarks.length) {
            newSeries.setMarkers(marketOrdersMarks)
        }

        if (limitOrdersMarks.length) {
            newSeries.setMarkers([...marketOrdersMarks, ...limitOrdersMarks])
        }

        if (stopLimitOrdersMarks.length) {
            newSeries.setMarkers([...marketOrdersMarks, ...limitOrdersMarks, ...stopLimitOrdersMarks])
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [marketOrdersMarks, limitOrdersMarks, stopLimitOrdersMarks]);

    useEffect(() => {
        //===============SPOT===============================
        const WORKING_STATUS = "Working";
        const FILLED_STATUS = "Filled";

        const limitOrdersWorking = limitOrders.filter(order => order.status === WORKING_STATUS)

        if (currentCryptoData && currentCryptoData.close && limitOrdersWorking) {
            setLimitOrders(prev => {
                return prev.map(order => {
                    if (currentCryptoData.close <= order.limit_price && order.status === WORKING_STATUS && order.side === "Buy") {
                        setBalanceTradeableCrypto(prev => plus(prev, order.quantity))

                        showNotification(`Order L${order.order_id} executed (BUY:Limit)`, "info", 0)

                        setLimitOrdersMarks(prev => [...prev, {
                            time: Number(currentCryptoData.time),
                            position: "aboveBar",
                            color: "green",
                            shape: 'arrowUp',
                            size: 1.5,
                            id: `limit_${order.order_id}`,
                            text: `BUY @ $${multiply(order.quantity, order.limit_price)}`,
                        }])

                        return {...order, status: FILLED_STATUS}
                    }

                    if (currentCryptoData.close >= order.limit_price && order.status === WORKING_STATUS && order.side === "Sell") {
                        setBalanceUSDT(prev => plus(prev, order.quantity * order.limit_price))

                        showNotification(`Order L${order.order_id} executed (SELL:Limit)`, "info", 0)

                        setLimitOrdersMarks(prev => [...prev, {
                            time: Number(currentCryptoData.time),
                            position: "belowBar",
                            color: "red",
                            shape: 'arrowDown',
                            size: 1.5,
                            id: `limit_${order.order_id}`,
                            text: `SELL @ $${multiply(order.quantity, order.limit_price)}`,
                        }])

                        return {...order, status: FILLED_STATUS}
                    }

                    return order
                })
            })
        }

        const stopLimitInActivePreOrders = stopLimitOrders.filter(order => order.status === WORKING_STATUS)

        if (currentCryptoData && currentCryptoData.close && stopLimitInActivePreOrders.length) {
            const currentPrice = currentCryptoData.close

            setStopLimitOrders(prev => {
                return prev.map(order => {
                    const {
                        limit_price,
                        stop_price,
                        influence,
                        side,
                        order_id,
                        quantity,
                        status
                    } = order

                    if (influence === "up" && side === "Buy" && status === WORKING_STATUS && currentPrice > stop_price && stop_price < limit_price) {
                        const price = currentPrice < limit_price ? currentPrice : limit_price
                        const depositPriceForTrading = quantity * limit_price
                        const tradedPrice = quantity * price
                        const differencePriceAfterTrading = depositPriceForTrading - tradedPrice

                        order.total = tradedPrice
                        order.status = FILLED_STATUS

                        setStopLimitOrdersMarks(prev => [...prev, {
                            time: Number(currentCryptoData.time),
                            position: "aboveBar",
                            color: "green",
                            shape: "arrowUp",
                            size: 1.5,
                            id: `stop_limit_${order_id}`,
                            text: `BUY @ ${tradedPrice.toFixed(2)}`,
                        }])

                        setBalanceUSDT(prev => prev + differencePriceAfterTrading)
                        setBalanceTradeableCrypto(prev => prev + quantity)
                        showNotification(`Order ST${order_id} executed (${side}:Stop-Limit)`, "info", 0)
                    }

                    if (influence === "down" && side === "Sell" && status === WORKING_STATUS && currentPrice < stop_price && stop_price > limit_price) {
                        const price = currentPrice > limit_price ? currentPrice : limit_price
                        const tradedPrice = quantity * price

                        order.total = tradedPrice
                        order.status = FILLED_STATUS

                        setStopLimitOrdersMarks(prev => [...prev, {
                            time: Number(currentCryptoData.time),
                            position: "belowBar",
                            color: "red",
                            shape: "arrowDown",
                            size: 1.5,
                            id: `stop_limit_${order_id}`,
                            text: `SELL @ ${tradedPrice.toFixed(2)}`,
                        }])

                        setBalanceUSDT(prev => prev + tradedPrice)
                        showNotification(`Order ST${order_id} executed (${side}:Stop-Limit)`, "info", 0)
                    }
                    return order
                })
            })
        }

        setLimitOrders(prev => prev.map(order => ({...order, last: currentCryptoData.close})))
        setMarketOrders(prev => prev.map(order => ({...order, last: currentCryptoData.close})))
        setStopLimitOrders(prev => prev.map(order => ({...order, last: currentCryptoData.close})))
        setStopLimitPreOrders(prev => prev.map(order => ({...order, last: currentCryptoData.close})))

        //========================FUTURES====================
        trackChangesOfPositions()
        trackPositionLiquidity()
        trackOrderOfTPSL()

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentCryptoData?.close]);

    const trackChangesOfPositions = () => {
        if (confirmedLongPositionData) {
            // @ts-ignore
            setConfirmedLongPositionData((prev: ConfirmedPositionData) => {
                const {entry_price, leverage, value} = prev
                const profit = calculateProfitPriceByTrigger(currentCryptoData.close, entry_price, leverage, value)
                const percent = calculationChange(entry_price, currentCryptoData.close)

                return {
                    ...prev,
                    percent,
                    profit,
                    mark_price: currentCryptoData.close,
                    unrealized_pl: <UnrealizedItem profit={profit} percent={percent} isIncrease={entry_price < currentCryptoData.close}/>
                }
            })
        }

        if (confirmedShortPositionData) {
            // @ts-ignore
            setConfirmedShortPositionData((prev: ConfirmedPositionData) => {
                const {entry_price, leverage, value} = prev
                const profit = calculateProfitPriceByTrigger(currentCryptoData.close, entry_price, leverage, value)
                const percent = calculationChange(entry_price, currentCryptoData.close)

                return {
                    ...prev,
                    percent: percent ? -percent : +percent,
                    profit: profit ? -profit : +profit,
                    mark_price: currentCryptoData.close,
                    unrealized_pl: <UnrealizedItem
                        profit={profit ? -profit : +profit}
                        percent={percent ? -percent : +percent}
                        isIncrease={entry_price > currentCryptoData.close}
                    />
                }
            })
        }
    }

    const trackOrderOfTPSL = () => {
        if (confirmedLongPositionDataTPSL) {
            const {stop_trigger_price, profit_trigger_price} = confirmedLongPositionDataTPSL
            const {calculated_quantity, entry_price, leverage, value, realized_pl, im} = confirmedLongPositionData
            const {color, order_No, contracts, trade_type, trigger_price, quantity_value, order_price} = currentOrdersTPSL[0]

            if ((Number(profit_trigger_price) && currentCryptoData.close > Number(profit_trigger_price)) || (Number(stop_trigger_price) && currentCryptoData.close < Number(stop_trigger_price))) {
                const triggerType = (Number(profit_trigger_price) && currentCryptoData.close > Number(profit_trigger_price)) ? TRIGGER_PRICE_TYPE.PROFIT : TRIGGER_PRICE_TYPE.STOP
                const currentTriggerPrice = triggerType === TRIGGER_PRICE_TYPE.PROFIT ? profit_trigger_price : stop_trigger_price
                const profit = calculateProfitPriceByTrigger(currentTriggerPrice, entry_price, leverage, value)

                const orderHistory: OrderHistoryLimitMarketITF = {
                    contracts: `${cryptoType}USDT`,
                    filled_total: {filled: calculated_quantity, total: calculated_quantity},
                    filled_price_order_price: {filled_price: Number(currentTriggerPrice), order_price: "Market"},
                    trade_type: TRADE_TYPE.CLOSE_LONG,
                    order_type: "Market",
                    status: ORDER_STATUS.FILLED,
                    order_No: uuidv4().split("-")[0],
                    order_time: new Date(),
                    color: "red",
                }

                const tradeHistory: TradeHistoryITF = {
                    contracts: `${cryptoType}USDT`,
                    filled_total: {filled: calculated_quantity, total: calculated_quantity},
                    filled_price_order_price: {filled_price: Number(currentTriggerPrice), order_price: "Market"},
                    trade_type: TRADE_TYPE.CLOSE_LONG,
                    order_type: "Market",
                    filled_type: EXIST_TYPE.TRADE,
                    transaction_id: uuidv4().split("-")[0],
                    transaction_time: new Date(),
                    color: "red",
                }

                const profitLossHistory: ProfitLossHistoryITF = {
                    contracts: `${cryptoType}USDT`,
                    quantity: calculated_quantity,
                    entry_price,
                    exit_price: Number(currentTriggerPrice),
                    trade_type: TRADE_TYPE.CLOSE_LONG,
                    closed_pl: profit + realized_pl,
                    exit_type: EXIST_TYPE.TRADE,
                    trade_time: new Date(),
                    color: "red",
                }

                const orderHistoryTPSLITF: OrderHistoryTPSLITF = {
                    color: color,
                    order_No: order_No,
                    contracts: contracts,
                    trade_type: trade_type,
                    order_time: new Date(),
                    status: ORDER_STATUS.FILLED,
                    trigger_price: triggerType === TRIGGER_PRICE_TYPE.PROFIT ? trigger_price.tp : trigger_price.sl,
                    trigger_price_type: triggerType,
                    filled_actual_qty: {filled: fixedNumber(quantity_value, 2) as number, actual_qty: Number(quantity_value)},
                    filled_price_order_price: {filled_price: currentTriggerPrice, order_price: order_price}
                }

                setOrderHistoryLimitMarket(prev => [orderHistory, ...prev])
                serOrderHistoryTPSL(prev => [orderHistoryTPSLITF, ...prev])
                setProfitLossHistory(prev => [profitLossHistory, ...prev])
                setBalanceUSDT(prev => prev + im + (profit + realized_pl))
                setTradeHistory(prev => [tradeHistory, ...prev])
                setCurrentOrdersTPSL(prev => prev = [])
                setConfirmedLongPositionData(null)
                setConfirmedLongPositionDataTPSL(null)
            }
        }

        if (confirmedShortPositionDataTPSL) {
            const {stop_trigger_price, profit_trigger_price} = confirmedShortPositionDataTPSL
            const {calculated_quantity, entry_price, leverage, value, realized_pl, im} = confirmedShortPositionData
            const {color, order_No, contracts, trade_type, trigger_price, quantity_value, order_price} = currentOrdersTPSL[0]

            const isProfitTriggerPriceWorking = Number(profit_trigger_price) && currentCryptoData.close < Number(profit_trigger_price)
            const isStopTriggerPriceWorking = Number(stop_trigger_price) && currentCryptoData.close > Number(stop_trigger_price)

            if (isProfitTriggerPriceWorking || isStopTriggerPriceWorking) {
                const triggerType = isProfitTriggerPriceWorking ? TRIGGER_PRICE_TYPE.PROFIT : TRIGGER_PRICE_TYPE.STOP
                const currentTriggerPrice = triggerType === TRIGGER_PRICE_TYPE.PROFIT ? profit_trigger_price : stop_trigger_price
                const profit = calculateProfitPriceByTrigger(currentTriggerPrice, entry_price, leverage, value)

                const orderHistory: OrderHistoryLimitMarketITF = {
                    contracts: `${cryptoType}USDT`,
                    filled_total: {filled: calculated_quantity, total: calculated_quantity},
                    filled_price_order_price: {filled_price: Number(currentTriggerPrice), order_price: "Market"},
                    trade_type: TRADE_TYPE.CLOSE_SHORT,
                    order_type: "Market",
                    status: ORDER_STATUS.FILLED,
                    order_No: uuidv4().split("-")[0],
                    order_time: new Date(),
                    color: "green",
                }

                const tradeHistory: TradeHistoryITF = {
                    contracts: `${cryptoType}USDT`,
                    filled_total: {filled: calculated_quantity, total: calculated_quantity},
                    filled_price_order_price: {filled_price: Number(currentTriggerPrice), order_price: "Market"},
                    trade_type: TRADE_TYPE.CLOSE_SHORT,
                    order_type: "Market",
                    filled_type: EXIST_TYPE.TRADE,
                    transaction_id: uuidv4().split("-")[0],
                    transaction_time: new Date(),
                    color: "green",
                }

                const profitLossHistory: ProfitLossHistoryITF = {
                    contracts: `${cryptoType}USDT`,
                    quantity: calculated_quantity,
                    entry_price,
                    exit_price: Number(currentTriggerPrice),
                    trade_type: TRADE_TYPE.CLOSE_SHORT,
                    closed_pl: Number(((profit ? -profit : +profit) + realized_pl).toFixed(2)),
                    exit_type: EXIST_TYPE.TRADE,
                    trade_time: new Date(),
                    color: "green",
                }

                const orderHistoryTPSLITF: OrderHistoryTPSLITF = {
                    color: color,
                    order_No: order_No,
                    contracts: contracts,
                    trade_type: trade_type,
                    order_time: new Date(),
                    status: ORDER_STATUS.FILLED,
                    trigger_price: triggerType === TRIGGER_PRICE_TYPE.PROFIT ? trigger_price.tp : trigger_price.sl,
                    trigger_price_type: triggerType,
                    filled_actual_qty: {filled: fixedNumber(quantity_value, 2) as number, actual_qty: Number(quantity_value)},
                    filled_price_order_price: {filled_price: currentTriggerPrice, order_price: order_price}
                }

                setOrderHistoryLimitMarket(prev => [orderHistory, ...prev])
                serOrderHistoryTPSL(prev => [orderHistoryTPSLITF, ...prev])
                setProfitLossHistory(prev => [profitLossHistory, ...prev])
                setBalanceUSDT(prev => prev + im + ((profit ? -profit : +profit) + realized_pl))
                setTradeHistory(prev => [tradeHistory, ...prev])
                setCurrentOrdersTPSL(prev => prev = [])
                setConfirmedShortPositionData(null)
                setConfirmedShortPositionDataTPSL(null)
            }
        }
    }

    const trackPositionLiquidity = () => {
        const isLongPositionTrackWorking = confirmedLongPositionData && confirmedLongPositionData.liquidity_price && confirmedLongPositionData.liquidity_price > currentCryptoData.close
        const isShortPositionTrackWorking = confirmedShortPositionData && confirmedShortPositionData.liquidity_price && confirmedShortPositionData.liquidity_price < currentCryptoData.close

        if (isLongPositionTrackWorking || isShortPositionTrackWorking) {
            const currentPositionData = confirmedLongPositionData ? confirmedLongPositionData : confirmedShortPositionData
            const currentPosition = confirmedLongPositionData ? TRADE_POSITION.LONG : TRADE_POSITION.SHORT
            const {calculated_quantity, im, entry_price, position, liquidity_price} = currentPositionData

            let orderHistory: OrderHistoryLimitMarketITF = {
                contracts: `${cryptoType}USDT`,
                filled_total: {filled: calculated_quantity, total: calculated_quantity},
                filled_price_order_price: {filled_price: Number(liquidity_price), order_price: "Market"},
                trade_type: currentPosition === TRADE_POSITION.LONG ? TRADE_TYPE.CLOSE_LONG : TRADE_TYPE.CLOSE_SHORT,
                order_type: "Market",
                status: ORDER_STATUS.FILLED,
                order_No: uuidv4().split("-")[0],
                order_time: new Date(),
                color: currentPosition === TRADE_POSITION.LONG ? "red" : "green",
            }

            let tradeHistory: TradeHistoryITF = {
                contracts: `${cryptoType}USDT`,
                filled_total: {filled: calculated_quantity, total: calculated_quantity},
                filled_price_order_price: {filled_price: Number(liquidity_price), order_price: "Market"},
                trade_type: currentPosition === TRADE_POSITION.LONG ? TRADE_TYPE.CLOSE_LONG : TRADE_TYPE.CLOSE_SHORT,
                order_type: "Market",
                filled_type: EXIST_TYPE.TRADE,
                transaction_id: uuidv4().split("-")[0],
                transaction_time: new Date(),
                color: currentPosition === TRADE_POSITION.LONG ? "red" : "green",
            }

            let profitLossHistory: ProfitLossHistoryITF = {
                contracts: `${cryptoType}USDT`,
                quantity: calculated_quantity,
                entry_price,
                exit_price: Number(liquidity_price),
                trade_type: position === TRADE_POSITION.LONG ? TRADE_TYPE.CLOSE_LONG : TRADE_TYPE.CLOSE_SHORT,
                closed_pl: -im,
                exit_type: EXIST_TYPE.TRADE,
                trade_time: new Date(),
                color: position === TRADE_POSITION.LONG ? "red" : "green",
            }

            setOrderHistoryLimitMarket(prev => [orderHistory, ...prev])
            setProfitLossHistory(prev => [profitLossHistory, ...prev])
            setTradeHistory(prev => [tradeHistory, ...prev])

            if (currentPosition === TRADE_POSITION.LONG) {
                setConfirmedLongPositionData(null)
                setConfirmedLongPositionDataTPSL(null)
            } else {
                setConfirmedShortPositionData(null)
                setConfirmedShortPositionDataTPSL(null)
            }

            showNotification(INFO.LIQUIDITY_EXCEED, "success", 0)
        }
    }

    return (
        <div className="chart">
            <div ref={chartContainerRef}/>
        </div>
    )
}

export default memo(Chart)