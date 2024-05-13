export interface FlexibleTableITF {
    isPadding?: boolean
    header: FlexibleTableHeaderITF[]
    body: any
}

export interface FlexibleTableItemITF {
    header: FlexibleTableHeaderITF
    row: any
}

export interface FlexibleTableHeaderITF {
    value: string
    displayName: string
    className?: string
    currency?: string
    isFormat?: boolean
    isFixed?: number
}