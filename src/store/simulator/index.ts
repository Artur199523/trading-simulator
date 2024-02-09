import { createSlice } from '@reduxjs/toolkit'
import { getCryptoTradingHistory } from './actions'
import {SimulatorStoreITF} from "./type";

const initialState:SimulatorStoreITF = {
    tradingHistoryAllData: {
        loading: false,
        success: false,
        error: null,
        data: null,
    },
    tradingHistoryPartData: {
        data: [],
    },
    tradingHistoryVolumeAllData: {
        data: [],
    },
    tradingHistoryVolumePartData: {
        data: [],
    },
}

const simulatorSlice = createSlice({
    name: 'simulator',
    initialState,
    reducers: {},
    extraReducers: builder => {
        builder
            .addCase(getCryptoTradingHistory.pending, state => {
                state.tradingHistoryAllData.loading = true
            })
            .addCase(getCryptoTradingHistory.fulfilled, (state, action) => {
                const { tradingHistoryAllData, tradingHistoryPartData ,tradingHistoryVolumeAllData,tradingHistoryVolumePartData} = action.payload

                state.tradingHistoryAllData.loading = false
                state.tradingHistoryAllData.error = null
                state.tradingHistoryAllData.success = true
                state.tradingHistoryAllData.data = tradingHistoryAllData
                state.tradingHistoryPartData.data = tradingHistoryPartData
                state.tradingHistoryVolumeAllData.data = tradingHistoryVolumeAllData
                state.tradingHistoryVolumePartData.data = tradingHistoryVolumePartData
            })
            .addCase(getCryptoTradingHistory.rejected, (state, action) => {
                state.tradingHistoryAllData.loading = false
                state.tradingHistoryAllData.error = action.payload as any
                state.tradingHistoryAllData.success = false
                state.tradingHistoryAllData.data = null
                state.tradingHistoryPartData.data = null
                state.tradingHistoryVolumeAllData.data = null
                state.tradingHistoryVolumePartData.data = null
            })
    },
})

const simulatorReducer = simulatorSlice.reducer
export default simulatorReducer
