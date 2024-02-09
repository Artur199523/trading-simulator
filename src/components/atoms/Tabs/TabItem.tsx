import React,{memo} from "react";
import {TabItemITF} from "./type";

import "./style.scss"

const TabItem:React.FC<TabItemITF> = ({id, children, activeTab, setActiveTab }) => {
    const handleClick = () => {
        setActiveTab(id);
    };

    return (
        <div onClick={()=>handleClick()} className={`tab_item ${activeTab === id ? "active" : ""}`}>
            {children}
        </div>
    );
}
export default memo(TabItem)