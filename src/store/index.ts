import { configureStore } from '@reduxjs/toolkit'

import simulatorReducer from "./simulator"
import { useDispatch,TypedUseSelectorHook,useSelector } from "react-redux";

export type AppDispatch = typeof store.dispatch

export type RootState = ReturnType<typeof store.getState>

export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector
export const useAppDispatch: () => AppDispatch = useDispatch
export const store = configureStore({
    reducer: {
        simulator: simulatorReducer
    },
    middleware: getDefaultMiddleware =>
        getDefaultMiddleware({
            serializableCheck: false,
        }),
})
