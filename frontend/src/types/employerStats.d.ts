export interface IEmployerStatsResponse {
    payload: IEmployerStatsPayload
    pagination: Pagination,
}

export interface IEmployerStatsPayload {
    byProvince: IByProvince[]
    byQuarter: IByQuarter[]
    byOccupation: ByOccupation[]
    byAddress: IByAddress[]
    totalStats: TotalStat[]
}

export interface IByAddress {
    _id: string
    totalLMIAs: number
    totalPositions: number
}

export interface IByProvince {
    _id?: string
    totalLMIAs: number
    totalPositions: number
    address: string
}

export interface IByQuarter {
    totalLMIAs: number
    totalPositions: number
    year: number
    quarter: number
}

export interface ByOccupation {
    _id: string
    totalLMIAs: number
    totalPositions: number
}

export interface TotalStat {
    totalLMIAs: number
    totalPositions: number
    uniqueEmployerCount: number
}

export interface Pagination {
    total: number
}

export type IEmployerStatsRequest = {
    name: string;
};