import {ColorType} from "lightweight-charts";

export const chartOptions = (chartRef:any) => {
    return {
        timeScale:{
            rightOffset: 50,
            fixLeftEdge: true,
            lockVisibleTimeRangeOnResize: true,
            rightBarStaysOnScroll: true,
            borderVisible: true,
            borderColor: "gray",
            timeVisible: true,
            secondsVisible: true,
            shiftVisibleRangeOnNewBar: true,
        },
        layout: {
            background: {type: ColorType.Solid, color: "rgba(22,22,33,0.6)"},
            textColor: "white",
        },
        grid: {
            horzLines: {
                color: '#0095fa42',
            },
            vertLines: {
                color: '#0095fa42',
            },
        },
        rightPriceScale: {
            borderColor: "gray",
        },
        width: chartRef.clientWidth,
        height: window.innerHeight - 250,
    }
}

export const candleStickOptions:{upColor:string,downColor:string,borderVisible:boolean,wickUpColor:string,wickDownColor:string,baseLineWidth:number} = {
    upColor: '#26a69a',
    downColor: '#ef5350',
    borderVisible: true,
    wickUpColor: '#26a69a',
    wickDownColor: '#ef5350',
    baseLineWidth: 1,
}

export const histogramOptions = {
    color: '#26a69a',
    priceFormat: {
        type: 'volume',
    },
    priceScaleId: '',
}

export const histogramApplyOptions = {
    scaleMargins: {
        top: 0.9,
        bottom: 0,
    },
}