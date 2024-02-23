interface HeaderITF {
    value: string,
    displayName: string
}

type DataType = {
    [key: string]: any;
}[];

export interface TableITF {
    headers: HeaderITF[];
    data: DataType;
    hasButton?: boolean;
    buttonCallBack?: (order:any) => void
}