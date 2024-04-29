import React, {useEffect, useRef, useState, memo} from "react";
import {createChart} from "lightweight-charts";

import {useSimulatorOptionsContext, useSimulatorPlayerInfoContext, useSimulatorToolsContext, useSimulatorTradingChartDetailsContext} from "layouts/providers";
import {multiply, plus, showNotification, calculateProfitPriceByTrigger, calculationChange} from "utils";
import {candleStickOptions, chartOptions, histogramApplyOptions, histogramOptions} from "./options";
import {getCryptoTradingHistory} from "store/simulator/actions";
import {useAppDispatch, useAppSelector} from "store";

import UnrealizedItem from "../RightBar/Futures/Components/UnrealizedItem";

import {HistoryItem, TradingVolumeITF} from "store/simulator/type";

import "./style.scss"
import {ConfirmedPositionData} from "../../../layouts/providers/type";

const Chart: React.FC = () => {
    const dispatch = useAppDispatch()

    const {currency, interval, cryptoType, date} = useSimulatorOptionsContext()
    const {isPlay, next, currentSpeed, setNext} = useSimulatorToolsContext()
    const {setBalanceTradeableCrypto, setBalanceUSDT} = useSimulatorPlayerInfoContext()
    const {
        confirmedShortPositionData,
        confirmedLongPositionData,
        stopLimitOrdersMarks,
        currentCryptoData,
        marketOrdersMarks,
        limitOrdersMarks,
        stopLimitOrders,
        limitOrders,
        setConfirmedLongPositionData,
        setConfirmedShortPositionData,
        setStopLimitOrdersMarks,
        setStopLimitPreOrders,
        setCurrentCryptoData,
        setLimitOrdersMarks,
        setStopLimitOrders,
        setMarketOrders,
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

    return (
        <div className="chart">
            <div ref={chartContainerRef}/>
        </div>
    )
}

export default memo(Chart)