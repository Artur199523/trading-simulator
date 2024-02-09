import React from "react";

export interface TabITF {
    id: string
    children: React.ReactNode
    activeTab: string
}
export interface TabItemITF extends TabITF{
    setActiveTab: (type:string)=>void
}

