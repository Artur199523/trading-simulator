import React from "react";

import {RangeSliderITF} from "./type";

import "./style.scss";

const RangeSlider: React.FC<RangeSliderITF> = ({onChange, value, max, name, division, symbol = "%"}) => {
    const percentage = (value / max) * 100;
    const percentLineCount = new Array(division + 1).fill(" ")
    const initialPercent = max / division

    return (
        <div className="sliderContainer">
            <input
                min="0"
                max={max}
                name={name}
                type="range"
                value={value}
                className="slider"
                onChange={(event) => onChange(event)}
                style={{
                    background: `linear-gradient(90deg, gold ${percentage}%, rgb(255, 255, 255, 0.5) ${percentage}%)`
                }}
            />
            {division &&
                <React.Fragment>
                    <div className="sliderMarks">
                        {percentLineCount.map((_, index) =>
                            <span key={index}>{initialPercent * index}{symbol}</span>
                        )}
                    </div>
                </React.Fragment>
            }

        </div>
    );
};

export default RangeSlider;