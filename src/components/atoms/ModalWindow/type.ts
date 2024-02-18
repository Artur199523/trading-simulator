import React from "react"

export interface ModalWindowITF {
    show: boolean
    title: React.ReactNode
    children?: React.ReactNode
}