import React, {useRef, useState} from 'react';

import {useSimulatorToolsContext} from "layouts/providers";
import {useOnClickOutSide} from "hooks";

import {CurrentSpeedT} from "layouts/providers/type";

import {NextStep, Pause, Play} from "assets/svg";
import "./style.scss"

const ChartControlBar: React.FC<any> = () => {
    const {setIsPlay, isPlay, setNext, next, setCurrentSpeed, currentSpeed} = useSimulatorToolsContext()
    const [isOpenOptions, setIsOpenOptions] = useState(false)
    const optionsBlockRef = useRef(null)

    useOnClickOutSide(optionsBlockRef, () => setIsOpenOptions(false))

    const checkSpeed = (speed: CurrentSpeedT) => {
        setCurrentSpeed(speed)
        setIsOpenOptions(false)
    }

    return (
        <div className="chart-control-bar">
            <div className="chart-control-bar_block">
                <button onClick={() => setIsPlay(!isPlay)}>{isPlay ? <Pause/> : <Play/>}</button>
                <button disabled={next} onClick={() => setNext(true)}><NextStep/></button>
                <div className="chart-control-bar_block_speed">
                    <button onClick={() => setIsOpenOptions(!isOpenOptions)}>{currentSpeed}x</button>
                    {isOpenOptions && <div ref={optionsBlockRef} className="chart-control-bar_block_speed_options">
                        <h5>Simulation Speed</h5>
                        <SpeedOptionsItem isActive={currentSpeed === 10} setSpeed={checkSpeed} speed={10}/>
                        <SpeedOptionsItem isActive={currentSpeed === 3} setSpeed={checkSpeed} speed={3}/>
                        <SpeedOptionsItem isActive={currentSpeed === 1} setSpeed={checkSpeed} speed={1}/>
                    </div>}
                </div>
            </div>
        </div>
    )
}

export default ChartControlBar

const SpeedOptionsItem: React.FC<{ speed: number, setSpeed: any, isActive: boolean }> = ({speed, setSpeed, isActive}) => (
    <div onClick={() => setSpeed(speed)} className={`chart-control-bar_block_speed_options_item ${isActive ? "active" : ""}`}>
        <span>{speed}x</span>
        <span>{speed} upd. in sec.</span>
    </div>
)