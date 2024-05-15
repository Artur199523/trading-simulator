import {Provider} from "react-redux"
import React from 'react';
import {Routes, Route} from "react-router-dom"
import {store} from "./store";
import {
    HiddenBlocksProvider,
    FuturesTradingProvider,
    SimulatorToolsProvider,
    SimulatorTradingProvider,
    SimulatorOptionsProvider,
    SimulatorPLayerInfoProvider,
    SimulatorTradingChartDetailsProvider
} from "./layouts/providers";

import {FuturesTradingModals, HiddenBlocks} from "components";
import Simulator from "./pages/Simulator";

import './App.css';
import Faucet from "./pages/Faucet";

function App() {
    return (
        <Routes>
            <Route path="/" element={<Provider store={store}>
                <SimulatorOptionsProvider>
                    <SimulatorToolsProvider>
                        <SimulatorTradingProvider>
                            <SimulatorPLayerInfoProvider>
                                <SimulatorTradingChartDetailsProvider>
                                    <FuturesTradingProvider>
                                        <HiddenBlocksProvider>
                                            <Simulator/>
                                            <FuturesTradingModals/>
                                            <HiddenBlocks/>
                                        </HiddenBlocksProvider>
                                    </FuturesTradingProvider>
                                </SimulatorTradingChartDetailsProvider>
                            </SimulatorPLayerInfoProvider>
                        </SimulatorTradingProvider>
                    </SimulatorToolsProvider>
                </SimulatorOptionsProvider>
            </Provider>}/>
            <Route path="/faucet" element={<Faucet/>}/>
        </Routes>
    );
}

export default App;
