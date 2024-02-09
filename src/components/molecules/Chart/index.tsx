import React, {useEffect, useRef, useState, memo} from "react";
import {createChart} from "lightweight-charts";

import {useSimulatorOptionsContext, useSimulatorToolsContext, useSimulatorTradingChartDetailsContext} from "layouts/providers";
import {candleStickOptions, chartOptions, histogramApplyOptions, histogramOptions} from "./options";
import {getCryptoTradingHistory} from "store/simulator/actions";
import {useAppDispatch, useAppSelector} from "store";

import {HistoryItem, TradingVolumeITF} from "store/simulator/type";

import "./style.scss"

const Chart: React.FC = () => {
    const dispatch = useAppDispatch()

    const {isPlay, next, currentSpeed, setNext} = useSimulatorToolsContext()
    const {currency, interval, cryptoType, date} = useSimulatorOptionsContext()
    const {setCurrentCryptoData,marketOrdersMarks,currentCryptoData} = useSimulatorTradingChartDetailsContext()

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

                setCurrentCryptoData(partHistory[partHistory.length-1])

                volumeSeries.priceScale().applyOptions(histogramApplyOptions);

                setNewSeries(newSeries as any)
                setNewVolumeSeries(volumeSeries as any)

                window.addEventListener('resize', handleResize);

                return () => {
                    window.removeEventListener('resize', handleResize);

                    chart.remove();
                };
            }
        },
        [partHistory, partVolumeHistory]);

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
    }, [next])

    useEffect(() => {
        if(marketOrdersMarks.length > 1){
            newSeries.setMarkers(marketOrdersMarks.slice(1))
        }
    }, [marketOrdersMarks]);

    return (
        <div className="chart">
            <div ref={chartContainerRef}/>
        </div>
    )
}

export default memo(Chart)