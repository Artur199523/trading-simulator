import React, {memo, useState} from "react";

import {useSimulatorToolsContext} from "layouts/providers";

import "./style.scss"
import {OrdersBlock} from "../../index";
const BottomBar:React.FC = () => {
    const {setIsPlay,isPlay,setNext,next,setCurrentSpeed,currentSpeed} = useSimulatorToolsContext()
    const [isOpen,setIsOpen] = useState(false)

    return(
        <div className="bottom-bar">
            <div className="bottom-bar_show-orders">
                <button onClick={()=>setIsOpen(true)}>| Show Orders |</button>
            </div>
            <div className="bottom-bar_control-tools">
                <button onClick={() => setIsPlay(!isPlay)}>{isPlay ? "Stop" : "Play"}</button>
                <button disabled={next} onClick={() => setNext(true)}>Next</button>
                <button className={currentSpeed === 1 ? "active" :""} onClick={()=>setCurrentSpeed(1)}>x1</button>
                <button className={currentSpeed === 3 ? "active" :""} onClick={()=>setCurrentSpeed(3)}>x3</button>
                <button className={currentSpeed === 10 ? "active" :""} onClick={()=>setCurrentSpeed(10)}>x10</button>
            </div>
            <OrdersBlock isOpen={isOpen} setIsOpen={setIsOpen}/>
        </div>
    )
}

export default memo(BottomBar)