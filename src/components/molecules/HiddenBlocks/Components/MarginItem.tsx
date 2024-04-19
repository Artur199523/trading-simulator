import classNames from "classnames";
import React from "react";

import {Button} from "components";

import {MarginItemITF} from "../type";

import "../style.scss"
import {Arrow} from "../../../../assets/svg";

const MarginItem: React.FC<MarginItemITF> = (
    {
        data,
        mode,
        title,
        isActive,
        underTitle,
        callBackSettings,
        callBackRequirement
    }
) => {
    const constMarginItemStyle = classNames("hidden-block_margin-mode_item", {"active": isActive});

    return (
        <div className={constMarginItemStyle}>
            <h3>{title}</h3>
            <h4>{underTitle}</h4>
            <div className="hidden-block_margin-mode_item_section-block">
                {data.map((mode, index) =>
                    <section key={index}>
                        <h5>{mode.section_name}</h5>
                        <ol>
                            {mode.list.map((item, index) => (
                                <li key={index}>{item}</li>
                            ))}
                        </ol>
                    </section>
                )}
            </div>
            {
                isActive
                    ? <div className="hidden-block_margin-mode_item_using-block">Currently Using</div>
                    : <div className="hidden-block_margin-mode_item_btn-block">
                        <Button view="two" onClick={() => callBackSettings(mode)}>Setting</Button>
                        <button onClick={() => callBackRequirement(mode)}>See Requirements <Arrow/></button>
                    </div>
            }
        </div>
    )
}

export default MarginItem