import { QueryFunctionContext } from "react-query";
import { ISearch } from "~/pages";
import { ILMIA, LMIAMetaData, LMIAResponseData } from "~/types/api";
import { API_BASE_PATH } from "~/utils/utils";

export const getLMIAs = async (context: QueryFunctionContext): Promise<LMIAResponseData> => {
  const { queryKey } = context;
  const [, payload] = queryKey;
  const queryParams = new URLSearchParams(payload as any);
  const apiEndpoint = `${API_BASE_PATH}/ircc/lmia?${queryParams}`;
  const response = await fetch(apiEndpoint);
  if (response.ok) {
    const responseData = (await response.json()) as LMIAResponseData;
    return responseData;
  } else {
    throw new Error("Error while fetching the data");
  }
};

export const getMetaData = async (context: QueryFunctionContext): Promise<any> => {
  const apiEndpoint = `${API_BASE_PATH}/ircc/metadata`;
  const response = await fetch(apiEndpoint);
  if (response.ok) {
    const responseData = (await response.json()) as LMIAMetaData;
    return responseData;
  } else {
    throw new Error("Error while fetching the data");
  }
};

export const getGeoStats = async (context: QueryFunctionContext): Promise<any> => {
  const { queryKey } = context;
  const [, payload] = queryKey;
  const queryParams = new URLSearchParams(payload as any);
  const apiEndpoint = `${API_BASE_PATH}/ircc/geo?${queryParams}`;
  const response = await fetch(apiEndpoint);
  if (response.ok) {
    const responseData = (await response.json()) as any;
    return responseData;
  } else {
    throw new Error("Error while fetching the data");
  }
};
