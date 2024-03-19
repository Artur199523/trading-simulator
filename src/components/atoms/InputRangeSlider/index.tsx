import React from "react";
import {RangeSliderITF} from "./type";
import "./style.scss";

const RangeSlider: React.FC<RangeSliderITF> = ({onChange, value, max, sliderMarksType, name}) => {
    const percentage = (value / max) * 100;

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
            {sliderMarksType &&
                <React.Fragment>
                    {sliderMarksType === "25" ?
                        <div className="sliderMarks">
                            <span>0%</span>
                            <span>5%</span>
                            <span>10%</span>
                            <span>15%</span>
                            <span>20%</span>
                            <span>25%</span>
                        </div>
                        : <div className="sliderMarks">
                            <span>0%</span>
                            <span>50%</span>
                            <span>100%</span>
                            <span>150%</span>
                        </div>}
                </React.Fragment>
            }

        </div>
    );
};

export default RangeSlider;