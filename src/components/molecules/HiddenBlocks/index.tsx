import React from "react";

import {useHiddenBlocksContext} from "layouts/providers";
import Settings from "./Settings";
import classNames from "classnames";
import MarginMode from "./MarginMode";

const HiddenBlocks: React.FC = () => {
    const {hiddenBlock} = useHiddenBlocksContext()

    const hiddenBlockStyle = classNames("hidden-block", {"block-open": hiddenBlock})

    return (
        <div className={hiddenBlockStyle}>
            <Settings className={hiddenBlock}/>
            <MarginMode className={hiddenBlock}/>
        </div>
    )
}

export default HiddenBlocks