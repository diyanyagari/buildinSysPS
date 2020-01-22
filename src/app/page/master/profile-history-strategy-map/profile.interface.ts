export interface Strategy {
    namaStrategy?: string,
    noUrut?: number,
    kdStrategyHead?: number,
    kdDepartemen?: number,
    version?: number,
    noRec?: string,
    statusEnabled?: boolean,
    namaExternal?: string,
    namaDepartemen?: string
    kode: any,
}

export interface Perspective {
    noUrut?: 4,
    namaPerspective?: string,
    kdDepartemen?: number,
    version?: number,
    noRec?: string,
    statusEnabled?: boolean,
    reportsDisplay?: string,
    namaExternal?: string,
    namaDepartemen?: string,
    kdPerspectiveHead?: number,
    kode?: any;
}
export interface iProfileHistoryStrategyMap {
    namaStrategy?: string,
    noHistori?: number,
    kdProfile?: number,
    namaPerspective?: string,
    kdDepartemen?: number,
    version?: number,
    noRec?: string,
    statusEnabled?: true,
    kdPerspective?: number,
    tglAkhir?: number,
    namaDepartemen?: string,
    kdStrategy?: number,
    tglAwal?: number
}
