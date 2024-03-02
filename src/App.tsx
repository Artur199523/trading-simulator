import {Provider} from "react-redux"
import React from 'react';

import {store} from "./store";
import {
    FuturesTradingProvider,
    SimulatorToolsProvider,
    SimulatorTradingProvider,
    SimulatorOptionsProvider,
    SimulatorPLayerInfoProvider,
    SimulatorTradingChartDetailsProvider
} from "./layouts/providers";

import {FuturesTradingModals} from "components";
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
                                <FuturesTradingProvider>
                                    <Simulator/>
                                    <FuturesTradingModals/>
                                </FuturesTradingProvider>
                            </SimulatorTradingChartDetailsProvider>
                        </SimulatorPLayerInfoProvider>
                    </SimulatorTradingProvider>
                </SimulatorToolsProvider>
            </SimulatorOptionsProvider>
        </Provider>
    );
}

export default App;
