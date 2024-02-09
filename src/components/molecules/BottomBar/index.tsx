import React,{memo} from "react";

import {useSimulatorToolsContext} from "layouts/providers";

import "./style.scss"
const BottomBar:React.FC = () => {
    const {setIsPlay,isPlay,setNext,next,setCurrentSpeed,currentSpeed} = useSimulatorToolsContext()

    return(
        <div className="bottom-bar">
            <div className="bottom-bar_control-tools">
                <button onClick={() => setIsPlay(!isPlay)}>{isPlay ? "Stop" : "Play"}</button>
                <button disabled={next} onClick={() => setNext(true)}>Next</button>
                <button className={currentSpeed === 1 ? "active" :""} onClick={()=>setCurrentSpeed(1)}>x1</button>
                <button className={currentSpeed === 3 ? "active" :""} onClick={()=>setCurrentSpeed(3)}>x3</button>
                <button className={currentSpeed === 10 ? "active" :""} onClick={()=>setCurrentSpeed(10)}>x10</button>
            </div>
        </div>
    )
}

export default memo(BottomBar)