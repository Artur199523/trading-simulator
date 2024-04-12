import React from "react";

import {TopBar, RightBar, Chart, ToastGlobalContainer, BottomOrdersBar} from "components"

import "./style.scss";

const Simulator: React.FC = () => {
    return (
        <div className="simulator">
            <TopBar/>
            <div className="simulator_container">
                <div className="simulator_container_chart-block">
                    <Chart/>
                    <BottomOrdersBar/>
                </div>
                <RightBar/>
            </div>
            <ToastGlobalContainer/>
        </div>
    )
}

export default Simulator