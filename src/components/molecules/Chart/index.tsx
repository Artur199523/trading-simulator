import React, {useEffect, useRef, useState, memo} from "react";
import {createChart} from "lightweight-charts";

import {useSimulatorOptionsContext, useSimulatorPlayerInfoContext, useSimulatorToolsContext, useSimulatorTradingChartDetailsContext} from "layouts/providers";
import {candleStickOptions, chartOptions, histogramApplyOptions, histogramOptions} from "./options";
import {getCryptoTradingHistory} from "store/simulator/actions";
import {multiply, plus, showNotification} from "utils";
import {useAppDispatch, useAppSelector} from "store";

import {HistoryItem, TradingVolumeITF} from "store/simulator/type";
import {StopOrderITF} from "layouts/providers/type";

import "./style.scss"

const Chart: React.FC = () => {
    const dispatch = useAppDispatch()

    const {currency, interval, cryptoType, date} = useSimulatorOptionsContext()
    const {isPlay, next, currentSpeed, setNext} = useSimulatorToolsContext()
    const {setBalanceTradeableCrypto, setBalanceUSDT} = useSimulatorPlayerInfoContext()
    const {
        stopLimitOrdersMarks,
        stopLimitPreOrders,
        currentCryptoData,
        marketOrdersMarks,
        limitOrdersMarks,
        stopLimitOrders,
        limitOrders,
        setStopLimitOrdersMarks,
        setStopLimitPreOrders,
        setCurrentCryptoData,
        setLimitOrdersMarks,
        setStopLimitOrders,
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

        const stopLimitInActivePreOrders = stopLimitPreOrders.filter(order => !order.isActive)

        if (currentCryptoData && currentCryptoData.close && stopLimitInActivePreOrders.length) {
            setStopLimitPreOrders(prev => {
                return prev.filter(order => !order.isActive).map(order => {
                    const {
                        limit_price,
                        stop_price,
                        influence,
                        side,
                        order_id,
                        quantity
                    } = order

                    const isBuySide = side === "Buy"
                    const prepareOrderForStorage = (order: StopOrderITF, isFilled?: boolean) => {
                        order.isActive = true

                        const activeStopLimitOrder = JSON.parse(JSON.stringify(order))

                        delete activeStopLimitOrder.isActive
                        delete activeStopLimitOrder.fee

                        if (isFilled) {
                            activeStopLimitOrder.status = FILLED_STATUS
                        }

                        setStopLimitOrders(prev => [...prev, activeStopLimitOrder])
                    }

                    if ((influence === "up" && stop_price <= currentCryptoData.close && currentCryptoData.close <= limit_price) ||
                        (influence === "down" && stop_price >= currentCryptoData.close && currentCryptoData.close >= limit_price)) {
                        prepareOrderForStorage(order)

                        showNotification(`Order ST${order_id} placed (${side}:Limit)`, "info", 0)
                    }

                    if ((influence === "up" && stop_price <= currentCryptoData.close && stop_price >= limit_price) ||
                        (influence === "down" && stop_price >= currentCryptoData.close && stop_price <= limit_price)) {

                        if (isBuySide) {
                            setBalanceTradeableCrypto(prev => plus(prev, quantity))
                        } else {
                            setBalanceUSDT(prev => plus(prev, multiply(quantity, stop_price)))
                        }

                        showNotification(`Order ST${order_id} placed (${side}:Limit)`, "info", 500)

                        showNotification(`Order ST${order_id} executed (${side}:Limit)`, "info", 1000)

                        setStopLimitOrdersMarks(prev => [...prev, {
                            time: Number(currentCryptoData.time),
                            position: isBuySide ? "aboveBar" : "belowBar",
                            color: isBuySide ? "green" : "red",
                            shape: isBuySide ? "arrowUp" : "arrowDown",
                            size: 1.5,
                            id: `stop_limit_${order_id}`,
                            text: `${isBuySide ? "BUY" : "SELL"} @ ${multiply(quantity, limit_price).toFixed(2)}`,
                        }])

                        prepareOrderForStorage(order, true)
                    }

                    return order
                })
            })
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentCryptoData?.close]);

    useEffect(() => {
        const WORKING_STATUS = "Working";
        const FILLED_STATUS = "Filled";

        const stopLimitOrdersWorking = stopLimitOrders.filter(order => order.status === WORKING_STATUS)

        if (currentCryptoData && currentCryptoData.close && stopLimitOrdersWorking.length) {
            setStopLimitOrders(prev => {
                return prev.map(order => {
                    const {order_id, side, quantity, limit_price, influence, status} = order
                    const isBuySide = side === "Buy"

                    if (status === WORKING_STATUS
                        && (influence === "up" && limit_price <= currentCryptoData.close)
                        || (influence === "down" && limit_price >= currentCryptoData.close)) {

                        order.status = FILLED_STATUS

                        if (isBuySide) {
                            setBalanceTradeableCrypto(prev => plus(prev, quantity))
                        } else {
                            setBalanceUSDT(prev => plus(prev, multiply(quantity, limit_price)))
                        }

                        showNotification(`Order ST${order_id} executed (${side}:Limit)`, "info", 1000)

                        setStopLimitOrdersMarks(prev => [...prev, {
                            time: Number(currentCryptoData.time),
                            position: isBuySide ? "aboveBar" : "belowBar",
                            color: isBuySide ? "green" : "red",
                            shape: isBuySide ? "arrowUp" : "arrowDown",
                            size: 1.5,
                            id: `stop_limit_${order_id}`,
                            text: `${isBuySide ? "BUY" : "SELL"} @ ${multiply(quantity, limit_price).toFixed(2)}`,
                        }])
                    }

                    return order
                })
            })
        }

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentCryptoData?.close])

    return (
        <div className="chart">
            <div ref={chartContainerRef}/>
        </div>
    )
}

export default memo(Chart)