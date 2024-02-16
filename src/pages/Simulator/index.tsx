import React from "react";

import {TopBar, BottomBar, RightBar, Chart, ToastGlobalContainer} from "components"

import "./style.scss";

const Simulator: React.FC = () => {
    return (
        <div className="simulator">
            <TopBar/>
            <div className="simulator_container">
                <Chart/>
                <RightBar/>
            </div>
            <BottomBar/>
            <ToastGlobalContainer/>
        </div>
    )
}

export default Simulator