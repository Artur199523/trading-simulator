import React, {memo} from "react";
import {TabITF} from "./type";

const TabContent: React.FC<TabITF> = ({id, activeTab, children}) => {
    return (
        activeTab === id ?
            <div className="TabContent">
                {children}
            </div>
            : null
    );
}

export default memo(TabContent)