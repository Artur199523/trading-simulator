import React, {useEffect, useRef, useState, memo} from "react";
import {createChart} from "lightweight-charts";

import {useSimulatorOptionsContext, useSimulatorPlayerInfoContext, useSimulatorToolsContext, useSimulatorTradingChartDetailsContext} from "layouts/providers";
import {candleStickOptions, chartOptions, histogramApplyOptions, histogramOptions} from "./options";
import {getCryptoTradingHistory} from "store/simulator/actions";
import {useAppDispatch, useAppSelector} from "store";
import {multiply, plus} from "utils";

import {HistoryItem, TradingVolumeITF} from "store/simulator/type";

import "./style.scss"

/**
 * Represents a chart component.
 * @function Chart
 * @returns {JSX.Element} - The rendered component.
 */
const Chart: React.FC = () => {
    const dispatch = useAppDispatch()

    const {currency, interval, cryptoType, date} = useSimulatorOptionsContext()
    const {isPlay, next, currentSpeed, setNext} = useSimulatorToolsContext()
    const {setBalanceTradeableCrypto, setBalanceUSDT} = useSimulatorPlayerInfoContext()
    const {
        setCurrentCryptoData,
        marketOrdersMarks,
        limitOrdersMarks,
        currentCryptoData,
        limitOrders,
        setLimitOrders,
        setLimitOrdersMarks
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
        if (marketOrdersMarks.length > 1) {
            if (limitOrdersMarks.length > 1) {
                newSeries.setMarkers([...marketOrdersMarks.slice(1), ...limitOrdersMarks.slice(1)])
            } else {
                newSeries.setMarkers(marketOrdersMarks.slice(1))
            }
        }

        if (limitOrdersMarks.length > 1) {
            if (marketOrdersMarks.length > 1) {
                newSeries.setMarkers([...marketOrdersMarks.slice(1), ...limitOrdersMarks.slice(1)])
            } else {
                newSeries.setMarkers(limitOrdersMarks.slice(1))
            }
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [marketOrdersMarks, limitOrdersMarks]);

    useEffect(() => {
        const WORKING_STATUS = "Working";
        const FILLED_STATUS = "Filled";

        const limitOrdersWorking = limitOrders.filter(order => order.status === WORKING_STATUS)

        if (currentCryptoData && currentCryptoData.close && limitOrdersWorking) {
            setLimitOrders(prev => {
                return prev.map(order => {
                    if (currentCryptoData.close >= order.limit_price && order.status === WORKING_STATUS) {
                        if (order.side === "Buy") {
                            setBalanceTradeableCrypto(prev => plus(prev, order.quantity))

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

                        if (order.side === "Sell") {
                            setBalanceUSDT(prev => plus(prev, order.quantity * order.limit_price))

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
                    }

                    return order
                })
            })
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [currentCryptoData?.close]);

    return (
        <div className="chart">
            <div ref={chartContainerRef}/>
        </div>
    )
}

export default memo(Chart)