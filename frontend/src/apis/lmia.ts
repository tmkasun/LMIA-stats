import { QueryFunctionContext } from "react-query";
import { ISearch } from "~/pages";
import { ILMIA, LMIAResponseData } from "~/types/api";
import { API_BASE_PATH } from "~/utils/utils";

export const getLMIAs = async (context: QueryFunctionContext): Promise<LMIAResponseData> => {
    const { queryKey } = context;
    const [, payload] = queryKey;
    const queryParams = new URLSearchParams(payload as any);
    const apiEndpoint = `${API_BASE_PATH}/ircc/lmia?${queryParams}`;
    const response = await fetch(apiEndpoint);
    if (response.ok) {
        const responseData = await response.json() as LMIAResponseData;
        return responseData;
    } else {
        throw new Error("Error while fetching the data");
    }
};
