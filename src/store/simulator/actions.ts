import {createAsyncThunk} from '@reduxjs/toolkit'
import {TradingHistoryITF, TradingVolumeITF} from "./type";
import {CryptoTypeT, CurrencyT, IntervalT} from "layouts/providers/type";

const fetchCryptoTradingHistory = async (
    timeTo: number,
    timeInterval: IntervalT,
    cryptoType: CryptoTypeT,
    currencyType: CurrencyT
): Promise<TradingHistoryITF> => {
    const query = `${timeInterval}?fsym=${cryptoType}&tsym=${currencyType}&limit=2000&toTs=${timeTo}&aggregate=1&e=CCCAGG`
    const response = await fetch(`https://min-api.cryptocompare.com/data/v2/${query}`)

    return await response.json()
}

export const getCryptoTradingHistory = createAsyncThunk(
    'get/crypto/trading/history',
    async (body: { timeInterval: any, cryptoType: any, currencyType: any, timeTo: any }, {rejectWithValue}) => {
        try {
            const {timeInterval, cryptoType, currencyType, timeTo} = body

            const fetchTradingHistory = async (time: number) => {
                return await fetchCryptoTradingHistory(time, timeInterval, cryptoType, currencyType)
            }

            const resultOne = await fetchTradingHistory(timeTo)

            // const resultTwo = await fetchTradingHistory(resultOne.Data.TimeFrom)
            // const resultThree = await fetchTradingHistory(resultTwo.Data.TimeFrom)

            const tradingHistoryAllData = resultOne.Data.Data

            let prevVolume = 0;
            const tradingHistoryVolumeAllData:TradingVolumeITF[] = tradingHistoryAllData.map((value: any) => {
                let color = '#26a69a';
                if (value.volumeto < prevVolume) {
                    color = '#ef5350';
                }

                prevVolume = value.volumeto;

                return {
                    time: value.time,
                    value: value.volumeto,
                    color: color
                }
            })

            const tradingHistoryPartData = tradingHistoryAllData.splice(0, 100)
            const tradingHistoryVolumePartData = tradingHistoryVolumeAllData.splice(0, 100)

            return {tradingHistoryAllData, tradingHistoryPartData, tradingHistoryVolumeAllData, tradingHistoryVolumePartData}
        } catch (error) {
            return rejectWithValue('Something went wrong')
        }
    }
)
export const simulatorService = {
    getCryptoTradingHistory,
}
