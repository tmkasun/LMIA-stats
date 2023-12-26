import { Sort, SortDirection } from "mongodb";
import type { NextApiRequest, NextApiResponse } from "next";
import { getCollection } from "~/lib/mongodb";
import { ILMIA, LMIAResponseData } from "~/types/api";

export const allowedQueryParamsMapping: { [key: string]: keyof ILMIA } = {
    province: "province",
    isnegative: "isNegative",
    programstream: "programStream",
    employer: "employer",
    occupation: "occupation",
    time: "time",
    approvedlmias: "approvedLMIAs",
    approvedpositions: "approvedPositions",
    address: "address",
};

export default async function handler(req: NextApiRequest, res: NextApiResponse<LMIAResponseData>) {
    try {
        const collection = await getCollection();
        const { query } = req;

        let limit = 10;
        let page = 0;
        let searchQuery: { [key: string]: RegExp | boolean } = {};
        for (let [key, value] of Object.entries(query)) {
            const allowedQueryParams = [...Object.keys(allowedQueryParamsMapping), "limit", "offset", "sortby", "page", "order"];
            if (!allowedQueryParams.includes(key.toLowerCase())) {
                res.status(400).json({ error: `'${key}' is not one of the allowed keys (${allowedQueryParams.join()})` });
                return;
            }
            if (typeof value === "string" && Object.keys(allowedQueryParamsMapping).includes(key.toLowerCase())) {
                if (key.toLowerCase() === "isnegative") {
                    if (value.toLowerCase() === "true") {
                        searchQuery[allowedQueryParamsMapping[key.toLowerCase()]] = true;
                    }
                } else {
                    var regex = new RegExp(value, "i");
                    searchQuery[allowedQueryParamsMapping[key.toLowerCase()]] = regex;
                }
            }
        }

        const limitParam = Object.entries(query).find(([k, v]) => k.toLowerCase() === "limit");
        if (limitParam) {
            limit = parseInt(limitParam[1] as string);
        }

        const pageParam = Object.entries(query).find(([k, v]) => k.toLowerCase() === "page");
        if (pageParam) {
            page = parseInt(pageParam[1] as string);
        }

        const sortByParam = Object.entries(query).find(([k, v]) => k.toLowerCase() === "sortby");
        const orderParam = Object.entries(query).find(([k, v]) => k.toLowerCase() === "order");
        let sortBy: Sort = { "time": -1 };
        if (sortByParam) {
            let order: SortDirection = -1;
            if (orderParam) {
                const [, orderDirection] = orderParam;
                if (!["asc", "desc", "-1", "1"].includes((orderDirection as string).toLowerCase())) {
                    throw new Error(`${orderDirection} is not valid sort order string, has to be one of 'asc', 'desc', -1, 1`);
                }
                order = parseInt(orderDirection as string) as SortDirection;
            }
            sortBy = { [sortByParam[1] as string]: order };
        }
        const data = await collection.aggregate<{ data: ILMIA[], totalCount: [{ count: number }] }>([
            { "$match": searchQuery },
            { "$sort": sortBy },
            {
                $facet: {
                    data: [{ $skip: page * 10 }, { $limit: limit }],
                    totalCount: [
                        {
                            $count: "count"
                        }
                    ]
                }
            }
        ],
            { allowDiskUse: true },
        ).allowDiskUse(true).toArray();
        const [{ data: payload, totalCount }] = data;
        res.status(200).json({ payload, pagination: { total: totalCount.length && totalCount[0].count } });
    } catch (error) {
        console.error(error);
        res.status(500).json({ error: `${error}` });
    }
}
