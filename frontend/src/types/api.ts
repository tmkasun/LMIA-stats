
export interface ILMIA {
    _id?: string;
    province?: string;
    programStream?: string;
    employer?: string;
    address?: string;
    occupation?: string;
    incorporateStatus?: string;
    approvedLMIAs?: number;
    approvedPositions?: number;
    time?: string;
}

export type LMIAResponseData = {
    payload?: ILMIA[];
    pagination?: {
        total: number;
    }
    error?: string;
};