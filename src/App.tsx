import {Provider} from "react-redux"
import React from 'react';

import {store} from "./store";
import {
    SimulatorToolsProvider,
    SimulatorTradingProvider,
    SimulatorOptionsProvider,
    SimulatorPLayerInfoProvider,
    SimulatorTradingChartDetailsProvider
} from "./layouts/providers";

import Simulator from "./pages/Simulator";

import './App.css';

function App() {
    return (
        <Provider store={store}>
            <SimulatorOptionsProvider>
                <SimulatorToolsProvider>
                    <SimulatorTradingProvider>
                        <SimulatorPLayerInfoProvider>
                            <SimulatorTradingChartDetailsProvider>
                                <Simulator/>
                            </SimulatorTradingChartDetailsProvider>
                        </SimulatorPLayerInfoProvider>
                    </SimulatorTradingProvider>
                </SimulatorToolsProvider>
            </SimulatorOptionsProvider>
        </Provider>
    );
}

export default App;
