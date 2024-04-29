import React, {useRef, useState} from "react";

import {RangeSliderITF} from "./type";

import "./style.scss";

const RangeSlider: React.FC<RangeSliderITF> = ({onChange, value, max, name, division, symbol = "%", disabled}) => {
    const percentage = (value / max) * 100;
    const percentLineCount = new Array(division + 1).fill(" ")
    const initialPercent = max / division
    const [hovered, setHovered] = useState(false);

    const tooltipRef = useRef(null);
    const sliderRef = useRef(null);

    return (
        <div className="sliderContainer">
            <input
                ref={sliderRef}
                min="0"
                max={max}
                name={name}
                type="range"
                value={value}
                className="slider"
                disabled={disabled}
                onMouseEnter={() => setHovered(true)}
                onMouseLeave={() => setHovered(false)}
                onChange={(event) => onChange(event)}
                style={{
                    background: `linear-gradient(90deg, rgba(0, 149, 250, 1) ${percentage}%, rgb(255, 255, 255, 0.5) ${percentage}%)`
                }}
            />
            <div
                ref={tooltipRef}
                className={"sliderContainer_tooltip" + (hovered ? " active" : "")}
                style={{left: `0%`}}>
                {value}{symbol}
            </div>
            {division &&
                <React.Fragment>
                    <div className="sliderMarks">
                        {percentLineCount.map((_, index) =>
                            <span key={index}>{initialPercent * index} {symbol}</span>
                        )}
                    </div>
                </React.Fragment>
            }

        </div>
    );
};

export default RangeSlider;