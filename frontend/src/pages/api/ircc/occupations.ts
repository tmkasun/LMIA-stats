import { Sort, SortDirection } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import clientPromise, { getCollection } from "~/lib/mongodb";
import { ILMIA, LMIAResponseData } from "~/types/api";

export const allowedQueryParamsMapping: { [key: string]: keyof ILMIA } = {
    occupation: "occupation",
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<LMIAResponseData>) {
    try {
        const collection = await getCollection();
        const { query } = req;
        let limit = 10;
        let searchQuery: { [key: string]: RegExp } = {};
        for (let [key, value] of Object.entries(query)) {
            const allowedQueryParams = [...Object.keys(allowedQueryParamsMapping), "limit", "offset", "sortby", "page", "order"];
            if (!allowedQueryParams.includes(key.toLowerCase())) {
                res.status(400).json({ error: `'${key}' is not one of the allowed keys (${allowedQueryParams.join()})` });
                return;
            }
            if (typeof value === "string" && Object.keys(allowedQueryParamsMapping).includes(key.toLowerCase())) {
                var regex = new RegExp(value, "i");
                searchQuery[allowedQueryParamsMapping[key]] = regex;
            }
        }
        const limitParam = Object.entries(query).find(([k, v]) => k.toLowerCase() === "limit");
        if (limitParam) {
            limit = parseInt(limitParam[1] as string);
        }

        const sortByParam = Object.entries(query).find(([k, v]) => k.toLowerCase() === "sortby");
        const orderParam = Object.entries(query).find(([k, v]) => k.toLowerCase() === "order");
        const sortBy: Sort = {};
        if (sortByParam) {
            let order: SortDirection = -1;
            if (orderParam) {
                if (!["asc", "desc"].includes((orderParam[1] as string).toLowerCase())) {
                    throw new Error(`${orderParam[1]} is not valid sort order string, has to be one of 'asc', 'desc', -1, 1`);
                }
                order = orderParam[1] as SortDirection;
            }
            sortBy[sortByParam[1] as string] = order;
        }
        const searchCursor = await collection.distinct("occupation", searchQuery);
        res.status(200).json({ payload: searchCursor, pagination: { total: searchCursor.length } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `${error}` });
    }
}
